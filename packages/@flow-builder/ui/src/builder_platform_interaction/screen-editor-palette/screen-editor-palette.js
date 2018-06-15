import { Element } from 'engine';
import { getAllScreenFieldTypes } from 'builder_platform_interaction-screen-editor-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { createAddScreenFieldEvent } from 'builder_platform_interaction-events';

const FILTER_INPUT_SELECTOR = '#filter-input';

export default class ScreenPalette extends Element {
    types;
    labels = LABELS;

    // Create palette model
    constructor() {
        super();
        this.types = [];
        const sections = {};
        for (const fieldType of getAllScreenFieldTypes()) {
            if (!sections.hasOwnProperty(fieldType.category)) {
                const section = {
                    guid: generateGuid(),
                    label: fieldType.category,
                    _children: []
                };

                sections[fieldType.category] = section;
                this.types.push(section);
            }

            const fieldGuid = generateGuid();
            sections[fieldType.category]._children.push({
                description: fieldType.description || '',
                elementType: fieldGuid,
                guid: fieldGuid,
                iconName: fieldType.icon,
                label: fieldType.label,
                fieldTypeName: fieldType.name
            });
        }
    }

    handleSearch() {
        this.template.querySelector('builder_platform_interaction-palette').filter(this.template.querySelector(FILTER_INPUT_SELECTOR).value);
    }

    handlePaletteItemClickedEvent = (event) => {
        // Clicking on an element from the palette should add the corresponding field
        // type to the canvas.
        const fieldGuid = event.detail.guid;
        const fieldTypeName = getFieldTypeNameByGuid(this.types, fieldGuid);
        const addFieldEvent = createAddScreenFieldEvent(fieldTypeName);
        this.dispatchEvent(addFieldEvent);
        event.stopPropagation();
    }

    handleDragStart(event) {
        // Dragging an element could mean user wants to add the corresponding
        // field type to the canvas. Figureo out which field type user wants
        // to add.
        const fieldGuid = event.dataTransfer.getData('text');
        const fieldTypeName = getFieldTypeNameByGuid(this.types, fieldGuid);
        event.dataTransfer.setData('text', fieldTypeName);
        event.dataTransfer.effectAllowed = 'copy';
    }

    handleReload() {}
}

/**
 * Given a guid, looks up all the fields in palette and figures out which field type
 * it corresponds to.
 * @param {array} types - the field types to check
 * @param {string} guid - the guid to check against
 * @returns {string} Corresponding field type name
 */
function getFieldTypeNameByGuid(types, guid) {
    for (let i = 0; i < types.length; i++) {
        const category = types[i];
        for (const fieldType of category._children) {
            if (fieldType.guid === guid) {
                return fieldType.fieldTypeName;
            }
        }
    }
    throw new Error("Unable to find field type by guid");
}
