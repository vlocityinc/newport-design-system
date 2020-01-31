import { createSubflow, createSubflowMetadataObject, createSubflowWithConnectors } from '../subflow';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual('builder_platform_interaction/processTypeLib');
    return Object.assign({}, actual, {
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn()
    });
});

expect.extend(deepFindMatchers);

const subflowMetadata = {
    name: 'mySubflowAutomaticOutput',
    description: '',
    label: 'mySubflowAutomaticOutput',
    locationX: 571,
    locationY: 126,
    flowName: 'TestFlow_EvaluateFormula',
    inputAssignments: [],
    outputAssignments: [],
    storeOutputAutomatically: true
};

const subflowInStore = {
    guid: '7023eed2-6df8-4329-be8b-11cd92f5f94d',
    name: 'mySubflowAutomaticOutput',
    description: '',
    label: 'mySubflowAutomaticOutput',
    locationX: 571,
    locationY: 126,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: true,
        isHighlighted: false
    },
    flowName: 'TestFlow_EvaluateFormula',
    inputAssignments: [],
    outputAssignments: [],
    maxConnections: 1,
    elementType: 'Subflow',
    storeOutputAutomatically: true,
    dataType: 'ActionOutput'
};

const subflowInStoreWithAnyRowIndexGuidExpected = subflow => {
    const copiedSubflow = deepCopy(subflow);
    copiedSubflow.inputAssignments.forEach(assignment => {
        assignment.rowIndex = expect.any(String);
    });
    copiedSubflow.outputAssignments.forEach(assignment => {
        assignment.rowIndex = expect.any(String);
    });
    return copiedSubflow;
};

const expectedSubflowMetadata = subflow => {
    const copiedSubflow = deepCopy(subflow);
    delete copiedSubflow.processMetadataValues;
    delete copiedSubflow.connector;

    if (!copiedSubflow.description) {
        copiedSubflow.description = '';
    }
    copiedSubflow.inputAssignments.forEach(assignment => {
        delete assignment.processMetadataValues;
        for (const key in assignment.value) {
            if (Object.prototype.hasOwnProperty.call(assignment.value, key)) {
                assignment.value[key] = assignment.value[key].toString();
            }
        }
    });
    copiedSubflow.outputAssignments.forEach(assignment => {
        delete assignment.processMetadataValues;
    });
    return copiedSubflow;
};

describe('subflow', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED);
    });
    describe('createSubflow function', () => {
        let subflow;
        describe('when empty subflow is created', () => {
            beforeEach(() => {
                subflow = createSubflow();
            });
            it('creates element of type SUBFLOW', () => {
                expect(subflow.elementType).toEqual(ELEMENT_TYPE.SUBFLOW);
            });
            it('has empty flowName', () => {
                expect(subflow.flowName).toEqual('');
            });
            it('has no input assignments', () => {
                expect(subflow.inputAssignments).toHaveLength(0);
            });
            it('has no output assignments', () => {
                expect(subflow.inputAssignments).toHaveLength(0);
            });
            it('has 1 as max connections (no fault connector)', () => {
                expect(subflow.maxConnections).toBe(1);
            });
        });
        describe('when subflow metadata is passed as parameter', () => {
            let expectedSubflowInStore;
            beforeEach(() => {
                subflow = createSubflow(subflowMetadata);
                expectedSubflowInStore = subflowInStoreWithAnyRowIndexGuidExpected(subflowInStore);
            });
            it('creates element of type SUBFLOW', () => {
                expect(subflow.elementType).toEqual(ELEMENT_TYPE.SUBFLOW);
            });
            it('has flowName equal to flowName from store', () => {
                expect(subflow.flowName).toEqual(expectedSubflowInStore.flowName);
            });
            it('has inputAssignments matching the inputAssignments from store', () => {
                expect(subflow.inputAssignments).toEqual(expectedSubflowInStore.inputAssignments);
            });
            it('has outputParameters matching the inputAssignments from store', () => {
                expect(subflow.outputAssignments).toEqual(expectedSubflowInStore.outputAssignments);
            });
            it('has no common mutable object with subflow metadata passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(subflowMetadata);
            });
        });
        describe('when subflow from store is passed', () => {
            let expectedSubflowInStore;
            beforeEach(() => {
                subflow = createSubflow(subflowInStore);
                // inputParameter changes the rowId property. It probably should not though
                expectedSubflowInStore = subflowInStoreWithAnyRowIndexGuidExpected(subflowInStore);
            });
            it('has flowName equal to flowName from store', () => {
                expect(subflow.flowName).toEqual(expectedSubflowInStore.flowName);
            });
            it('has inputAssignments matching the inputAssignments from store', () => {
                expect(subflow.inputAssignments).toEqual(expectedSubflowInStore.inputAssignments);
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(subflow.outputAssignments).toEqual(expectedSubflowInStore.outputAssignments);
            });
            it('has storeOutputAutomatically matching the storeOutputAutomatically from store', () => {
                expect(subflow.storeOutputAutomatically).toEqual(expectedSubflowInStore.storeOutputAutomatically);
            });
            it('has no common mutable object with subflow from store passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(subflowInStore);
            });
        });
        describe('createSubflow function', () => {
            describe('when store subflow is passed', () => {
                beforeEach(() => {
                    subflow = createSubflowMetadataObject(subflowInStore);
                });
                it('is equal to the subflow metadata', () => {
                    // we don't pass config so connector cannot be recreated
                    const expectedSubflow = expectedSubflowMetadata(subflowMetadata);
                    expect(subflow).toEqual(expectedSubflow);
                });
                it('has no common mutable object with subflow from store passed as parameter', () => {
                    expect(subflow).toHaveNoCommonMutableObjectWith(subflowInStore);
                });
            });
        });
        describe('createSubflowWithConnectors function', () => {
            beforeEach(() => {
                subflow = createSubflowWithConnectors(subflowMetadata);
            });
            it('has no common mutable object with subflow metadata passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(subflowMetadata);
            });
        });
    });
});
