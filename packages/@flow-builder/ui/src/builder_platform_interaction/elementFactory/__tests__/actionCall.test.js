import { createActionCall, createDuplicateActionCall, createActionCallMetadataObject } from '../actionCall';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

expect.extend(deepFindMatchers);

const mockGuid = 'mockGuid';

const flowInputParameterWithDefaultValueAsString = {
        name: 'text',
        value: {
            stringValue: 'This is message'
        },
        processMetadataValues: [],
    };

const storeInputParameterWithDefaultValueAsString = {
    name: 'text',
    value: 'This is message',
    valueDataType: 'String',
    rowIndex: mockGuid
};

const flowInputParameterWithDefaultValueAsReference = {
    name: 'subjectNameOrId',
    value: {
        elementReference: 'var_text'
    },
    processMetadataValues: [],
};

const storeInputParameterWithDefaultValueAsReference = {
    name: 'subjectNameOrId',
    value: 'var_text',
    valueDataType: 'reference',
    rowIndex: mockGuid
};

const flowOutputParameterWithDefaultValue = {
    name: "feedId",
    assignToReference: 'var_text',
    processMetadataValues: [],
};

const storeOutputParameterWithDefaultValue = {
    name: "feedId",
    value: 'var_text',
    valueDataType: 'reference',
    rowIndex: mockGuid
};

const actionCallMetaData = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    inputParameters: [
        flowInputParameterWithDefaultValueAsString,
        flowInputParameterWithDefaultValueAsReference
    ],
    label: 'My Post to Chatter',
    locationX: 353,
    locationY: 57,
    name: 'My_Post_to_Chatter',
    outputParameters: [
        flowOutputParameterWithDefaultValue
    ],
    processMetadataValues: [],
};

const actionCallInStore = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    guid: 'a08ba1ea-8216-47c6-b32a-551864086a27',
    name: 'My_Post_to_Chatter',
    description: '',
    label: 'My Post to Chatter',
    locationX: 353,
    locationY: 57,
    isCanvasElement: true,
    connectorCount: 0,
    availableConnections: [
      {
          type: 'REGULAR'
      },
      {
          type: 'FAULT'
      }
    ],
    config: {
      isSelected: false
    },
    inputParameters: [
        storeInputParameterWithDefaultValueAsString,
        storeInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        storeOutputParameterWithDefaultValue
    ],
    maxConnections: 2,
    elementType: 'ACTION_CALL'
};

const parametersWithoutProcessMetaDataValue = (parameters, isInput) => {
    return parameters.map(param => {
        if (isInput) {
            return {
                name: param.name,
                value: param.value,
            };
        }
        return {
            name: param.name,
            assignToReference: param.assignToReference,
        };
    });
};

describe('actionCall', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createActionCall function', () => {
        let actionCall;
        describe('when empty actionCall is created', () => {
            beforeEach(() => {
                actionCall = createActionCall();
            });

            it('creates element of type ACTION_CALL', () => {
                expect(actionCall.elementType).toEqual(ELEMENT_TYPE.ACTION_CALL);
            });

            it('has empty actionName', () => {
                expect(actionCall.actionName).toEqual('');
            });

            it('has empty actionType', () => {
                expect(actionCall.actionType).toEqual('');
            });

            it('has no input parameters by default', () => {
                expect(actionCall.inputParameters).toHaveLength(0);
            });

            it('has no output parameters by default', () => {
                expect(actionCall.outputParameters).toHaveLength(0);
            });
            it('has dataType of boolean', () => {
                expect(actionCall.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow actionCall is passed', () => {
            beforeEach(() => {
                actionCall = createActionCall(actionCallMetaData);
            });
            it('creates element of type ACTION_CALL', () => {
                expect(actionCall.elementType).toEqual(ELEMENT_TYPE.ACTION_CALL);
            });
            it('has actionName equal to actionName from store', () => {
                expect(actionCall.actionName).toEqual(actionCallMetaData.actionName);
            });
            it('has actionType equal to actionType from store', () => {
                expect(actionCall.actionType).toEqual(actionCallMetaData.actionType);
            });
            it('has inputParameters matching the inputParameters from store', () => {
                expect(actionCall.inputParameters).toEqual(actionCallInStore.inputParameters);
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(actionCall.outputParameters).toEqual(actionCallInStore.outputParameters);
            });
            it('has dataType of boolean', () => {
                expect(actionCall.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with action call metadata passed as parameter', () => {
                expect(actionCall).toHaveNoCommonMutableObjectWith(actionCallMetaData);
            });
        });

        describe('when store actionCall is passed', () => {
            beforeEach(() => {
                actionCall = createActionCall(actionCallInStore);
            });
            it('has actionName equal to actionName from store', () => {
                expect(actionCall.actionName).toEqual(actionCallInStore.actionName);
            });
            it('has actionType equal to actionType from store', () => {
                expect(actionCall.actionType).toEqual(actionCallInStore.actionType);
            });
            it('has inputParameters matching the inputParameters from store', () => {
                expect(actionCall.inputParameters).toEqual(actionCallInStore.inputParameters);
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(actionCall.outputParameters).toEqual(actionCallInStore.outputParameters);
            });
            it('has dataType of boolean', () => {
                expect(actionCall.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with action call from store passed as parameter', () => {
                expect(actionCall).toHaveNoCommonMutableObjectWith(actionCallInStore);
            });
        });
    });

    describe('createDuplicateActionCall function', () => {
        const originalActionCall = {
            guid: 'originalGuid',
            name: 'originalName',
            label: 'label',
            elementType: ELEMENT_TYPE.ACTION_CALL,
            locationX: 100,
            locationY: 100,
            config: {
                isSelectd: true,
                isHighlighted: false
            },
            connectorCount: 1,
            maxConnections: 2,
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ]
        };
        const { duplicatedElement } = createDuplicateActionCall(originalActionCall, 'duplicatedGuid', 'duplicatedName');

        it('has the new guid', () => {
            expect(duplicatedElement.guid).toEqual('duplicatedGuid');
        });
        it('has the new name', () => {
            expect(duplicatedElement.name).toEqual('duplicatedName');
        });
        it('has the updated locationX', () => {
            expect(duplicatedElement.locationX).toEqual(originalActionCall.locationX + 50);
        });
        it('has the updated locationY', () => {
            expect(duplicatedElement.locationY).toEqual(originalActionCall.locationY + 50);
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
        it('has maxConnections set to 2', () => {
            expect(duplicatedElement.maxConnections).toEqual(2);
        });
        it('has the right elementType', () => {
            expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.ACTION_CALL);
        });
        it('has default availableConnections', () => {
            expect(duplicatedElement.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR
            }, {
                type: CONNECTOR_TYPE.FAULT
            }]);
        });
    });

    describe('createActionCallMetadataObject function', () => {
        let actionCallMetaDataObject;
        describe('when store actionCall is passed', () => {
            beforeEach(() => {
                actionCallMetaDataObject = createActionCallMetadataObject(actionCallInStore);
            });
            it('has actionName equal to actionName from flow', () => {
                expect(actionCallMetaDataObject.actionName).toEqual(actionCallMetaData.actionName);
            });
            it('has actionType equal to actionType from flow', () => {
                expect(actionCallMetaDataObject.actionType).toEqual(actionCallMetaData.actionType);
            });
            it('has inputParameters matching the inputParameters from flow', () => {
                expect(actionCallMetaDataObject.inputParameters).toEqual(parametersWithoutProcessMetaDataValue(actionCallMetaData.inputParameters, true));
            });
            it('has outputParameters matching the outputParameters from flow', () => {
                expect(actionCallMetaDataObject.outputParameters).toEqual(parametersWithoutProcessMetaDataValue(actionCallMetaData.outputParameters, false));
            });
        });
    });
});