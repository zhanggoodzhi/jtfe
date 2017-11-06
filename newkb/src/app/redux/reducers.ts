import { deployReducer as deploy, IDeploy } from 'deploy';
import { configurationReducer as configuration, IConfiguration } from 'configuration';
import { formBuilderReducer as formBuilder, IFormBuilder } from 'formbuilder';
import { knowledgeDetailReducer as knowledgeDetail, IKnowledgeDetail } from 'knowledgeDetail';

export interface IStore {
    deploy: IDeploy;
    configuration: IConfiguration;
    formBuilder: IFormBuilder;
    knowledgeDetail: IKnowledgeDetail;
}

const reducers = {
    deploy,
    configuration,
    formBuilder,
    knowledgeDetail
};

export default reducers;
