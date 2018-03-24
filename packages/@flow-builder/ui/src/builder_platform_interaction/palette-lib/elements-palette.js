import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { CRUD } from 'builder_platform_interaction-builder-utils';
import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';

const SECTION_PREFIX = 'ELEMENTS_PALETTE_SECTION';
const ITEM_PREFIX = 'ELEMENTS_PALETTE_ITEM';

let currentElements = [];
let currentListeners = [];

let instance;

export class ElementsPalette {
    static getInstance() {
        if (!instance) {
            instance = new ElementsPalette();
        }
        return instance;
    }

    setElements(elements) {
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

        instance.notifyListeners({ type: CRUD.UPDATE });
    }

    getElements() {
        return currentElements;
    }

    subscribe(listener) {
        currentListeners = [...currentListeners, listener];
        return function unsubscribe() {
            const index = currentListeners.indexOf(listener);
            currentListeners = [...currentListeners.slice(0, index), ...currentListeners.slice(index + 1)];
        };
    }

    notifyListeners() {
        currentListeners.forEach((listener) => {
            listener();
        });
    }
}