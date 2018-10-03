import { mergeInputOutputParameters } from "../calloutEditorLib";
import { mockActionParameters } from "mock/calloutData";

const mockGuid = 'mockGuid';

const nodeInputParameters = [
    {
        rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
        name: {
          value: 'subjectNameOrId',
          error: null
        },
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
      },
      {
          rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
          name: {
            value: 'text',
            error: null
          },
          value: {
            value: 'This is a message',
            error: null
          },
          valueDataType: 'String',
          valueGuid: 'This is a message',
      }
    ];

const nodeOutputParameters = [
    {
        rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
        name: {
          value: 'feedItemId',
          error: null
        },
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
    }
];

const duplicatedOutputParameters = [
    {
        rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
        name: {
          value: 'feedItemId',
          error: null
        },
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
    },
    {
        rowIndex: 'abd34jhb-5858-474c-8f87-0fc38a5c7ebf',
        name: {
          value: 'feedItemId',
          error: null
        },
        value: {
          value: 'textVar1',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: 'dh78nd45-afd1-4ddb-9d7e-fdfe6ab5703f'
    }
];

const mergedInputs = [
    {
        dataType: 'String',
        isInput: true,
        isRequired: false,
        label: 'Community Id',
        maxOccurs: 1,
        name: 'communityId',
        rowIndex: mockGuid,
    },
    {
        dataType: 'String',
        isInput: true,
        isRequired: true,
        label: 'Target Name or ID',
        maxOccurs: 1,
        name: 'subjectNameOrId',
        rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f'
    },
    {
        dataType: 'String',
        isInput: true,
        isRequired: true,
        label: 'Message',
        maxOccurs: 1,
        name: 'text',
        rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
        value: {
          value: 'This is a message',
          error: null
        },
        valueDataType: 'String',
        valueGuid: 'This is a message',
    },
];

const mergedOutputs = [
    {
        dataType: 'String',
        isInput: false,
        isRequired: false,
        label: 'Feed Item ID',
        maxOccurs: 1,
        name: 'feedItemId',
        rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
    }
];

const duplicatedMergedOutputs = [
    {
        dataType: 'String',
        isInput: false,
        isRequired: false,
        label: 'Feed Item ID',
        maxOccurs: 1,
        name: 'feedItemId',
        rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
        value: {
          value: 'textVar',
          error: null
        },
        valueDataType:'reference',
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
    },
    {
        dataType: 'String',
        isInput: false,
        isRequired: false,
        label: 'Feed Item ID',
        maxOccurs: 1,
        name: 'feedItemId',
        rowIndex: 'abd34jhb-5858-474c-8f87-0fc38a5c7ebf',
        value: {
          value: 'textVar1',
          error: null
        },
        valueDataType: 'reference',
        valueGuid: 'dh78nd45-afd1-4ddb-9d7e-fdfe6ab5703f'
    }
];

describe('ActionCall/ApexPlugin parameters merge', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    it('merges input and output parameters', () => {
        const mergedParameters = mergeInputOutputParameters(mockActionParameters, nodeInputParameters, nodeOutputParameters);
        expect(mergedParameters.inputs).toEqual(mergedInputs);
        expect(mergedParameters.outputs).toEqual(mergedOutputs);
    });
    it('merges duplicated output parameters', () => {
        const mergedParameters = mergeInputOutputParameters(mockActionParameters, null, duplicatedOutputParameters);
        expect(mergedParameters.outputs).toEqual(duplicatedMergedOutputs);
    });
});
