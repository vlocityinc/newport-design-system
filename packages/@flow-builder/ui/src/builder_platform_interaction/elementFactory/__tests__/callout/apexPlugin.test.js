import { createApexPlugin, createApexPluginMetadataObject } from '../../apexPlugin';
import { ELEMENT_TYPE} from "builder_platform_interaction/flowMetadata";

const mockGuid = 'mockGuid';

const flowInputParameterWithDefaultValueAsString = {
    name: 'name',
    value: {
        stringValue: 'My name'
    }
};

const storeInputParameterWithDefaultValueAsString = {
    name: 'name',
    value: 'My name',
    valueDataType: 'String',
    valueGuid: 'My name',
    rowIndex: mockGuid
};

const flowInputParameterWithDefaultValueAsReference = {
    name: 'phone',
    value: {
        elementReference: 'var_text'
    }
};

const storeInputParameterWithDefaultValueAsReference = {
    name: 'phone',
    value: 'var_text',
    valueDataType: 'reference',
    valueGuid: 'var_text',
    rowIndex: mockGuid
};

const flowOutputParameterWithDefaultValue = {
    name: "accountId",
    assignToReference: 'var_text',
};

const storeOutputParameterWithDefaultValue = {
    name: "accountId",
    value: 'var_text',
    valueDataType: 'reference',
    valueGuid: 'var_text',
    rowIndex: mockGuid
};

const defaultFlowApexPlugin = {
    apexClass: 'flowChat',
    inputParameters: [
        flowInputParameterWithDefaultValueAsString,
        flowInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        flowOutputParameterWithDefaultValue
    ]
};

const defaultStoreApexPlugin = {
    apexClass: 'flowChat',
    inputParameters: [
        storeInputParameterWithDefaultValueAsString,
        storeInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        storeOutputParameterWithDefaultValue
    ]
};

describe('apexPlugin', () => {
    const storeLib = require.requireActual('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createApexPlugin function', () => {
        let apexPlugin;
        describe('when empty apexPlugin is created', () => {
            beforeAll(() => {
                apexPlugin = createApexPlugin();
            });

            it('creates element of type APEX_PLUGIN_CALL', () => {
                expect(apexPlugin.elementType).toEqual(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            });

            it('has empty apexClass', () => {
                expect(apexPlugin.apexClass).toEqual('');
            });

            it('has no input parameters by default', () => {
                expect(apexPlugin.inputParameters).toHaveLength(0);
            });

            it('has no output parameters by default', () => {
                expect(apexPlugin.outputParameters).toHaveLength(0);
            });
        });

        describe('when flow apexPlugin is passed', () => {
            beforeAll(() => {
                apexPlugin = createApexPlugin(defaultFlowApexPlugin);
            });
            it('creates element of type APEX_PLUGIN_CALL', () => {
                expect(apexPlugin.elementType).toEqual(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            });
            it('has apexClass equal to apexClass from store', () => {
                expect(apexPlugin.apexClass).toEqual(defaultStoreApexPlugin.apexClass);
            });
            it('has inputParameters match the inputParameters from store', () => {
                expect(apexPlugin.inputParameters).toEqual([storeInputParameterWithDefaultValueAsString, storeInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the outputParameters from store', () => {
                expect(apexPlugin.outputParameters).toEqual([storeOutputParameterWithDefaultValue]);
            });
        });

        describe('when store apexPlugin is passed', () => {
            beforeAll(() => {
                apexPlugin = createApexPlugin(defaultStoreApexPlugin);
            });
            it('has apexClass equal to apexClass from store', () => {
                expect(apexPlugin.apexClass).toEqual(defaultStoreApexPlugin.apexClass);
            });
            it('has inputParameters match the inputParameters from store', () => {
                expect(apexPlugin.inputParameters).toEqual([storeInputParameterWithDefaultValueAsString, storeInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the outputParameters from store', () => {
                expect(apexPlugin.outputParameters).toEqual([storeOutputParameterWithDefaultValue]);
            });
        });
    });
    describe('createApexPluginMetadataObject function', () => {
        let apexPluginMetaData;
        describe('when store apexPlugin is passed', () => {
            beforeAll(() => {
                apexPluginMetaData = createApexPluginMetadataObject(defaultStoreApexPlugin);
            });
            it('has apexClass equal to apexClass from flow', () => {
                expect(apexPluginMetaData.apexClass).toEqual(defaultFlowApexPlugin.apexClass);
            });
            it('has inputParameters match the inputParameters from flow', () => {
                expect(apexPluginMetaData.inputParameters).toEqual([flowInputParameterWithDefaultValueAsString, flowInputParameterWithDefaultValueAsReference]);
            });
            it('has outputParameters match the outputParameters from flow', () => {
                expect(apexPluginMetaData.outputParameters).toEqual([flowOutputParameterWithDefaultValue]);
            });
        });
    });
});