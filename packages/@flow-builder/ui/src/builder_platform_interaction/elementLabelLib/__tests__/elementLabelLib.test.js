import {
    getResourceLabel,
    getElementCategory,
    getResourceCategory
} from '../elementLabelLib';
import { LABELS } from '../elementLabelLibLabels';
import {
    elements,
    lookupRecordOutputReferenceGuid,
    lookupRecordAutomaticOutputGuid,
    lookupRecordCollectionAutomaticOutputGuid,
    emailScreenFieldAutomaticOutputGuid,
    actionCallAutomaticAutomaticOutputGuid
} from 'mock/storeData';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementConfig.assignmentPluralLabel',
    () => {
        return { default: 'Assignments' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementConfig.recordLookupPluralLabel',
    () => {
        return { default: 'Get Records' };
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
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const mockEntities = require('mock/serverEntityData').mockEntities;
    return {
        getEntity: jest.fn().mockImplementation(apiName => {
            return mockEntities.find(entity => entity.apiName === apiName);
        })
    };
});

const createElement = (elementType, dataType, isCollection) => ({
    elementType,
    dataType,
    isCollection
});

describe('elementLabelLib', () => {
    describe('getResourceLabel', () => {
        it('returns the resource name in the general case', () => {
            const element = elements[lookupRecordOutputReferenceGuid];
            const label = getResourceLabel(element);
            expect(label).toEqual(element.name);
        });
        describe('GetRecord element with automatic handling mode', () => {
            it('returns "[SObject label] from [elementName]"', () => {
                const element = elements[lookupRecordAutomaticOutputGuid];
                const label = getResourceLabel(element);
                expect(label).toEqual('Account from lookupRecord1');
            });
            it('returns "[SObject plural label] from [elementName]" when returning all records', () => {
                const element =
                    elements[lookupRecordCollectionAutomaticOutputGuid];
                const label = getResourceLabel(element);
                expect(label).toEqual('Accounts from lookupRecord3');
            });
            it('returns the resource name if SObject cannot be found', () => {
                const element = deepCopy(
                    elements[lookupRecordCollectionAutomaticOutputGuid]
                );
                element.object = 'UnknownRecord';
                element.subtype = 'UnknownRecord';
                const label = getResourceLabel(element);
                expect(label).toEqual(element.name);
            });
        });
        it('returns "Outputs" from [LCScreenFieldName]" for LC screen field with automatic handling mode', () => {
            const element = elements[emailScreenFieldAutomaticOutputGuid];
            const label = getResourceLabel(element);
            expect(label).toEqual('Outputs from emailScreenFieldAutomatic');
        });
        it('returns "Outputs" from [ActionName]" for action with automatic handling mode', () => {
            const element = elements[actionCallAutomaticAutomaticOutputGuid];
            const label = getResourceLabel(element);
            expect(label).toEqual('Outputs from actionCallAutomatic');
        });
    });
    describe('getElementCategory', () => {
        it('for elements', () => {
            expect(
                getElementCategory(createElement(ELEMENT_TYPE.ASSIGNMENT))
            ).toEqual('Assignments');
        });
        describe('For elements that are also resources', () => {
            it('for "Get Records" as record resource', () => {
                expect(
                    getElementCategory(
                        createElement(
                            ELEMENT_TYPE.RECORD_LOOKUP,
                            FLOW_DATA_TYPE.SOBJECT.value,
                            false
                        )
                    )
                ).toEqual('Get Records');
            });
            it('for "Get Records" as record collection resource', () => {
                expect(
                    getElementCategory(
                        createElement(
                            ELEMENT_TYPE.RECORD_LOOKUP,
                            FLOW_DATA_TYPE.SOBJECT.value,
                            true
                        )
                    )
                ).toEqual('Get Records');
            });
            it('for lightning component screen field as record resource', () => {
                expect(
                    getElementCategory(
                        createElement(
                            ELEMENT_TYPE.SCREEN_FIELD,
                            FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value,
                            false
                        )
                    )
                ).toEqual('FlowBuilderElementConfig.screenFieldPluralLabel');
            });
            it('for action as record resource', () => {
                expect(
                    getElementCategory(
                        createElement(
                            ELEMENT_TYPE.ACTION_CALL,
                            FLOW_DATA_TYPE.ACTION_OUTPUT.value,
                            false
                        )
                    )
                ).toEqual('FlowBuilderElementConfig.actionPluralLabel');
            });
        });
        it('for collections variables', () => {
            expect(
                getElementCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.NUMBER,
                        true
                    )
                )
            ).toEqual('FlowBuilderElementConfig.variablePluralLabel');
        });
        it('for sobjects variables', () => {
            expect(
                getElementCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.SOBJECT.value,
                        false
                    )
                )
            ).toEqual('FlowBuilderElementConfig.variablePluralLabel');
        });
        it('for sobject collections variables', () => {
            expect(
                getElementCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.SOBJECT.value,
                        true
                    )
                )
            ).toEqual('FlowBuilderElementConfig.variablePluralLabel');
        });
        it('for apex variables', () => {
            expect(
                getElementCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.APEX.value,
                        false
                    )
                )
            ).toEqual('FlowBuilderElementConfig.variablePluralLabel');
        });
        it('for apex variable collections', () => {
            expect(
                getElementCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.APEX.value,
                        true
                    )
                )
            ).toEqual('FlowBuilderElementConfig.variablePluralLabel');
        });
    });
    describe('getResourceCategory', () => {
        it('for elements', () => {
            expect(
                getResourceCategory(createElement(ELEMENT_TYPE.ASSIGNMENT))
            ).toEqual('Assignments');
        });
        describe('For elements that are also resources', () => {
            it('for "Get Records" as record resource', () => {
                expect(
                    getResourceCategory(
                        createElement(
                            ELEMENT_TYPE.RECORD_LOOKUP,
                            FLOW_DATA_TYPE.SOBJECT.value,
                            false
                        )
                    )
                ).toEqual(LABELS.sObjectPluralLabel);
            });
            it('for "Get Records" as record collection resource', () => {
                expect(
                    getResourceCategory(
                        createElement(
                            ELEMENT_TYPE.RECORD_LOOKUP,
                            FLOW_DATA_TYPE.SOBJECT.value,
                            true
                        )
                    )
                ).toEqual(LABELS.sObjectCollectionPluralLabel);
            });
            it('for lightning component screen field as record resource', () => {
                expect(
                    getResourceCategory(
                        createElement(
                            ELEMENT_TYPE.SCREEN_FIELD,
                            FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value,
                            false
                        )
                    )
                ).toEqual('FlowBuilderElementConfig.screenFieldPluralLabel');
            });
            it('for action as record resource', () => {
                expect(
                    getResourceCategory(
                        createElement(
                            ELEMENT_TYPE.ACTION_CALL,
                            FLOW_DATA_TYPE.ACTION_OUTPUT.value,
                            false
                        )
                    )
                ).toEqual('FlowBuilderElementConfig.actionPluralLabel');
            });
        });
        it('for collections variables', () => {
            expect(
                getResourceCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.NUMBER,
                        true
                    )
                )
            ).toEqual(LABELS.collectionVariablePluralLabel);
        });
        it('for sobjects variables', () => {
            expect(
                getResourceCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.SOBJECT.value,
                        false
                    )
                )
            ).toEqual(LABELS.sObjectPluralLabel);
        });
        it('for sobject collections variables', () => {
            expect(
                getResourceCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.SOBJECT.value,
                        true
                    )
                )
            ).toEqual(LABELS.sObjectCollectionPluralLabel);
        });
        it('for apex variables', () => {
            expect(
                getResourceCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.APEX.value,
                        false
                    )
                )
            ).toEqual(LABELS.apexVariablePluralLabel);
        });
        it('for apex variable collections', () => {
            expect(
                getResourceCategory(
                    createElement(
                        ELEMENT_TYPE.VARIABLE,
                        FLOW_DATA_TYPE.APEX.value,
                        true
                    )
                )
            ).toEqual(LABELS.apexCollectionVariablePluralLabel);
        });
    });
});
