import { orchestratorFlowUIModel } from './storeDataOrchestratorFlowUIModel';
export * from './storeDataOrchestratorFlowUIModel';

export const getElementByName = (name) => {
    const elements = orchestratorFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const Decision1 = getElementByName('Decision1');
export const Decision2 = getElementByName('Decision2');
export const step1OfStage1 = getElementByName('Step_1_of_Stage_1');
export const step2OfStage1 = getElementByName('Step_2_of_Stage_1');
