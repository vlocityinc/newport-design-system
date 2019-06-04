import { resourceFilter, canvasElementFilter } from "builder_platform_interaction/filterLib";
import { labelComparator, nameComparator } from "builder_platform_interaction/sortLib";
import { getResourceSections, getElementSections, getResourceIconName } from "../resourceLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { elements, startElementGuid, lookupRecordAutomaticOutputGuid, lookupRecordCollectionAutomaticOutputGuid, apexSampleVariableGuid } from 'mock/storeData';

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
        forEachSection(sections, section => {
           if (previousSectionLabel && !(section.label.toUpperCase() >= previousSectionLabel.toUpperCase())) {
               result = false;
           }
           previousSectionLabel = section.label;
           previousItemLabel = undefined;
           forEachItemInSection(section, item => {
               if (previousItemLabel && !(item.label.toUpperCase() >= previousItemLabel.toUpperCase())) {
                   result = false;
               }
               previousItemLabel = item.label;
           });
        });

        if (result) {
            return {
                message: () => 'sections and items are sorted in ascending order',
                pass: true,
            };
        }
        return {
            message: () => 'sections and items are not sorted in ascending order',
            pass: false,
        };
    },
    toNotHaveEmptySection(sections) {
        let emptySection;
        forEachSection(sections, section => {
            if (!section._children || section._children.length === 0) {
                emptySection = section;
            }
        });
        if (emptySection) {
            return {
                message: () => `section ${emptySection.label} is empty`,
                pass: false,
            };
        }
        return {
            message: () => 'sections are not empty',
            pass: true,
        };
    },
};

expect.extend(sectionsMatchers);

const getSection = (sections, elementGuid) => {
    let result;
    forEachSection(sections, section => {
        forEachItemInSection(section, item => {
            if (item.guid === elementGuid) {
                result = section;
            }
        });
    });
    return result;
};

describe('resource-lib', () => {
    describe('getResourceSection', () => {
        it('should be empty when flow is empty', () => {
            const elementsForEmptyFlow = { [startElementGuid] : elements[startElementGuid] };
            const resourceSections = getResourceSections(elementsForEmptyFlow, resourceFilter(), nameComparator);
            expect(resourceSections).toHaveLength(0);
        });
        test('sections and items have required properties', () => {
            const sections = getResourceSections(elements, resourceFilter(), nameComparator);
            forEachSection(sections, section => {
                expect(section.guid).toBeDefined();
                expect(section._children).toBeDefined();
                expect(section.label).toBeDefined();
                forEachItemInSection(section, item => {
                    expect(item.guid).toBeDefined();
                    expect(item.label).toBeDefined();
                    expect(item.elementType).toBeDefined();
                });
            });
        });
        it('should return sections and items sorted in ascending order', () => {
            const sections = getResourceSections(elements, resourceFilter(), nameComparator);
            expect(sections).toHaveSectionsAndItemsSortedInAscendingOrder();
        });
        it('should not return empty sections', () => {
            const sections = getResourceSections(elements, resourceFilter(), nameComparator);
            expect(sections).toNotHaveEmptySection();
        });
        it('should set an icon for all resources except stage', () => {
            const sections = getResourceSections(elements, resourceFilter(), nameComparator);
            forEachSection(sections, section => {
                forEachItemInSection(section, item => {
                    if (item.elementType === ELEMENT_TYPE.STAGE) {
                        expect(item.iconName).toBeUndefined();
                    } else {
                        expect(item.iconName).toBeDefined();
                    }
                });
            });
        });
        it.each`
            elementGuid                                   | sectionLabel
            ${lookupRecordAutomaticOutputGuid}            | ${'FlowBuilderElementConfig.sObjectPluralLabel'}
            ${lookupRecordCollectionAutomaticOutputGuid}  | ${'FlowBuilderElementConfig.sObjectCollectionPluralLabel'}
            ${apexSampleVariableGuid}                     | ${'FlowBuilderElementConfig.apexVariablePluralLabel'}
            `('section for $elementGuid should be $sectionLabel', ({elementGuid, sectionLabel}) => {
            const sections = getResourceSections(elements, resourceFilter(), nameComparator);
            const section = getSection(sections, elementGuid);
            expect(section.label).toBe(sectionLabel);
        });
    });
    describe('getElementSections', () => {
        it('should be empty when flow is empty', () => {
            const elementsForEmptyFlow = { [startElementGuid] : elements[startElementGuid] };
            const elementSections = getElementSections(elementsForEmptyFlow, canvasElementFilter(), labelComparator);
            expect(elementSections).toHaveLength(0);
        });
        test('sections and items have required properties', () => {
            const sections = getResourceSections(elements, canvasElementFilter(), nameComparator);
            forEachSection(sections, section => {
                expect(section.guid).toBeDefined();
                expect(section._children).toBeDefined();
                expect(section.label).toBeDefined();
                forEachItemInSection(section, item => {
                    expect(item.guid).toBeDefined();
                    expect(item.label).toBeDefined();
                    expect(item.elementType).toBeDefined();
                });
            });
        });
        it('should return sections and items sorted in ascending order', () => {
            const sections = getElementSections(elements, canvasElementFilter(), nameComparator);
            expect(sections).toHaveSectionsAndItemsSortedInAscendingOrder();
        });
        it('should not set an icon for canvas elements', () => {
            const sections = getElementSections(elements, canvasElementFilter(), nameComparator);
            forEachSection(sections, section => {
                forEachItemInSection(section, item => {
                    expect(item.iconName).toBeUndefined();
                });
            });
        });
        it.each`
            elementGuid                                   | sectionLabel
            ${lookupRecordAutomaticOutputGuid}            | ${'FlowBuilderElementConfig.recordLookupPluralLabel'}
            ${lookupRecordCollectionAutomaticOutputGuid}  | ${'FlowBuilderElementConfig.recordLookupPluralLabel'}
            `('section for $elementGuid should be $sectionLabel', ({elementGuid, sectionLabel}) => {
            const sections = getElementSections(elements, canvasElementFilter(), nameComparator);
            const section = getSection(sections, elementGuid);
            expect(section.label).toBe(sectionLabel);
        });
        test('all elements in a section should have the same element type', () => {
            const sections = getElementSections(elements, canvasElementFilter(), nameComparator);
            forEachSection(sections, section => {
                let expectedElementType;
                forEachItemInSection(section, item => {
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
        elementGuid                                   | iconName
        ${lookupRecordAutomaticOutputGuid}            | ${'utility:sobject'}
        ${lookupRecordCollectionAutomaticOutputGuid}  | ${'utility:sobject'}
        ${apexSampleVariableGuid}                     | ${'utility:apex'}
        `('icon for $elementGuid should be $iconName', ({elementGuid, iconName}) => {
        const icon = getResourceIconName(elements[elementGuid]);
        expect(icon).toBe(iconName);
    });
    });
});