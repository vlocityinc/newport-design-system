import { createApexPlugin, createDuplicateApexPlugin, createApexPluginMetadataObject } from '../apexPlugin';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

expect.extend(deepFindMatchers);

const mockGuid = 'mockGuid';

const flowInputParameterWithDefaultValueAsString = {
    name: 'name',
    value: {
        stringValue: 'My name'
    },
    processMetadataValues: [],
};

const storeInputParameterWithDefaultValueAsString = {
    name: 'name',
    value: 'My name',
    valueDataType: 'String',
    rowIndex: mockGuid
};

const flowInputParameterWithDefaultValueAsReference = {
    name: 'phone',
    value: {
        elementReference: 'var_text'
    },
    processMetadataValues: [],
};

const storeInputParameterWithDefaultValueAsReference = {
    name: 'phone',
    value: 'var_text',
    valueDataType: 'reference',
    rowIndex: mockGuid
};

const flowOutputParameterWithDefaultValue = {
    name: "accountId",
    assignToReference: 'var_text',
    processMetadataValues: [],
};

const storeOutputParameterWithDefaultValue = {
    name: "accountId",
    value: 'var_text',
    valueDataType: 'reference',
    rowIndex: mockGuid
};

const apexPluginMetaData = {
    apexClass: 'flowChat',
    label: 'flowChatApexPlugin',
    name: 'flowChatApexPlugin',
    locationX: 391,
    locationY: 297,
    inputParameters: [
        flowInputParameterWithDefaultValueAsString,
        flowInputParameterWithDefaultValueAsReference
    ],
    outputParameters: [
        flowOutputParameterWithDefaultValue
    ],
    processMetadataValues: [],
};

const apexPluginInStore = {
    apexClass: 'flowChat',
    guid: '721ca5d6-0e53-4340-a53f-3d4482241a52',
    name: 'flowChatApexPlugin',
    description: '',
    label: 'flowChatApexPlugin',
    locationX: 391,
    locationY: 297,
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
    elementType: 'APEX_PLUGIN_CALL'
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
describe('apexPlugin', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createApexPlugin function', () => {
        let apexPlugin;
        describe('when empty apexPlugin is created', () => {
            beforeEach(() => {
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
            it('has dataType of boolean', () => {
                expect(apexPlugin.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        describe('when flow apexPlugin is passed', () => {
            beforeEach(() => {
                apexPlugin = createApexPlugin(apexPluginMetaData);
            });
            it('creates element of type APEX_PLUGIN_CALL', () => {
                expect(apexPlugin.elementType).toEqual(ELEMENT_TYPE.APEX_PLUGIN_CALL);
            });
            it('has apexClass equal to apexClass from store', () => {
                expect(apexPlugin.apexClass).toEqual(apexPluginInStore.apexClass);
            });
            it('has inputParameters matching the inputParameters from store', () => {
                expect(apexPlugin.inputParameters).toEqual(apexPluginInStore.inputParameters);
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(apexPlugin.outputParameters).toEqual(apexPluginInStore.outputParameters);
            });
            it('has dataType of boolean', () => {
                expect(apexPlugin.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with apex plugin metadata passed as parameter', () => {
                expect(apexPlugin).toHaveNoCommonMutableObjectWith(apexPluginMetaData);
            });
        });

        describe('when store apexPlugin is passed', () => {
            beforeEach(() => {
                apexPlugin = createApexPlugin(apexPluginInStore);
            });
            it('has apexClass equal to apexClass from store', () => {
                expect(apexPlugin.apexClass).toEqual(apexPluginInStore.apexClass);
            });
            it('has inputParameters matching the inputParameters from store', () => {
                expect(apexPlugin.inputParameters).toEqual(apexPluginInStore.inputParameters);
            });
            it('has outputParameters matching the outputParameters from store', () => {
                expect(apexPlugin.outputParameters).toEqual(apexPluginInStore.outputParameters);
            });
            it('has dataType of boolean', () => {
                expect(apexPlugin.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
            it('has no common mutable object with apex plugin from store passed as parameter', () => {
                expect(apexPlugin).toHaveNoCommonMutableObjectWith(apexPluginInStore);
            });
        });
    });

    describe('createDuplicateApexPluginCall function', () => {
        const originalApexCall = {
            guid: 'originalGuid',
            name: 'originalName',
            label: 'label',
            elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL,
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
        const { duplicatedElement } = createDuplicateApexPlugin(originalApexCall, 'duplicatedGuid', 'duplicatedName');

        it('has the new guid', () => {
            expect(duplicatedElement.guid).toEqual('duplicatedGuid');
        });
        it('has the new name', () => {
            expect(duplicatedElement.name).toEqual('duplicatedName');
        });
        it('has the updated locationX', () => {
            expect(duplicatedElement.locationX).toEqual(originalApexCall.locationX + 50);
        });
        it('has the updated locationY', () => {
            expect(duplicatedElement.locationY).toEqual(originalApexCall.locationY + 50);
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
            expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.APEX_PLUGIN_CALL);
        });
        it('has default availableConnections', () => {
            expect(duplicatedElement.availableConnections).toEqual([{
                type: CONNECTOR_TYPE.REGULAR
            }, {
                type: CONNECTOR_TYPE.FAULT
            }]);
        });
    });

    describe('createApexPluginMetadataObject function', () => {
        let apexPluginMetaDataObject;
        describe('when store apexPlugin is passed', () => {
            beforeEach(() => {
                apexPluginMetaDataObject = createApexPluginMetadataObject(apexPluginInStore);
            });
            it('has apexClass equal to apexClass from flow', () => {
                expect(apexPluginMetaDataObject.apexClass).toEqual(apexPluginMetaData.apexClass);
            });
            it('has inputParameters match the inputParameters from flow', () => {
                expect(apexPluginMetaDataObject.inputParameters).toEqual(parametersWithoutProcessMetaDataValue(apexPluginMetaData.inputParameters, true));
            });
            it('has outputParameters matching the outputParameters from flow', () => {
                expect(apexPluginMetaDataObject.outputParameters).toEqual(parametersWithoutProcessMetaDataValue(apexPluginMetaData.outputParameters, false));
            });
        });
    });
});