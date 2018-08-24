import { LightningElement, track, api } from 'lwc';
import { applyFilter } from 'builder_platform_interaction-common-utils';
import { getAllScreenFieldTypes, getAllCachedExtensionTypes } from 'builder_platform_interaction-screen-editor-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { createAddScreenFieldEvent } from 'builder_platform_interaction-events';

const SELECTORS = {
    FILTER_INPUT: '#filter-input',
};

export default class ScreenPalette extends LightningElement {
    @track types;
    _fieldTypes;
    _extensionTypes;

    labels = LABELS;

    set screenFieldTypes(fieldTypes) {
        this._fieldTypes = fieldTypes;
        this.buildModel();
    }

    @api get screenFieldTypes() {
        return this._fieldTypes;
    }

    set extensionTypes(extTypes) {
        this._extensionTypes = extTypes;
        this.buildModel();
    }

    @api get extensionTypes() {
        return this._extensionTypes;
    }

    // Create palette model
    buildModel(filter) {
        const sections = [];

        const typeMap = getTypeMap(filter);
        for (const type in typeMap) {
            if (typeMap.hasOwnProperty(type)) {
                const items = typeMap[type];
                if (items && items.length > 0) {
                    const section = createSection(type, items.sort(compareItems));
                    sections.push(section);
                }
            }
        }

        this.types = sections;
    }

    handleSearch() {
        let filter = null;
        const pattern = this.template.querySelector(SELECTORS.FILTER_INPUT).value;
        if (pattern) {
            filter = {
                pattern,
                fields: ['label']
            };
        }
        this.buildModel(filter);
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

/**
 * A case-insensitive comparison function used to sort arrays of palette items by label.
 * @param {Object} a first item to compare
 * @param {Object} b second item to compare
 * @returns {Number} negative if a comes before b, positive if a comes after b, 0 when equal
 */
function compareItems(a, b) {
    return a.label.toUpperCase().localeCompare(b.label.toUpperCase());
}

function createSection(label, items) {
    const section = {
        guid: generateGuid(),
        label,
        _children: items
    };
    return section;
}

function getTypeMap(filter) {
    const typeMap = [...getAllScreenFieldTypes(), ...getAllCachedExtensionTypes()].reduce((acc, type) => {
        const filterResult = applyFilter(type, filter);
        if (!filterResult.visible) {
            return acc;
        }

        const guid = generateGuid();
        const item = {
            description: type.description || '',
            elementType: guid,
            guid,
            iconName: type.icon,
            label: type.label,
            fieldTypeName: type.name
        };
        if (!acc[type.category]) {
            acc[type.category] = [];
        }
        acc[type.category].push(item);

        return acc;
    }, {});

    return typeMap;
}