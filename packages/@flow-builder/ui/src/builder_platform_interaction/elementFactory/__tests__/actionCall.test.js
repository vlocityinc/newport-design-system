import { createActionCall, createActionCallMetadataObject } from '../actionCall';
import { ELEMENT_TYPE} from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const mockGuid = 'mockGuid';

const flowInputParameterWithDefaultValueAsString = {
        name: 'text',
        value: {
            stringValue: 'This is message'
        }
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
    }
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
};

const storeOutputParameterWithDefaultValue = {
    name: "feedId",
    value: 'var_text',
    valueDataType: 'reference',
    rowIndex: mockGuid
};

const defaultFlowActionCall = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    inputParameters: [
        flowInputParameterWithDefaultValueAsString,
        flowInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        flowOutputParameterWithDefaultValue
    ]
};

const defaultStoreActionCall = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    inputParameters: [
        storeInputParameterWithDefaultValueAsString,
        storeInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        storeOutputParameterWithDefaultValue
    ]
};

describe('actionCall', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createActionCall function', () => {
        let actionCall;
        describe('when empty actionCall is created', () => {
            beforeAll(() => {
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
            beforeAll(() => {
                actionCall = createActionCall(defaultFlowActionCall);
            });
            it('creates element of type ACTION_CALL', () => {
                expect(actionCall.elementType).toEqual(ELEMENT_TYPE.ACTION_CALL);
            });
            it('has actionName equal to actionName from store', () => {
                expect(actionCall.actionName).toEqual(defaultStoreActionCall.actionName);
            });
            it('has actionType equal to actionType from store', () => {
                expect(actionCall.actionType).toEqual(defaultStoreActionCall.actionType);
            });
            it('has inputParameters match the inputParameters from store', () => {
                expect(actionCall.inputParameters).toEqual([storeInputParameterWithDefaultValueAsString, storeInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the inputParameters from store', () => {
                expect(actionCall.outputParameters).toEqual([storeOutputParameterWithDefaultValue]);
            });
            it('has dataType of boolean', () => {
                expect(actionCall.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when store actionCall is passed', () => {
            beforeAll(() => {
                actionCall = createActionCall(defaultStoreActionCall);
            });
            it('has actionName equal to actionName from store', () => {
                expect(actionCall.actionName).toEqual(defaultStoreActionCall.actionName);
            });
            it('has actionType equal to actionType from store', () => {
                expect(actionCall.actionType).toEqual(defaultStoreActionCall.actionType);
            });
            it('has inputParameters match the inputParameters from store', () => {
                expect(actionCall.inputParameters).toEqual([storeInputParameterWithDefaultValueAsString, storeInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the inputParameters from store', () => {
                expect(actionCall.outputParameters).toEqual([storeOutputParameterWithDefaultValue]);
            });
            it('has dataType of boolean', () => {
                expect(actionCall.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
    describe('createActionCallMetadataObject function', () => {
        let actionCallMetaData;
        describe('when store actionCall is passed', () => {
            beforeAll(() => {
                actionCallMetaData = createActionCallMetadataObject(defaultStoreActionCall);
            });
            it('has actionName equal to actionName from flow', () => {
                expect(actionCallMetaData.actionName).toEqual(defaultFlowActionCall.actionName);
            });
            it('has actionType equal to actionType from flow', () => {
                expect(actionCallMetaData.actionType).toEqual(defaultFlowActionCall.actionType);
            });
            it('has inputParameters match the inputParameters from flow', () => {
                expect(actionCallMetaData.inputParameters).toEqual([flowInputParameterWithDefaultValueAsString, flowInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the outputParameters from flow', () => {
                expect(actionCallMetaData.outputParameters).toEqual([flowOutputParameterWithDefaultValue]);
            });
        });
    });
});