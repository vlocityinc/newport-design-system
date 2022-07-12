import trueMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.trueMetaLine';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from 'builder_platform_interaction/systemLib';
import {
    accountSObjectCollectionVariable,
    accountSObjectVariable,
    apexCallAutomaticAnonymousApexTypeCollectionOutput,
    apexCallAutomaticAnonymousStringOutput,
    assignmentElement,
    booleanVariable,
    createAccountWithAutomaticOutput,
    decision1,
    emailScreenFieldAutomaticOutput,
    lookupRecordAutomaticOutput,
    screenElement,
    stageElement,
    stringVariable,
    subflowWithAllVariableTypes,
    textTemplate1
} from 'mock/storeData';
import { step1OfStage1, step2OfStage1 } from 'mock/storeDataOrchestrator';
import {
    filterCollectionProcessor,
    mapCollectionProcessor,
    sortCollectionProcessor
} from 'mock/storeDataRecommendation';
import { loopAccountAutomaticOutput } from 'mock/storeDataScheduleTriggered';
import { LABELS } from '../../../../../ui/src/builder_platform_interaction/expressionUtils/expressionUtilsLabels';
import {
    apexClassesMenuDataSelector,
    mutateEntitiesToComboboxShape,
    mutateEventTypesToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue,
    mutateSystemAndGlobalVariablesToComboboxShape
} from '../fieldInputMenuDataGenerator';

jest.mock('builder_platform_interaction/storeLib', () =>
    jest.requireActual('builder_platform_interaction_mocks/storeLib')
);
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordLabel',
    () => ({ default: 'Triggering {0}' }),
    {
        virtual: true
    }
);
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordDescription',
    () => ({ default: 'The {0} record that triggered the flow.' }),
    {
        virtual: true
    }
);

describe('fieldInputMenuDataGenerator', () => {
    describe('Tests for mutateFlowResourceToComboboxShape', () => {
        it('Should return the right shape when passing in $Record', () => {
            const globalRecordVariable = {
                childReferences: [],
                dataType: FLOW_DATA_TYPE.SOBJECT.value,
                description: '',
                elementType: ELEMENT_TYPE.START_ELEMENT,
                guid: 'dede8ce3-43fc-49f7-86ae-4ea1228c5948',
                haveSystemVariableFields: true,
                isCollection: false,
                name: '$Record',
                subtype: 'Account'
            };
            expect(mutateFlowResourceToComboboxShape(globalRecordVariable)).toMatchObject({
                category: LABELS.globalResources,
                description: 'The Account record that triggered the flow.',
                iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                iconName: FLOW_DATA_TYPE.SOBJECT.utilityIconName,
                iconSize: 'x-small',
                label: 'Triggering Account',
                name: '$Record',
                subtype: 'Account',
                value: '$Record'
            });
        });

        it('Should return the right shape (using the label provided) when passing in a resource with a defined label', () => {
            expect(mutateFlowResourceToComboboxShape(assignmentElement)).toMatchObject({
                category: 'Assignment',
                description: '',
                iconAlternativeText: assignmentElement.elementType,
                iconBackgroundColor: undefined,
                iconName: 'standard:assignment',
                iconShape: undefined,
                iconSize: 'small',
                label: assignmentElement.label,
                name: assignmentElement.name
            });
        });

        it('Should return the right shape when passing in a resource with a different icon shape', () => {
            expect(mutateFlowResourceToComboboxShape(decision1)).toMatchObject({
                category: 'Decision',
                description: '',
                iconAlternativeText: decision1.elementType,
                iconBackgroundColor: undefined,
                iconName: 'standard:decision',
                iconShape: 'diamond',
                iconSize: 'small',
                label: decision1.label,
                name: decision1.name
            });
        });

        it('Should return the right icon info when passing in a text template resource (has no label)', () => {
            expect(mutateFlowResourceToComboboxShape(textTemplate1)).toMatchObject({
                category: 'TextTemplate',
                description: '',
                iconAlternativeText: FLOW_DATA_TYPE.STRING.value,
                iconName: 'utility:text_template',
                iconSize: 'x-small',
                label: textTemplate1.name,
                name: textTemplate1.name
            });
        });

        it('Should return the right icon info when passing in a stage resource', () => {
            expect(mutateFlowResourceToComboboxShape(stageElement)).toMatchObject({
                category: 'Stage',
                iconAlternativeText: stageElement.elementType,
                iconName: 'utility:stage',
                iconSize: 'x-small'
            });
        });

        it('Should return the right icon info when passing in a interactive step', () => {
            expect(mutateFlowResourceToComboboxShape(step1OfStage1)).toMatchObject({
                iconAlternativeText: step1OfStage1.dataType,
                iconName: 'standard:marketing_actions',
                iconSize: 'small',
                iconBackgroundColor: 'background-navy'
            });
        });

        it('Should return the right icon info when passing in a background step', () => {
            expect(mutateFlowResourceToComboboxShape(step2OfStage1)).toMatchObject({
                iconAlternativeText: step2OfStage1.dataType,
                iconName: 'standard:flow',
                iconSize: 'small',
                iconBackgroundColor: 'background-navy'
            });
        });

        it('Should return right shape for filter collection processor', () => {
            expect(mutateFlowResourceToComboboxShape(filterCollectionProcessor)).toMatchObject({
                category: 'Filter',
                iconAlternativeText: filterCollectionProcessor.elementType,
                iconName: 'standard:filter',
                iconSize: 'small',
                iconBackgroundColor: 'background-orange'
            });
        });

        it('Should return right shape for map collection processor', () => {
            expect(mutateFlowResourceToComboboxShape(mapCollectionProcessor)).toMatchObject({
                category: 'Map',
                iconAlternativeText: mapCollectionProcessor.elementType,
                iconName: 'standard:data_mapping',
                iconSize: 'small',
                iconBackgroundColor: 'background-orange'
            });
        });

        it('Should return right shape for sort collection processor', () => {
            expect(mutateFlowResourceToComboboxShape(sortCollectionProcessor)).toMatchObject({
                category: 'Sort',
                iconAlternativeText: sortCollectionProcessor.elementType,
                iconName: 'standard:sort',
                iconSize: 'small',
                iconBackgroundColor: 'background-orange'
            });
        });

        it('Should return the right icon info when passing in a boolean variable (has no label)', () => {
            expect(mutateFlowResourceToComboboxShape(booleanVariable)).toMatchObject({
                category: 'Variable',
                iconAlternativeText: FLOW_DATA_TYPE.BOOLEAN.value,
                iconName: 'utility:toggle',
                iconSize: 'x-small',
                label: booleanVariable.name,
                name: booleanVariable.name
            });
        });

        it('When passing in a resource with an undefined label, label should be the same as the name', () => {
            expect(mutateFlowResourceToComboboxShape(stringVariable)).toMatchObject({
                category: 'Variable',
                description: 'random description',
                iconAlternativeText: FLOW_DATA_TYPE.STRING.value,
                iconName: FLOW_DATA_TYPE.STRING.utilityIconName,
                iconSize: 'x-small',
                label: stringVariable.name,
                name: stringVariable.name
            });
        });

        it('Should return the right shape when passing in a resource with a defined category and description (eg. Global Values)', () => {
            expect(
                mutateFlowResourceToComboboxShape(GLOBAL_CONSTANT_OBJECTS[GLOBAL_CONSTANTS.BOOLEAN_TRUE])
            ).toMatchObject({
                category: LABELS.globalConstantCategory,
                description: trueMetaLine,
                iconAlternativeText: 'Boolean',
                iconName: 'utility:toggle',
                iconSize: 'x-small',
                label: GLOBAL_CONSTANT_OBJECTS[GLOBAL_CONSTANTS.BOOLEAN_TRUE].label,
                name: GLOBAL_CONSTANT_OBJECTS[GLOBAL_CONSTANTS.BOOLEAN_TRUE].name,
                subtype: undefined,
                value: '$GlobalConstant.True'
            });
        });

        it('Should return the right name and label at the top level for automatic output associated with Get Records', () => {
            expect(mutateFlowResourceToComboboxShape(lookupRecordAutomaticOutput).name).toBe(
                lookupRecordAutomaticOutput.name
            );
            expect(mutateFlowResourceToComboboxShape(lookupRecordAutomaticOutput).label).toBe(
                lookupRecordAutomaticOutput.label
            );
        });

        it('Should return the right name and label at the top level for automatic output associated with Create Records', () => {
            expect(mutateFlowResourceToComboboxShape(createAccountWithAutomaticOutput).name).toBe(
                createAccountWithAutomaticOutput.name
            );
            expect(mutateFlowResourceToComboboxShape(createAccountWithAutomaticOutput).label).toBe(
                createAccountWithAutomaticOutput.label
            );
        });

        it('Should return the right name and label at the top level for automatic output associated with Loops', () => {
            expect(mutateFlowResourceToComboboxShape(loopAccountAutomaticOutput).name).toBe(
                loopAccountAutomaticOutput.name
            );
            expect(mutateFlowResourceToComboboxShape(loopAccountAutomaticOutput).label).toBe(
                loopAccountAutomaticOutput.label
            );
        });

        it('Should return the right name at the top level for automatic output associated screen fields (has no label)', () => {
            expect(mutateFlowResourceToComboboxShape(emailScreenFieldAutomaticOutput).name).toBe(
                emailScreenFieldAutomaticOutput.name
            );
        });

        it('Should return the right name and label at the top level for anonymous primitive output resource', () => {
            expect(mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousStringOutput).name).toBe(
                apexCallAutomaticAnonymousStringOutput.name
            );
            expect(mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousStringOutput).label).toBe(
                apexCallAutomaticAnonymousStringOutput.label
            );
        });

        it('hasNext should be true when passing in a record variable (has no label)', () => {
            expect(mutateFlowResourceToComboboxShape(accountSObjectVariable)).toMatchObject({
                category: 'RecordVariable',
                iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                iconName: FLOW_DATA_TYPE.SOBJECT.utilityIconName,
                iconSize: 'x-small',
                label: accountSObjectVariable.name,
                name: accountSObjectVariable.name,
                subtype: 'Account'
            });
        });

        it('hasNext should be false when passing in a record collection variable (has no label)', () => {
            expect(mutateFlowResourceToComboboxShape(accountSObjectCollectionVariable)).toMatchObject({
                category: 'RecordCollection',
                iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                iconName: 'utility:record_alt',
                iconSize: 'x-small',
                label: accountSObjectCollectionVariable.name,
                name: accountSObjectCollectionVariable.name,
                subtype: 'Account'
            });
        });

        it('hasNext should be true when passing when passing in a screen with screen fields', () => {
            expect(mutateFlowResourceToComboboxShape(screenElement)).toMatchObject({
                category: 'Screen',
                iconAlternativeText: screenElement.elementType,
                iconBackgroundColor: undefined,
                iconName: 'standard:screen',
                iconShape: undefined,
                iconSize: 'small',
                label: screenElement.label,
                name: screenElement.name
            });
        });

        it('hasNext should be false when passing in a screen with no screen fields', () => {
            const emptyScreen = { ...screenElement, childReferences: [] };
            expect(mutateFlowResourceToComboboxShape(emptyScreen)).toMatchObject({
                category: 'Screen',
                iconAlternativeText: emptyScreen.elementType,
                iconBackgroundColor: undefined,
                iconName: 'standard:screen',
                iconShape: undefined,
                iconSize: 'small',
                label: emptyScreen.label,
                name: emptyScreen.name
            });
        });

        it('hasNext should be true when passing in a subflow without automatic outputs', () => {
            expect(mutateFlowResourceToComboboxShape(subflowWithAllVariableTypes)).toMatchObject({
                category: 'Subflow',
                iconAlternativeText: subflowWithAllVariableTypes.elementType,
                iconBackgroundColor: 'background-navy',
                iconName: 'standard:flow',
                iconShape: undefined,
                iconSize: 'small',
                label: subflowWithAllVariableTypes.label,
                name: subflowWithAllVariableTypes.name
            });
        });

        it('hasNext should be true when passing in an action (apex call) with automatic outputs', () => {
            expect(mutateFlowResourceToComboboxShape(apexCallAutomaticAnonymousApexTypeCollectionOutput)).toMatchObject(
                {
                    category: 'Action',
                    iconAlternativeText: apexCallAutomaticAnonymousApexTypeCollectionOutput.elementType,
                    iconBackgroundColor: 'background-navy',
                    iconName: 'standard:apex',
                    iconShape: undefined,
                    iconSize: 'small',
                    label: apexCallAutomaticAnonymousApexTypeCollectionOutput.label,
                    name: apexCallAutomaticAnonymousApexTypeCollectionOutput.name
                }
            );
        });
    });

    describe('Tests for mutateEntitiesToComboboxShape', () => {
        it('Entities data should be correctly converted into combobox shape', () => {
            const entities = [
                {
                    entityLabel: 'label1',
                    apiName: 'name1',
                    isCollection: true
                },
                {
                    apiName: 'name2',
                    isCollection: false
                }
            ] as UI.EntityDefinition[];

            const mutatedValue = mutateEntitiesToComboboxShape(entities);
            expect(mutatedValue).toEqual([
                {
                    value: 'name1',
                    dataType: FLOW_DATA_TYPE.SOBJECT.value,
                    iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                    iconName: 'utility:record_alt',
                    iconSize: 'x-small',
                    label: 'label1',
                    name: 'name1',
                    subtype: 'name1',
                    isCollection: true,
                    iconBackgroundColor: undefined,
                    view: { type: 'MenuItemViewTypeTbd' }
                },
                {
                    value: 'name2',
                    dataType: FLOW_DATA_TYPE.SOBJECT.value,
                    iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                    iconName: FLOW_DATA_TYPE.SOBJECT.utilityIconName,
                    iconSize: 'x-small',
                    label: 'name2',
                    name: 'name2',
                    subtype: 'name2',
                    isCollection: false,
                    iconBackgroundColor: undefined,
                    view: { type: 'MenuItemViewTypeTbd' }
                }
            ]);
        });
    });

    describe('Tests for apexClassesMenuDataSelector', () => {
        it('Should return the right shape for the combobox', () => {
            const peripheralData = {
                apexClasses: [
                    {
                        durableId: 'id',
                        isCollection: false
                    },
                    {
                        durableId: 'id2',
                        isCollection: true
                    }
                ]
            };
            expect(apexClassesMenuDataSelector({ peripheralData })).toEqual([
                {
                    label: peripheralData.apexClasses[0].durableId,
                    name: peripheralData.apexClasses[0].durableId,
                    value: peripheralData.apexClasses[0].durableId,
                    dataType: FLOW_DATA_TYPE.APEX.value,
                    isCollection: peripheralData.apexClasses[0].isCollection,
                    subtype: peripheralData.apexClasses[0].durableId,
                    iconAlternativeText: FLOW_DATA_TYPE.APEX.value,
                    iconName: FLOW_DATA_TYPE.APEX.utilityIconName,
                    iconSize: 'x-small',
                    view: { type: 'MenuItemViewTypeTbd' },
                    iconBackgroundColor: undefined
                },
                {
                    label: peripheralData.apexClasses[1].durableId,
                    name: peripheralData.apexClasses[1].durableId,
                    value: peripheralData.apexClasses[1].durableId,
                    dataType: FLOW_DATA_TYPE.APEX.value,
                    isCollection: peripheralData.apexClasses[1].isCollection,
                    subtype: peripheralData.apexClasses[1].durableId,
                    iconAlternativeText: FLOW_DATA_TYPE.APEX.value,
                    iconName: FLOW_DATA_TYPE.APEX.utilityIconName,
                    iconSize: 'x-small',
                    view: { type: 'MenuItemViewTypeTbd' },
                    iconBackgroundColor: undefined
                }
            ]);
        });
    });

    describe('Tests for mutatePicklistValue', () => {
        it('Should use value as the label when no label is provided', () => {
            const value = 'Pick1';
            const picklistValue = { value };
            // @ts-ignore
            const mutatedValue = mutatePicklistValue(picklistValue);
            expect(mutatedValue).toEqual({
                value,
                dataType: FLOW_DATA_TYPE.STRING.value,
                iconAlternativeText: FLOW_DATA_TYPE.STRING.value,
                iconName: FLOW_DATA_TYPE.STRING.utilityIconName,
                iconSize: 'x-small',
                label: 'Pick1',
                name: 'Pick1',
                view: { type: 'MenuItemViewTypeTbd' },
                iconBackgroundColor: undefined
            });
        });

        it('Should use the provided label for the label property', () => {
            const value = 'Pick1';
            const label = 'PickLabel';
            const picklistValue = { value, label };
            const mutatedValue = mutatePicklistValue(picklistValue);
            expect(mutatedValue).toEqual({
                value: 'Pick1-PickLabel',
                dataType: FLOW_DATA_TYPE.STRING.value,
                iconAlternativeText: FLOW_DATA_TYPE.STRING.value,
                iconName: FLOW_DATA_TYPE.STRING.utilityIconName,
                iconSize: 'x-small',
                label: 'PickLabel',
                name: 'Pick1',
                view: { type: 'MenuItemViewTypeTbd' },
                iconBackgroundColor: undefined
            });
        });
    });

    describe('Tests for mutateEventTypesToComboboxShape', () => {
        it('Event types data should be correctly converted into combobox shape', () => {
            const eventTypes = [
                {
                    label: 'label1',
                    qualifiedApiName: 'name1'
                },
                {
                    qualifiedApiName: 'name2'
                }
            ] as FieldInput.EventType[];

            const mutatedValue = mutateEventTypesToComboboxShape(eventTypes);
            expect(mutatedValue).toEqual([
                {
                    value: 'name1',
                    dataType: FLOW_DATA_TYPE.SOBJECT.value,
                    iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                    iconName: FLOW_DATA_TYPE.SOBJECT.utilityIconName,
                    iconSize: 'x-small',
                    label: 'label1',
                    name: 'name1',
                    subtype: 'name1',
                    view: { type: 'MenuItemViewTypeTbd' },
                    iconBackgroundColor: undefined
                },
                {
                    value: 'name2',
                    dataType: FLOW_DATA_TYPE.SOBJECT.value,
                    iconAlternativeText: FLOW_DATA_TYPE.SOBJECT.value,
                    iconName: FLOW_DATA_TYPE.SOBJECT.utilityIconName,
                    iconSize: 'x-small',
                    label: 'name2',
                    name: 'name2',
                    subtype: 'name2',
                    view: { type: 'MenuItemViewTypeTbd' },
                    iconBackgroundColor: undefined
                }
            ]);
        });
    });
    describe('mutateSystemAndGlobalVariablesToComboboxShape', () => {
        let mappedMenuItem;
        const checkMenuItem = ({ name, label, description, iconName }) =>
            expect(mappedMenuItem).toMatchObject(
                expect.objectContaining({
                    value: name,
                    name,
                    label,
                    description,
                    iconName
                })
            );
        test('variable with no datatype', () => {
            const name = '$Api';
            const label = 'Flow API';
            const description = 'Some description for Flow API';
            const iconName = 'utility:apiIcon';
            mappedMenuItem = mutateSystemAndGlobalVariablesToComboboxShape({
                name,
                config: { label, description, iconName, iconSize: 'x-small' }
            });

            checkMenuItem({ name, label, description, iconName });
        });
        test('variable with datatype and subtype', () => {
            const name = '$Record';
            const dataType = 'SObject';
            const subtype = 'Account';
            const label = `Triggering ${subtype}`;
            const description = `The ${subtype} record that triggered the flow.`;
            const iconName = 'utility:recordIcon';
            mappedMenuItem = mutateSystemAndGlobalVariablesToComboboxShape({
                name,
                dataType,
                subtype,
                config: {
                    label,
                    hasLabelSubtypeParam: true,
                    hasDescriptionSubtypeParam: true,
                    description,
                    iconName,
                    iconSize: 'x-small'
                }
            });

            checkMenuItem({ name, label, description, iconName });
        });
    });
});
