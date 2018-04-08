import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';

const SECTION_PREFIX = 'ELEMENTS_PALETTE_SECTION';
const ITEM_PREFIX = 'ELEMENTS_PALETTE_ITEM';

let currentElements = [];

export function transformLeftPanelElements(elements) {
    currentElements = [];

    const sections = {};
    elements.forEach(element => {
        if (sections[element.section] === undefined || sections[element.section] === null) {
            sections[element.section] = [];
        }
        const item = deepCopy(element);
        item.guid = generateGuid(ITEM_PREFIX);
        item.iconName = getConfigForElementType(element.elementType).nodeConfig.iconName;
        delete item.section;
        sections[element.section].push(item);
    });

    for (const name in sections) {
        if (sections.hasOwnProperty(name)) {
            const section = {};
            section._children = sections[name];
            section.guid = generateGuid(SECTION_PREFIX);
            section.label = name;
            currentElements.push(section);
        }
    }
    return currentElements;
}