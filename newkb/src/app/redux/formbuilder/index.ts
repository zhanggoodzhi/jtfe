import * as constants from 'constant';
import { arrayMove } from 'react-sortable-hoc';
import { uniqueId } from 'lodash';
import axios from 'helper/axios';

export const Types = {
    text: 'text',
    textarea: 'textarea',
    number: 'number',
    select: 'select',
    switch: 'switch',
    radio: 'radio',
    checkbox: 'checkbox',
    datePicker: 'datePicker',
    timePicker: 'timePicker'
};

export interface ISchema {
    id: string;
    require: boolean;
    type: string;
    label: string;
    property: string;
    key: string;
    placeholder?: string;
    options?: Array<{
        label: string;
        value: string;
        id: string;
    }>;
    multiple?: boolean;
}

export interface IClass {
    displayName: string;
    id: string;
    hasSub?: boolean;
    uri?: string;
    parent?: string;
}

export interface IProperty {
    displayName: string;
    type: string;
    iri: string;
    cls: string;
}

export interface IFormBuilder {
    schemas: ISchema[];
    activeSchema?: string;
    basicInfo: {
        name: string;
        comment: string;
    };
    classesMap: Map<string, IClass>;
    propertiesMap: Map<string, IProperty[]>;
    activeClasses: string[];
    openedClasses: string[];
}

export interface IFromBuilderAction {
    type: string;
    value: any;
}

const initialState: IFormBuilder = {
    schemas: [],
    basicInfo: {
        name: '',
        comment: ''
    },
    classesMap: new Map(),
    propertiesMap: new Map(),
    openedClasses: [],
    activeClasses: []
};

const findOption = (state: IFormBuilder, schemaId: string, optionId: string): { schemaIndex: number; optionIndex: number } => {
    const { schemas } = state;
    const schemaIndex = schemas.findIndex(schema => schema.id === schemaId);
    if (schemaIndex < 0) {
        return;
    }

    const schema = schemas[schemaIndex];
    const options = schema.options;
    const optionIndex = options.findIndex(option => option.id === optionId);

    if (optionIndex < 0) {
        return;
    }

    return {
        schemaIndex,
        optionIndex
    };
};

export const formBuilderReducer = (state: IFormBuilder = initialState, action: IFromBuilderAction): IFormBuilder => {
    switch (action.type) {
        case constants.INSERT_SCHEMA:
            return { ...state, schemas: state.schemas.concat(action.value) };
        case constants.DELETE_SCHEMA:
            const deletedIndex = state.schemas.findIndex(schema => schema.id === action.value);
            if (deletedIndex >= 0) {
                const deletedSchemas = state.schemas.slice();
                deletedSchemas.splice(deletedIndex, 1);

                return { ...state, schemas: deletedSchemas };
            }

            return state;

        case constants.UPDATE_SCHEMA:
            const { id: updateId, schema } = action.value;
            const updatedIndex = state.schemas.findIndex(schema => schema.id === updateId);
            if (updatedIndex >= 0) {
                const updatedSchemas = state.schemas.slice(),
                    updatedSchema = { ...state.schemas[updatedIndex], ...schema };

                updatedSchemas.splice(updatedIndex, 1, updatedSchema);

                return { ...state, schemas: updatedSchemas };
            }
            return state;

        case constants.UPDATE_SCHEMA_OPTION:
            const updatedOptionIndex = findOption(state, action.value.schemaId, action.value.optionId);

            if (!updatedOptionIndex) {
                return state;
            }
            const { option } = action.value;

            const updatedOptionSchemas = state.schemas.slice(),

                updatedOptionSchema = state.schemas[updatedOptionIndex.schemaIndex],

                updatedOptions = updatedOptionSchema.options.slice(),

                updatedOption = updatedOptions[updatedOptionIndex.optionIndex];

            updatedOptions.splice(updatedOptionIndex.optionIndex, 1, { ...updatedOption, ...option });

            Object.assign(updatedOptionSchema, {
                options: updatedOptions
            });

            updatedOptionSchemas.splice(updatedOptionIndex.schemaIndex, 1, updatedOptionSchema);

            return { ...state, schemas: updatedOptionSchemas };

        case constants.DELETE_SCHEMA_OPTION:
            const deletedOptionIndex = findOption(state, action.value.schemaId, action.value.optionId);

            if (!deletedOptionIndex) {
                return state;
            }

            const deletedOptionSchemas = state.schemas.slice(),

                deletedOptionSchema = deletedOptionSchemas[deletedOptionIndex.schemaIndex],

                deletedOptions = deletedOptionSchema.options.slice();

            deletedOptions.splice(deletedOptionIndex.optionIndex, 1);

            Object.assign(deletedOptionSchema, { options: deletedOptions });

            deletedOptionSchemas.splice(deletedOptionIndex.schemaIndex, 1, deletedOptionSchema);

            return { ...state, schemas: deletedOptionSchemas };

        case constants.INSERT_SCHEMA_OPTION:
            const insertedOptionindex = state.schemas.findIndex(schema => schema.id === action.value.schemaId);
            if (insertedOptionindex < 0) {
                return state;
            }

            const insertedOptionSchema = state.schemas[insertedOptionindex];

            const insertedOptionSchemas = state.schemas.slice();

            const options = insertedOptionSchema.options;

            Object.assign(insertedOptionSchema, {
                options: options.concat([{
                    label: '',
                    value: '',
                    id: uniqueId()
                }])
            });

            insertedOptionSchemas.splice(insertedOptionindex, 1, insertedOptionSchema);

            return { ...state, schemas: insertedOptionSchemas };

        case constants.EXCHANG_ESCHEMA:
            const { oldIndex, newIndex } = action.value;
            if (oldIndex !== newIndex) {
                return { ...state, schemas: arrayMove<ISchema>(state.schemas, oldIndex, newIndex) };
            }

            return state;
        case constants.SET_ACTIVE_SCHEMA:
            if (action.value !== state.activeSchema) {
                return { ...state, activeSchema: action.value };
            }

            return state;

        case constants.UPDATE_TEMPLATE_BASIC_INFO:
            return { ...state, basicInfo: { ...state.basicInfo, ...action.value } };

        case constants.INSERT_TEMPLATE_CLASS:
            const insertedClasses = new Map(state.classesMap);
            action.value.forEach((cls: IClass) => {
                insertedClasses.set(cls.id, cls);
            });

            if (insertedClasses.size === state.classesMap.size) {
                return state;
            }

            return { ...state, classesMap: insertedClasses };

        case constants.SET_ACTIVE_TEMPLATE_CLASSES:
            const activeClasses = action.value.filter(cls => !!state.classesMap.get(cls).parent);

            if (activeClasses.length <= 0) {
                return state;
            }

            return { ...state, activeClasses };
        case constants.SET_OPENED_TEMPLATE_CLASSES:
            return { ...state, openedClasses: action.value };

        case constants.INSERT_TEMPLATE_PROPERTIES:
            const insertedProperties = new Map(state.propertiesMap);
            const { id, properties } = action.value;
            insertedProperties.set(id, properties);

            if (insertedProperties.size === state.propertiesMap.size) {
                return state;
            }
            return { ...state, propertiesMap: insertedProperties };
        default:
            return state;
    }
};

export const deleteSchema = (schemaId: string) => {
    return {
        type: constants.DELETE_SCHEMA,
        value: schemaId
    };
};

export const deleteSchemaOption = (schemaId: string, optionId: string) => {
    return {
        type: constants.DELETE_SCHEMA_OPTION,
        value: {
            schemaId,
            optionId
        }
    };
};

export const updateSchema = (schemaId: string, schema: ISchema) => {
    return {
        type: constants.UPDATE_SCHEMA,
        value: {
            id: schemaId,
            schema
        }
    };
};

export const updateSchemaOption = (schemaId: string, optionId: string, option) => {
    return {
        type: constants.UPDATE_SCHEMA_OPTION,
        value: {
            schemaId,
            optionId,
            option
        }
    };
};

export const insertSchema = ({ type, label }) => {
    const schema: ISchema = {
        type,
        label: label + '的显示名称',
        key: '',
        property: null,
        id: uniqueId(),
        require: false
    };

    switch (type) {
        case Types.text:
        case Types.textarea:
            schema.placeholder = label + '的提示信息';
            break;
        case Types.select:
        case Types.radio:
        case Types.checkbox:
            schema.options = [
                {
                    label: '',
                    value: '',
                    id: uniqueId()
                },
                {
                    label: '',
                    value: '',
                    id: uniqueId()
                }
            ];
            break;
        default:
            break;
    }

    return {
        type: constants.INSERT_SCHEMA,
        value: schema

    };
};

export const insertSchemaOption = (schemaId: string) => {
    return {
        type: constants.INSERT_SCHEMA_OPTION,
        value: {
            schemaId
        }
    };
};

export const setActiveSchema = (schemaId: string) => {
    return {
        type: constants.SET_ACTIVE_SCHEMA,
        value: schemaId
    };
};

export const exchangeSchema = ({ oldIndex, newIndex }) => {
    return {
        type: constants.EXCHANG_ESCHEMA,
        value: {
            oldIndex,
            newIndex
        }
    };
};

export const updateTemplateBasicInfo = (info) => {
    return {
        type: constants.UPDATE_TEMPLATE_BASIC_INFO,
        value: info
    };
};

export const insertTemplateClass = (classes: IClass[]) => {
    return {
        type: constants.INSERT_TEMPLATE_CLASS,
        value: classes
    };
};

export const setActiveTemplateClasses = (ids: string[]) => {
    return (dispatch, getState) => {
        const { propertiesMap } = getState().formBuilder as IFormBuilder;
        dispatch({
            type: constants.SET_ACTIVE_TEMPLATE_CLASSES,
            value: ids
        });

        ids.forEach(id => {
            if (!propertiesMap.has(id)) {
                axios.get('/api/framework/class/props/keys', {
                    params: {
                        cls: id
                    }
                })
                    .then(res => {
                        const { data } = res;
                        if (!data.error) {
                            data.forEach(v => {
                                v.cls = id;
                            });
                            dispatch(insertTemplateProperties(id, data));
                        }
                    });
            }
        });
    };
};

export const setOpenedTemplateClasses = (ids: string[]) => {
    return {
        type: constants.SET_OPENED_TEMPLATE_CLASSES,
        value: ids
    };
};

export const insertTemplateProperties = (id: string, properties: IProperty[]) => {
    return {
        type: constants.INSERT_TEMPLATE_PROPERTIES,
        value: {
            id,
            properties
        }
    };
};
