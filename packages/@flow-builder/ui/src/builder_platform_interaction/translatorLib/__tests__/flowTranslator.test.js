import { translateFlowToUIModel } from "../flowToUiTranslator";
import { translateUIModelToFlow } from "../uiToFlowTranslator";
import { flowWithVariables } from './flowTestData/flowWithVariablesTestData';
import { flowWithAssignments } from "./flowTestData/flowWithAssignmentsTestData";

describe('Getting flow metadata, calling flow-to-ui translation and calling ui-to-flow', () => {
    it('for variables should return same object', () => {
        const expectedFlowMetadataForVariables = flowWithVariables.metadata.variables;
        const uiFlow = translateFlowToUIModel(flowWithVariables);
        const actualFlowMetadataForVariables = translateUIModelToFlow(uiFlow).metadata.variables;
        expect(actualFlowMetadataForVariables).toMatchObject(expectedFlowMetadataForVariables);
    });
    it('for assignments should return same object', () => {
        const expectedFlowMetadataForAssignments = flowWithAssignments.metadata.assignments;
        const uiFlow = translateFlowToUIModel(flowWithAssignments);
        const actualFlowMetadataForAssignments = translateUIModelToFlow(uiFlow).metadata.assignments;
        expect(actualFlowMetadataForAssignments).toMatchObject(expectedFlowMetadataForAssignments);
    });
});