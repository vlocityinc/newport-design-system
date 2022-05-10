import { recommendationFlowUIModel } from './storeDataRecommendationFlowUIModel';
export * from './storeDataRecommendationFlowUIModel';

export const getElementByName = (name) => {
    const elements = recommendationFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const mapCollectionProcessor = getElementByName('Accounts_to_Recommendations');
export const filterCollectionProcessor = getElementByName('Filter_Apex_collection');
export const sortCollectionProcessor = getElementByName('Sort_Apex_Collection');
