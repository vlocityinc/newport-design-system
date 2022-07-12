// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as expectedRecordTriggeredGoTos from 'mock/flows/recordTriggeredFlowGoTosFormatted.json';
import * as recordTriggeredFlowModel from 'mock/flows/recordTriggeredFlowModel.json';
import * as expectedScreenIncomingGoTos from 'mock/flows/screenFlowGoTosFormatted.json';
import * as screenFlowModel from 'mock/flows/screenFlowModel.json';
import {
    apexSampleVariable,
    createAccountWithAutomaticOutput,
    flowWithAllElementsUIModel,
    getElementByGuid,
    lookupRecordAutomaticOutput,
    lookupRecordCollectionAutomaticOutput,
    startElement
} from 'mock/storeData';
import { getElementSections, getIncomingGoTosInfo, getResourceIconName, getResourceSections } from '../resourceLib';

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderResourceDetailsPanel.incomingGoToConnectionsWithFaultPath',
    () => ({ default: '{0} on Fault Path' }),
    {
        virtual: true
    }
);
jest.mock('@salesforce/label/FlowBuilderConnectorLabels.afterLastBadgeLabel', () => ({ default: 'After Last' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderConnectorLabels.forEachBadgeLabel', () => ({ default: 'For Each' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderElementConfig.startElementSingularLabel', () => ({ default: 'Start' }), {
    virtual: true
});

jest.mock('builder_platform_interaction/sobjectLib', () => require('builder_platform_interaction_mocks/sobjectLib'));
const DECISION_1 = '131c1c0b-93e2-450a-9ca5-8ab1d0593615';
const ACTION_ELEMENT = 'bd2f41f4-a262-4b86-8bb3-b842426e5139';
const forEachSection = (sections, func) => {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        func(section);
    }
};

const forEachItemInSection = (section, func) => {
    const count = section._children.length;
    for (let i = 0; i < count; i++) {
        const item = section._children[i];
        func(item);
    }
};

const sectionsMatchers = {
    toHaveSectionsAndItemsSortedInAscendingOrder(sections) {
        let result = true;
        let previousSectionLabel;
        let previousItemLabel;
        let message = 'sections and items are sorted in ascending order';
        forEachSection(sections, (section) => {
            if (previousSectionLabel && section.label.localeCompare(previousSectionLabel) < 0) {
                result = false;
                message = 'sections are not sorted in ascending order';
            }
            previousSectionLabel = section.label;
            previousItemLabel = undefined;
            forEachItemInSection(section, (item) => {
                if (previousItemLabel && item.label.localeCompare(previousItemLabel) < 0) {
                    result = false;
                    message = `items are not sorted in ascending order : ${item.label} is before ${previousItemLabel}`;
                }
                previousItemLabel = item.label;
            });
        });
        return {
            message: () => message,
            pass: result
        };
    },
    toNotHaveEmptySection(sections) {
        let emptySection;
        forEachSection(sections, (section) => {
            if (!section._children || section._children.length === 0) {
                emptySection = section;
            }
        });
        if (emptySection) {
            return {
                message: () => `section ${emptySection.label} is empty`,
                pass: false
            };
        }
        return {
            message: () => 'sections are not empty',
            pass: true
        };
    }
};

expect.extend(sectionsMatchers);

const getSection = (sections, elementGuid) => {
    let result;
    forEachSection(sections, (section) => {
        forEachItemInSection(section, (item) => {
            if (item.guid === elementGuid) {
                result = section;
            }
        });
    });
    return result;
};

const getAllItems = (sections) => {
    const result = [];
    forEachSection(sections, (section) => {
        forEachItemInSection(section, (item) => {
            result.push(item);
        });
    });
    return result;
};

const getItem = (sections, elementGuid) => {
    let result;
    forEachSection(sections, (section) => {
        forEachItemInSection(section, (item) => {
            if (item.guid === elementGuid) {
                result = item;
            }
        });
    });
    return result;
};

describe('resource-lib', () => {
    describe('getResourceSection', () => {
        it.each([undefined, []])('returns empty passing %o', (resources) => {
            const resourceSections = getResourceSections(resources);
            expect(resourceSections).toHaveLength(0);
        });
        it('should be empty with a flow having nothing but a "startElement"', () => {
            const flowElements = {
                [startElement.guid]: startElement
            };
            const resourceSections = getResourceSections(flowElements);
            expect(resourceSections).toHaveLength(0);
        });
        test('sections and items have required properties', () => {
            const sections = getResourceSections(flowWithAllElementsUIModel.elements);
            forEachSection(sections, (section) => {
                expect(section.guid).toBeDefined();
                expect(section._children).toBeDefined();
                expect(section.label).toBeDefined();
                forEachItemInSection(section, (item) => {
                    expect(item.guid).toBeDefined();
                    expect(item.label).toBeDefined();
                    expect(item.description).toBe(item.label);
                    expect(item.elementType).toBeDefined();
                });
            });
        });
        it('should return sections and items sorted in ascending order', () => {
            const sections = getResourceSections(flowWithAllElementsUIModel.elements);
            expect(sections).toHaveSectionsAndItemsSortedInAscendingOrder();
        });
        it('should not return empty sections', () => {
            const sections = getResourceSections(flowWithAllElementsUIModel.elements);
            expect(sections).toNotHaveEmptySection();
        });
        it('should set an icon for all resources except stage', () => {
            const sections = getResourceSections(flowWithAllElementsUIModel.elements);
            forEachSection(sections, (section) => {
                forEachItemInSection(section, (item) => {
                    if (item.elementType === ELEMENT_TYPE.STAGE) {
                        expect(item.iconName).toBeUndefined();
                    } else {
                        expect(item.iconName).toBeDefined();
                    }
                });
            });
        });
        it('should only display items with label containing the searchString', () => {
            const sections = getResourceSections(flowWithAllElementsUIModel.elements, 'from lookup');
            expect(sections).toNotHaveEmptySection();
            expect(getAllItems(sections)).toHaveLength(2);
            expect(getItem(sections, lookupRecordAutomaticOutput.guid)).toBeDefined();
            expect(getItem(sections, lookupRecordCollectionAutomaticOutput.guid)).toBeDefined();
        });
        it.each`
            elementName                                   | elementGuid                                   | sectionLabel
            ${lookupRecordAutomaticOutput.name}           | ${lookupRecordAutomaticOutput.guid}           | ${'FlowBuilderElementConfig.sObjectPluralLabel'}
            ${lookupRecordCollectionAutomaticOutput.name} | ${lookupRecordCollectionAutomaticOutput.guid} | ${'FlowBuilderElementConfig.sObjectCollectionPluralLabel'}
            ${apexSampleVariable.name}                    | ${apexSampleVariable.guid}                    | ${'FlowBuilderElementConfig.apexVariablePluralLabel'}
        `(
            'section for "$elementName" (guid: "$elementGuid") should be $sectionLabel',
            ({ elementGuid, sectionLabel }) => {
                const sections = getResourceSections(flowWithAllElementsUIModel.elements);
                const section = getSection(sections, elementGuid);
                expect(section.label).toBe(sectionLabel);
            }
        );
    });
    describe('getElementSections', () => {
        it.each([undefined, []])('returns empty passing %o', (elements) => {
            const elementsSections = getElementSections(elements);
            expect(elementsSections).toHaveLength(0);
        });
        it('should be empty with a flow having nothing but a "startElement"', () => {
            const flowElements = {
                [startElement.guid]: startElement
            };
            const elementSections = getElementSections(flowElements);
            expect(elementSections).toHaveLength(0);
        });
        test('sections and items have required properties', () => {
            const sections = getElementSections(flowWithAllElementsUIModel.elements);
            forEachSection(sections, (section) => {
                expect(section.guid).toBeDefined();
                expect(section._children).toBeDefined();
                expect(section.label).toBeDefined();
                forEachItemInSection(section, (item) => {
                    expect(item.guid).toBeDefined();
                    expect(item.label).toBeDefined();
                    expect(item.description).toBe(item.label);
                    expect(item.elementType).toBeDefined();
                });
            });
        });
        it('should return sections and items sorted in ascending order', () => {
            const sections = getElementSections(flowWithAllElementsUIModel.elements);
            expect(sections).toHaveSectionsAndItemsSortedInAscendingOrder();
        });
        it('should not set an icon for canvas elements', () => {
            const sections = getElementSections(flowWithAllElementsUIModel.elements);
            forEachSection(sections, (section) => {
                forEachItemInSection(section, (item) => {
                    expect(item.iconName).toBeUndefined();
                });
            });
        });
        it.each`
            elementName                                   | elementGuid                                   | sectionLabel
            ${lookupRecordAutomaticOutput.name}           | ${lookupRecordAutomaticOutput.guid}           | ${'FlowBuilderElementConfig.recordLookupPluralLabel'}
            ${lookupRecordCollectionAutomaticOutput.name} | ${lookupRecordCollectionAutomaticOutput.guid} | ${'FlowBuilderElementConfig.recordLookupPluralLabel'}
        `(
            'section for "$elementName" (guid: "$elementGuid") should be $sectionLabel',
            ({ elementGuid, sectionLabel }) => {
                const sections = getElementSections(flowWithAllElementsUIModel.elements);
                const section = getSection(sections, elementGuid);
                expect(section.label).toBe(sectionLabel);
            }
        );
        test('all elements in a section should have the same element type', () => {
            const sections = getElementSections(flowWithAllElementsUIModel.elements);
            forEachSection(sections, (section) => {
                let expectedElementType;
                forEachItemInSection(section, (item) => {
                    if (!expectedElementType) {
                        expectedElementType = item.elementType;
                    } else {
                        expect(item.elementType).toBe(expectedElementType);
                    }
                });
            });
        });
    });
    describe('getResourceIconName', () => {
        it.each`
            elementName                                   | elementGuid                                   | iconName
            ${lookupRecordAutomaticOutput.name}           | ${lookupRecordAutomaticOutput.guid}           | ${'utility:record_alt'}
            ${lookupRecordCollectionAutomaticOutput.name} | ${lookupRecordCollectionAutomaticOutput.guid} | ${'utility:record_alt'}
            ${apexSampleVariable.name}                    | ${apexSampleVariable.guid}                    | ${'utility:apex'}
            ${createAccountWithAutomaticOutput.name}      | ${createAccountWithAutomaticOutput.guid}      | ${'utility:text'}
        `('icon for "$elementName" (guid: "$elementGuid") should be "$iconName"', ({ elementGuid, iconName }) => {
            const icon = getResourceIconName(getElementByGuid(elementGuid));
            expect(icon).toBe(iconName);
        });
    });
    describe('screenFlowIncomingInfoElements', () => {
        test('getIncomingGoTosInfo should perform proper formatting and contain the correct elements', () => {
            const decision1Element = screenFlowModel[DECISION_1];
            const incomingGoTos = JSON.parse(JSON.stringify(getIncomingGoTosInfo(decision1Element, screenFlowModel)));
            for (let i = 0; i < incomingGoTos.length; i++) {
                expect(incomingGoTos[i]).toStrictEqual(expectedScreenIncomingGoTos[i]);
            }
        });
    });
    describe('recordTriggeredFlowIncomingInfoElements', () => {
        test('getIncomingGoTosInfo should perform proper formatting and contain the correct elements', () => {
            const actionElement = recordTriggeredFlowModel[ACTION_ELEMENT];
            const incomingGoTos = JSON.parse(
                JSON.stringify(getIncomingGoTosInfo(actionElement, recordTriggeredFlowModel))
            );
            for (let i = 0; i < incomingGoTos.length; i++) {
                expect(incomingGoTos[i]).toStrictEqual(expectedRecordTriggeredGoTos[i]);
            }
        });
    });
});
