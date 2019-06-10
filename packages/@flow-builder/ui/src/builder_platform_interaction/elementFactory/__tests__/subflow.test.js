import {
    createSubflow,
    createDuplicateSubflow,
    createSubflowMetadataObject,
    createSubflowWithConnectors
} from '../subflow';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

expect.extend(deepFindMatchers);

const subflowMetadata = {
    connector: {
        processMetadataValues: [],
        targetReference: 'screen'
    },
    flowName: 'mynamespace__subflow',
    inputAssignments: [
        {
            name: 'inputNumberVariable',
            processMetadataValues: [],
            value: {
                numberValue: 3
            }
        },
        {
            name: 'inputOutputNumberVariable',
            processMetadataValues: [],
            value: {
                elementReference: 'numberVariable1'
            }
        }
    ],
    label: 'subflowCall2',
    locationX: 561,
    locationY: 190,
    name: 'subflowCall2',
    outputAssignments: [
        {
            assignToReference: 'numberVariable2',
            name: 'outputNumberVariable',
            processMetadataValues: []
        }
    ],
    processMetadataValues: []
};

const subflowInStore = {
    guid: 'f0419a9c-393a-43bb-b818-030b0ba21a94',
    name: 'subflowCall2',
    description: '',
    label: 'subflowCall2',
    locationX: 561,
    locationY: 190,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false
    },
    flowName: 'mynamespace__subflow',
    inputAssignments: [
        {
            rowIndex: '23fa7962-13db-47af-8720-2ea11d203769',
            name: 'inputNumberVariable',
            value: '3',
            valueDataType: 'Number'
        },
        {
            rowIndex: 'cd5d9949-9e44-444a-8d49-7018be2c0ec9',
            name: 'inputOutputNumberVariable',
            value: 'numberVariable1',
            valueDataType: 'reference'
        }
    ],
    outputAssignments: [
        {
            rowIndex: '4024e59b-c767-430d-a811-020df5ddf160',
            name: 'outputNumberVariable',
            value: 'numberVariable2',
            valueDataType: 'reference'
        }
    ],
    maxConnections: 1,
    elementType: 'SUBFLOW'
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

const expectedSubflowMetadata = (subflow, { removeConnector = false } = {}) => {
    const copiedSubflow = deepCopy(subflow);
    delete copiedSubflow.processMetadataValues;
    if (removeConnector) {
        delete copiedSubflow.connector;
    }
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
                expectedSubflowInStore = subflowInStoreWithAnyRowIndexGuidExpected(
                    subflowInStore
                );
            });
            it('creates element of type SUBFLOW', () => {
                expect(subflow.elementType).toEqual(ELEMENT_TYPE.SUBFLOW);
            });
            it('has flowName equal to flowName from store', () => {
                expect(subflow.flowName).toEqual(
                    expectedSubflowInStore.flowName
                );
            });
            it('has inputAssignments matching the inputAssignments from store', () => {
                expect(subflow.inputAssignments).toEqual(
                    expectedSubflowInStore.inputAssignments
                );
            });
            it('has outputParameters matching the inputAssignments from store', () => {
                expect(subflow.outputAssignments).toEqual(
                    expectedSubflowInStore.outputAssignments
                );
            });
            it('has no common mutable object with subflow metadata passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(
                    subflowMetadata
                );
            });
        });
        describe('when subflow from store is passed', () => {
            let expectedSubflowInStore;
            beforeEach(() => {
                subflow = createSubflow(subflowInStore);
                // inputParameter changes the rowId property. It probably should not though
                expectedSubflowInStore = subflowInStoreWithAnyRowIndexGuidExpected(
                    subflowInStore
                );
            });
            it('has flowName equal to flowName from store', () => {
                expect(subflow.flowName).toEqual(
                    expectedSubflowInStore.flowName
                );
            });
            it('has inputAssignments matching the inputAssignments from store', () => {
                expect(subflow.inputAssignments).toEqual(
                    expectedSubflowInStore.inputAssignments
                );
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(subflow.outputAssignments).toEqual(
                    expectedSubflowInStore.outputAssignments
                );
            });
            it('has no common mutable object with subflow from store passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(subflowInStore);
            });
        });
        describe('createSubflowMetadataObject function', () => {
            describe('when store apexPlugin is passed', () => {
                beforeEach(() => {
                    subflow = createSubflowMetadataObject(subflowInStore);
                });
                it('is equal to the subflow metadata', () => {
                    // we don't pass config so connector cannot be recreated
                    const expectedSubflow = expectedSubflowMetadata(
                        subflowMetadata,
                        { removeConnector: true }
                    );
                    expect(subflow).toEqual(expectedSubflow);
                });
                it('has no common mutable object with subflow from store passed as parameter', () => {
                    expect(subflow).toHaveNoCommonMutableObjectWith(
                        subflowInStore
                    );
                });
            });
        });
        describe('createSubflowWithConnectors function', () => {
            beforeEach(() => {
                subflow = createSubflowWithConnectors(subflowMetadata);
            });
            it('has no common mutable object with subflow metadata passed as parameter', () => {
                expect(subflow).toHaveNoCommonMutableObjectWith(
                    subflowMetadata
                );
            });
        });
    });

    describe('createDuplicateSubflow function', () => {
        const originalSubflow = {
            guid: 'originalGuid',
            name: 'originalName',
            label: 'label',
            elementType: ELEMENT_TYPE.SUBFLOW,
            locationX: 100,
            locationY: 100,
            config: {
                isSelectd: true,
                isHighlighted: false
            },
            connectorCount: 1,
            maxConnections: 1
        };
        const { duplicatedElement } = createDuplicateSubflow(
            originalSubflow,
            'duplicatedGuid',
            'duplicatedName'
        );

        it('has the new guid', () => {
            expect(duplicatedElement.guid).toEqual('duplicatedGuid');
        });
        it('has the new name', () => {
            expect(duplicatedElement.name).toEqual('duplicatedName');
        });
        it('has the updated locationX', () => {
            expect(duplicatedElement.locationX).toEqual(
                originalSubflow.locationX + DUPLICATE_ELEMENT_XY_OFFSET
            );
        });
        it('has the updated locationY', () => {
            expect(duplicatedElement.locationY).toEqual(
                originalSubflow.locationY + DUPLICATE_ELEMENT_XY_OFFSET
            );
        });
        it('has isSelected set to true', () => {
            expect(duplicatedElement.config.isSelected).toBeTruthy();
        });
        it('has isHighlighted set to false', () => {
            expect(duplicatedElement.config.isHighlighted).toBeFalsy();
        });
        it('has connectorCount set to 0', () => {
            expect(duplicatedElement.connectorCount).toEqual(0);
        });
        it('has maxConnections set to 1', () => {
            expect(duplicatedElement.maxConnections).toEqual(1);
        });
        it('has the right elementType', () => {
            expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.SUBFLOW);
        });
    });
});
