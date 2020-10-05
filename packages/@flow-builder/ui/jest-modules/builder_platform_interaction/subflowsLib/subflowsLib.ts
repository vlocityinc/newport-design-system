import { flowWithActiveAndLatest as mockFlowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';

const actual = jest.requireActual('builder_platform_interaction/subflowsLib');

export const getActiveOrLatestFlowOutputVariables = jest.fn().mockImplementation((flowName) => {
    if (flowName === 'flowWithActiveAndLatest') {
        return actual.getActiveOrLatestInputOutputVariables(mockFlowWithActiveAndLatest).outputVariables;
    }
    return undefined;
});
