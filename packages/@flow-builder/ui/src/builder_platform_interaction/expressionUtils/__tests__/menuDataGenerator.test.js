import {
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue,
    getMenuItemForField,
    getMenuItemsForField
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
} from 'mock/storeDataAutolaunched';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import collectionDataType from '@salesforce/label/FlowBuilderDataTypes.collectionDataType';

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
        getResourceLabel: jest.fn().mockImplementation(resource => resource.name)
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
        const mockedDataTypeLabel = field => `${field.dataType}Label`;

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
