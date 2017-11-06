export interface ISchema {
    _id: string;
    require: boolean;
    type: string;
    label: string;
    placeholder?: string;
    options?: Array<{
        label: string;
        value: any;
    }>;
    multiple?: boolean;
}
