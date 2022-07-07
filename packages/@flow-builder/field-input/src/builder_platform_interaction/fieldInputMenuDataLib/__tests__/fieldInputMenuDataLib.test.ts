import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { COLLECTION_PROCESSOR_SUB_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import {
    actionCallAutomaticOutput,
    apexCallAutomaticAnonymousAccountOutput,
    apexCallAutomaticAnonymousAccountsOutput,
    apexCallAutomaticAnonymousApexTypeCollectionOutput,
    apexCallAutomaticAnonymousStringOutput,
    apexCallAutomaticAnonymousStringsOutput,
    createAccountWithAutomaticOutput,
    emailScreenFieldAutomaticOutput,
    lookupRecordAutomaticOutput,
    lookupRecordCollectionAutomaticOutput,
    lookupRecordOutputReference,
    subflowAutomaticOutput
} from 'mock/storeData';
import {
    loopAccountAutomaticOutput,
    loopOnApexTypeCollectionAutoOutput,
    loopOnTextCollectionAutomaticOutput,
    loopOnTextCollectionManualOutput
} from 'mock/storeDataScheduleTriggered';
import { fieldInputCategoryMap, getResourceCategory, getResourceLabel } from '../fieldInputMenuDataLib';
import { LABELS } from '../fieldInputMenuDataLibLabels';

function getResourceCategoryLabel(obj) {
    const category = getResourceCategory(obj);
    return fieldInputCategoryMap[category].label;
}

jest.mock('builder_platform_interaction/sobjectLib', () =>
    jest.requireActual('builder_platform_interaction_mocks/sobjectLib')
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordCreateIdAsResourceText',
    () => {
        return { default: '{0}Id from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.loopAsResourceText',
    () => {
        return { default: 'Current Item from Loop {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.lightningComponentScreenFieldAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.actionAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.actionAnonymousPrimitiveAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderDataTypes.collectionDataType',
    () => {
        return { default: '{0} Collection' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);

const createElement = (
    elementType,
    dataType: string | undefined = undefined,
    isCollection = false,
    storeOutputAutomatically = false,
    elementSubtype: string | undefined = undefined
) => ({
    dataType,
    elementType,
    isCollection,
    storeOutputAutomatically,
    elementSubtype
});

describe('Field Input Menu Data Lib Tests', () => {
    it('Automatic output associated with "Create Records" should be under Record Create category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.RECORD_CREATE, FLOW_DATA_TYPE.STRING.value, false))
        ).toEqual(LABELS.recordCreate);
    });

    it('for automatic output associated with "Loops" should be under Loop category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.LOOP, FLOW_DATA_TYPE.STRING.value, false, true))
        ).toEqual(LABELS.loops);
    });

    it('Automatic output associated with "Get Records" should be under Record Lookup category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(ELEMENT_TYPE.RECORD_LOOKUP, FLOW_DATA_TYPE.SOBJECT.value, false, true)
            )
        ).toEqual(LABELS.recordLookup);
    });

    it('Collection Automatic output associated with "Get Records" should be under Record Lookup category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(ELEMENT_TYPE.RECORD_LOOKUP, FLOW_DATA_TYPE.SOBJECT.value, true, true)
            )
        ).toEqual(LABELS.recordLookup);
    });

    it('Subflows with manually assigned outputs should be under Subflow category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.SUBFLOW, FLOW_DATA_TYPE.BOOLEAN.value, false, true))
        ).toEqual(LABELS.subflows);
    });

    it('Assignment should be under Assignments category', () => {
        expect(getResourceCategoryLabel(createElement(ELEMENT_TYPE.ASSIGNMENT))).toEqual(LABELS.assignments);
    });

    it('Variable should be under Simple Variables category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.NUMBER.value, false, false))
        ).toEqual(LABELS.simpleVariables);
    });

    it('Collection variable for non complex types should be under Simple collections category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.NUMBER.value, true, false))
        ).toEqual(LABELS.simpleCollections);
    });

    it('Record collections variable should be under Record Collections category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.SOBJECT.value, true, false))
        ).toEqual(LABELS.recordCollections);
    });

    it('Apex collection variable should be under Apex Collections category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.APEX.value, true, false))
        ).toEqual(LABELS.apexCollections);
    });

    it('Record variable should be under Record Variables category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.SOBJECT.value, false, false))
        ).toEqual(LABELS.recordVariables);
    });

    it('Apex variable should be under Apex Variable category', () => {
        expect(
            getResourceCategoryLabel(createElement(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.APEX.value, false, false))
        ).toEqual(LABELS.apexVariables);
    });

    it('Orchestrator stages should be under Orchestrated Stages category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(ELEMENT_TYPE.ORCHESTRATED_STAGE, FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value, false, false)
            )
        ).toEqual(LABELS.orchestratedStages);
    });

    it('Collection Process - Filter should be under Filter category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(
                    ELEMENT_TYPE.COLLECTION_PROCESSOR,
                    FLOW_DATA_TYPE.STRING.value,
                    true,
                    true,
                    COLLECTION_PROCESSOR_SUB_TYPE.FILTER
                )
            )
        ).toEqual(LABELS.filter);
    });

    it('Collection Process - Map should be under Map category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(
                    ELEMENT_TYPE.COLLECTION_PROCESSOR,
                    FLOW_DATA_TYPE.STRING.value,
                    true,
                    true,
                    COLLECTION_PROCESSOR_SUB_TYPE.MAP
                )
            )
        ).toEqual(LABELS.map);
    });

    it('Collection Process - Sort should be under Sort category', () => {
        expect(
            getResourceCategoryLabel(
                createElement(
                    ELEMENT_TYPE.COLLECTION_PROCESSOR,
                    FLOW_DATA_TYPE.STRING.value,
                    false,
                    false,
                    COLLECTION_PROCESSOR_SUB_TYPE.SORT
                )
            )
        ).toEqual(LABELS.sort);
    });
});

describe('Tests for getResourceLabel', () => {
    it('returns the resource name in the general case', () => {
        const label = getResourceLabel(lookupRecordOutputReference);
        expect(label).toEqual(lookupRecordOutputReference.name);
    });

    describe('GetRecord element with automatic handling mode', () => {
        it('returns "[SObject label] from [elementName]"', () => {
            const label = getResourceLabel(lookupRecordAutomaticOutput);
            expect(label).toEqual('Account from lookupRecordAutomaticOutput');
        });
        it('returns "[SObject plural label] from [elementName]" when returning all records', () => {
            const label = getResourceLabel(lookupRecordCollectionAutomaticOutput);
            expect(label).toEqual('Accounts from lookupRecordCollectionAutomaticOutput');
        });
        it('returns the resource name if SObject cannot be found', () => {
            const element = deepCopy(lookupRecordCollectionAutomaticOutput);
            element.object = 'UnknownRecord';
            element.subtype = 'UnknownRecord';
            const label = getResourceLabel(element);
            expect(label).toEqual(element.name);
        });
    });

    it('returns "[SObject label]Id from [elementName]" for create records with automatic handling mode', () => {
        const label = getResourceLabel(createAccountWithAutomaticOutput);
        expect(label).toEqual('AccountId from createAccountWithAutomaticOutput');
    });

    describe('Loop', () => {
        it.each`
            loop                                   | expectedLabel
            ${loopOnTextCollectionManualOutput}    | ${loopOnTextCollectionManualOutput.name}
            ${loopAccountAutomaticOutput}          | ${'Current Item from Loop ' + loopAccountAutomaticOutput.name}
            ${loopOnTextCollectionAutomaticOutput} | ${'Current Item from Loop ' + loopOnTextCollectionAutomaticOutput.name}
            ${loopOnApexTypeCollectionAutoOutput}  | ${'Current Item from Loop ' + loopOnApexTypeCollectionAutoOutput.name}
        `('$loop.name should have label: $expectedLabel', ({ loop, expectedLabel }) => {
            const label = getResourceLabel(loop);

            expect(label).toEqual(expectedLabel);
        });
    });

    it('returns "Outputs from [LCScreenFieldName]" for LC screen field with automatic handling mode', () => {
        const label = getResourceLabel(emailScreenFieldAutomaticOutput);
        expect(label).toEqual('Outputs from emailScreenFieldAutomaticOutput');
    });

    it('returns "Outputs from [ActionName]" for action with automatic handling mode', () => {
        const label = getResourceLabel(actionCallAutomaticOutput);
        expect(label).toEqual('Outputs from actionCallAutomaticOutput');
    });

    describe('Action with automatic handling mode and anonymous output', () => {
        it('returns [Entity name] from [ActionName] for single sobject', () => {
            const label = getResourceLabel(apexCallAutomaticAnonymousAccountOutput);
            expect(label).toEqual('Account from apexCall_anonymous_account');
        });
        it('returns [Primitive label] from [ActionName] for single primitive', () => {
            const label = getResourceLabel(apexCallAutomaticAnonymousStringOutput);
            expect(label).toEqual('FlowBuilderDataTypes.textDataTypeLabel from apexCall_anonymous_string');
        });
        it('returns [Entity name]s from [ActionName] for sobject collection', () => {
            const label = getResourceLabel(apexCallAutomaticAnonymousAccountsOutput);
            expect(label).toEqual('Accounts from apexCall_anonymous_accounts');
        });
        it('returns [Primitive label] Collection from [ActionName] for primitive collection', () => {
            const label = getResourceLabel(apexCallAutomaticAnonymousStringsOutput);
            expect(label).toEqual('FlowBuilderDataTypes.textDataTypeLabel Collection from apexCall_anonymous_strings');
        });
        it('returns [Apex Type] Collection from [ActionName] for apex type collection', () => {
            const label = getResourceLabel(apexCallAutomaticAnonymousApexTypeCollectionOutput);
            expect(label).toEqual('InvocableGetCars$GetCarResult Collection from apexCall_anonymous_apex_collection');
        });
    });

    it('returns "Outputs from [SubflowName]" for subflow with automatic output handling mode', () => {
        const label = getResourceLabel(subflowAutomaticOutput);
        expect(label).toEqual('Outputs from subflowAutomaticOutput');
    });
});
