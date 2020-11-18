// @ts-nocheck
import {
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue,
    getMenuItemForField,
    getMenuItemsForField,
    getSystemAndGlobalVariableMenuData
} from '../menuDataGenerator';
import { getDataTypeLabel, getDataTypeIcons, FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getResourceCategory } from 'builder_platform_interaction/elementLabelLib';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { SYSTEM_VARIABLE_PREFIX, SYSTEM_VARIABLE_CLIENT_PREFIX } from 'builder_platform_interaction/systemLib';
import {
    apexCallAutomaticAnonymousStringOutput,
    apexCallAutomaticAnonymousAccountOutput,
    createAccountWithAutomaticOutput
} from 'mock/storeData';
import {
    loopAccountAutomaticOutput,
    loopOnTextCollectionManualOutput,
    loopOnTextCollectionAutomaticOutput,
    loopOnApexTypeCollectionAutoOutput
} from 'mock/storeDataScheduleTriggered';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import collectionDataType from '@salesforce/label/FlowBuilderDataTypes.collectionDataType';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { setGlobalVariables, setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import { startElement as startElementRecordTriggered } from 'mock/storeDataRecordTriggered';
import { getStartElementFromState } from 'builder_platform_interaction/storeUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataTypeLib');
    return {
        getDataTypeLabel: jest.fn(actual.getDataTypeLabel),
        getDataTypeIcons: jest.fn(),
        FLOW_DATA_TYPE: actual.FLOW_DATA_TYPE,
        FEROV_DATA_TYPE: actual.FEROV_DATA_TYPE,
        isComplexType: actual.isComplexType
    };
});

jest.mock(
    '@salesforce/label/FlowBuilderDataTypes.collectionDataType',
    () => {
        return { default: '{0} Collection' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.loopApexAutoOutputSubtext',
    () => {
        return { default: 'Apex-Defined: {0}' };
    },
    { virtual: true }
);

jest.mock('builder_platform_interaction/storeUtils', () => ({
    getProcessType: jest.fn().mockImplementation(() => 'flow'),
    getStartElementFromState: jest.fn().mockImplementation(() => undefined)
}));

let mockGetResourceCategory = true;
const mockImplementationForGetResourceCategory = ({ elementType, dataType, isCollection, isSystemGeneratedOutput }) => {
    const actual = jest.requireActual('builder_platform_interaction/elementLabelLib');
    return mockGetResourceCategory
        ? ''
        : actual.getResourceCategory({
              elementType,
              dataType,
              isCollection,
              isSystemGeneratedOutput
          });
};

jest.mock('builder_platform_interaction/elementLabelLib', () => {
    return {
        getResourceCategory: jest
            .fn()
            .mockImplementation(({ elementType, dataType, isCollection, isSystemGeneratedOutput }) =>
                mockImplementationForGetResourceCategory({
                    elementType,
                    dataType,
                    isCollection,
                    isSystemGeneratedOutput
                })
            ),
        getResourceLabel: jest.fn().mockImplementation((resource) => resource.name)
    };
});

describe('menuDataGenerator', () => {
    describe('mutateFlowResourceToComboboxShape', () => {
        let mockResource;
        beforeEach(() => {
            mockResource = {
                dataType: FLOW_DATA_TYPE.STRING.value
            };
            mockGetResourceCategory = true;
        });
        it('calls getDataTypeLabel when given a non sobject resource with no label', () => {
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeLabel).toHaveBeenCalledWith(mockResource.dataType);
        });

        it('gets a localized label when getting subtext for a data type', () => {
            const mockLabel = 'sfdc label';
            getDataTypeLabel.mockReturnValueOnce(mockLabel);
            const result = mutateFlowResourceToComboboxShape(mockResource);
            expect(result.subText).toEqual(mockLabel);
        });

        it('gets the data type from a type object when dataType does not exist', () => {
            mockResource.dataType = undefined;
            mockResource.type = { type: FLOW_DATA_TYPE.STRING.value };
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeLabel).toHaveBeenCalledWith(mockResource.type.type);
            expect(getDataTypeIcons).toHaveBeenCalledWith(mockResource.type.type, expect.any(String));
            expect(getResourceCategory).toHaveBeenCalledWith({
                ...mockResource,
                dataType: mockResource.type.type
            });
        });

        it('calls getDataTypeIcons if no icon exists in type object', () => {
            mockResource.type = {};
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeIcons).toHaveBeenCalledTimes(1);
        });

        it('calls getDataTypeIcons when no icon exists', () => {
            mutateFlowResourceToComboboxShape(mockResource);
            expect(getDataTypeIcons).toHaveBeenCalledTimes(1);
        });
        it('sets Variables category to action with anonymous string output as resource', () => {
            mockGetResourceCategory = false;
            const mutatedResource = mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousStringOutput);

            expect(mutatedResource.category).toEqual('FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL');
        });
        describe('Subtext', () => {
            it('sets "Text" subtext to action with anonymous string output as resource', () => {
                mockGetResourceCategory = false;
                const mutatedResource = mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousStringOutput);

                expect(mutatedResource.subText).toEqual('FlowBuilderDataTypes.textDataTypeLabel');
            });
            it('sets "Account" subtext to action with anonymous account output as resource', () => {
                mockGetResourceCategory = false;
                const mutatedResource = mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousAccountOutput);

                expect(mutatedResource.subText).toEqual('Account');
            });
            it('sets "Text" subtext for "record create" in automatic output mode as resource', () => {
                const mutatedResource = mutateFlowResourceToComboboxShape(createAccountWithAutomaticOutput);

                expect(mutatedResource.subText).toEqual('FlowBuilderDataTypes.textDataTypeLabel');
            });
            it('sets "Text" subtext for variable without label ("String" datatype) as resource', () => {
                const mutatedResource = mutateFlowResourceToComboboxShape({
                    elementType: ELEMENT_TYPE.VARIABLE,
                    dataType: FLOW_DATA_TYPE.STRING.value
                });

                expect(mutatedResource.subText).toEqual('FlowBuilderDataTypes.textDataTypeLabel');
            });
            it('sets "" subtext for variable with no label and no dataType as resource', () => {
                const mutatedResource = mutateFlowResourceToComboboxShape({
                    elementType: ELEMENT_TYPE.VARIABLE
                });

                expect(mutatedResource.subText).toEqual('');
            });
            it('sets description as subtext for global variables', () => {
                const mutatedResource = mutateFlowResourceToComboboxShape({
                    guid: '$User.Name',
                    description: 'The user name'
                });
                expect(mutatedResource.value).toBe('$User.Name');
                expect(mutatedResource.subText).toBe('The user name');
            });
            describe('Loop', () => {
                it.each`
                    loop                                   | expectedSubtext
                    ${loopOnTextCollectionManualOutput}    | ${loopOnTextCollectionManualOutput.name}
                    ${loopAccountAutomaticOutput}          | ${'Account'}
                    ${loopOnTextCollectionAutomaticOutput} | ${'FlowBuilderDataTypes.textDataTypeLabel'}
                    ${loopOnApexTypeCollectionAutoOutput}  | ${'Apex-Defined: ApexComplexTypeTestOne216'}
                `('$loop.name should have subtext: $expectedSubtext', ({ loop, expectedSubtext }) => {
                    const mutatedResource = mutateFlowResourceToComboboxShape(loop);

                    expect(mutatedResource.subText).toEqual(expectedSubtext);
                });
            });
        });
    });
    describe('mutatePicklistValue', () => {
        it('will display the value if no label exists', () => {
            const val = 'Pick1';
            const picklistValue = { value: val };
            const mutatedValue = mutatePicklistValue(picklistValue);
            expect(mutatedValue).toMatchObject({
                displayText: val,
                subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                text: val,
                type: 'option-card',
                value: val,
                dataType: 'String'
            });
        });
    });
    describe('getSystemAndGlobalVariableMenuData', () => {
        describe('Global variables', () => {
            // The number of global variable types from globalVariablesForFlow which also have fields
            const NUM_GLOBAL_VARIABLE_TYPES = 7;
            const NUM_SYSTEM_VARIABLES = 1; // only $Flow
            beforeEach(() => {
                setGlobalVariables(globalVariablesForFlow);
                setProcessTypeFeature('flow', ['GlobalVariables']);
            });
            it('should not return global variables if showGlobalVariables is false', () => {
                const menuData = getSystemAndGlobalVariableMenuData(true, false);
                expect(menuData.length).toEqual(1);
            });
            it('should return global variables if showGlobalVariables is true', () => {
                const menuData = getSystemAndGlobalVariableMenuData(true, true);
                expect(menuData.length).toEqual(NUM_GLOBAL_VARIABLE_TYPES + NUM_SYSTEM_VARIABLES);
            });
            it('should return global variables if not supported for process type but for formula', () => {
                setProcessTypeFeature('flow', []);
                const menuData = getSystemAndGlobalVariableMenuData(true, true, true);
                expect(menuData.length).toEqual(NUM_GLOBAL_VARIABLE_TYPES + NUM_SYSTEM_VARIABLES);
            });
            it('should not return global variables if not supported for process type and not for formula', () => {
                setProcessTypeFeature('flow', []);
                const menuData = getSystemAndGlobalVariableMenuData(true, true);
                expect(menuData.length).toEqual(1);
            });
        });
        describe('System variables', () => {
            afterEach(() => {
                getStartElementFromState.mockImplementation(() => undefined);
            });
            it('should return $Record__Prior if supported', () => {
                getStartElementFromState.mockImplementation(() => startElementRecordTriggered);
                const menuData = getSystemAndGlobalVariableMenuData(true, false);
                expect(menuData).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            dataType: 'SObject',
                            displayText: '{!$Record__Prior}',
                            hasNext: true,
                            iconName: 'utility:system_and_global_variable',
                            subtype: 'Account',
                            text: '$Record__Prior',
                            value: '$Record__Prior',
                            subText: 'Account'
                        })
                    ])
                );
            });
            it('should not return $Record__Prior if returned variables should be writable', () => {
                getStartElementFromState.mockImplementation(() => startElementRecordTriggered);
                const menuData = getSystemAndGlobalVariableMenuData(true, false, false, true);
                expect(menuData).not.toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            value: '$Record__Prior'
                        })
                    ])
                );
            });
        });
    });
    describe('getMenuItemForField', () => {
        const parentSObjectItem = {
            dataType: FLOW_DATA_TYPE.SOBJECT.value,
            subtype: 'Account',
            displayText: 'recordVar'
        };

        const parentApexItem = {
            dataType: FLOW_DATA_TYPE.APEX.value,
            subtype: 'ApexClass',
            displayText: 'apexVar'
        };

        const apexProperty = {
            apiName: 'ApexProperty',
            dataType: FLOW_DATA_TYPE.STRING.value
        };

        const parentFlowVariableItem = {
            text: SYSTEM_VARIABLE_PREFIX,
            displayText: `{!${SYSTEM_VARIABLE_PREFIX}}`
        };

        const flowVariable = {
            dataType: FLOW_DATA_TYPE.STRING.value
        };

        const parentClientVariableItem = {
            text: SYSTEM_VARIABLE_CLIENT_PREFIX,
            displayText: `{!${SYSTEM_VARIABLE_CLIENT_PREFIX}}`
        };

        const clientVariable = {
            dataType: FLOW_DATA_TYPE.STRING.value
        };
        const mockedDataTypeLabel = (field) => `${field.dataType}Label`;

        const expectSubText = (field, parent, expectedSubtext = mockedDataTypeLabel(field)) => {
            const dataTypeLabel = mockedDataTypeLabel(field);
            getDataTypeLabel.mockReturnValueOnce(dataTypeLabel);
            const mutatedProperty = getMenuItemForField(field, parent);
            expect(mutatedProperty.subText).toEqual(expectedSubtext);
        };
        it('should use label for subtext for sobject fields', () => {
            const mockField = accountFields.AccountSource;
            const mutatedField = getMenuItemForField(mockField, parentSObjectItem);
            expect(mutatedField.subText).toEqual(mockField.label);
        });
        it('should use dataType for subtext for apex properties', () => {
            expectSubText(apexProperty, parentApexItem);
        });
        it('should use dataType collection for subtext for collection Apex property', () => {
            expectSubText(
                { ...apexProperty, isCollection: true },
                parentApexItem,
                format(collectionDataType, mockedDataTypeLabel(apexProperty))
            );
        });
        it('should use dataType for subtext for $Flow variables', () => {
            expectSubText(flowVariable, parentFlowVariableItem);
        });
        it('should use dataType for subtext for $Client variables', () => {
            expectSubText(clientVariable, parentClientVariableItem);
        });
    });
    describe('getMenuItemsForField', () => {
        const parentSObjectItem = {
            dataType: FLOW_DATA_TYPE.SOBJECT.value,
            subtype: 'Account',
            displayText: '{!recordVar}',
            value: 'recordVarGuid'
        };
        it('should return one menu item for a field that is not spannable', () => {
            const menuItems = getMenuItemsForField(accountFields.CloneSourceId, parentSObjectItem);
            expect(menuItems).toHaveLength(1);
            expect(menuItems[0]).toMatchObject({
                text: 'CloneSourceId',
                displayText: '{!recordVar.CloneSourceId}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CloneSourceId'
            });
            expect(menuItems[0].hasNext).toBeFalsy();
        });
        it('should return two menu items for a spannable field', () => {
            const menuItems = getMenuItemsForField(accountFields.CreatedById, parentSObjectItem);
            expect(menuItems).toHaveLength(2);
            expect(menuItems[0]).toMatchObject({
                text: 'CreatedBy',
                displayText: '{!recordVar.CreatedBy}',
                hasNext: true,
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedBy'
            });
            expect(menuItems[1]).toMatchObject({
                text: 'CreatedById',
                displayText: '{!recordVar.CreatedById}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedById'
            });
            expect(menuItems[1].hasNext).toBeFalsy();
        });
        it('should return only one menu item for a spannable field if option allowSObjectFieldsTraversal is false', () => {
            const menuItems = getMenuItemsForField(accountFields.CreatedById, parentSObjectItem, {
                allowSObjectFieldsTraversal: false
            });
            expect(menuItems).toHaveLength(1);
            expect(menuItems[0]).toMatchObject({
                text: 'CreatedById',
                displayText: '{!recordVar.CreatedById}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedById'
            });
            expect(menuItems[0].hasNext).toBeFalsy();
        });
        it('should return a menu item for each possible specific object in a polymorphic field', () => {
            const menuItems = getMenuItemsForField(feedItemFields.CreatedById, parentSObjectItem);
            expect(menuItems).toHaveLength(3);
            expect(menuItems[0]).toMatchObject({
                text: 'CreatedBy (SelfServiceUser)',
                displayText: '{!recordVar.CreatedBy:SelfServiceUser}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedBy:SelfServiceUser',
                hasNext: true
            });
            expect(menuItems[1]).toMatchObject({
                text: 'CreatedBy (User)',
                displayText: '{!recordVar.CreatedBy:User}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedBy:User',
                hasNext: true
            });
            expect(menuItems[2]).toMatchObject({
                text: 'CreatedById',
                displayText: '{!recordVar.CreatedById}',
                parent: parentSObjectItem,
                value: 'recordVarGuid.CreatedById'
            });
            expect(menuItems[2].hasNext).toBeFalsy();
        });
    });
});
