import { LightningElement, track, api } from 'lwc';
import { labelFilter } from "builder_platform_interaction/filterLib";
import { getAllScreenFieldTypes, getAllCachedExtensionTypes } from "builder_platform_interaction/screenEditorUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { createAddScreenFieldEvent } from "builder_platform_interaction/events";
import { labelComparator } from "builder_platform_interaction/sortLib";
import { APP_EXCHANGE_LINK } from "builder_platform_interaction/commonUtils";

const SELECTORS = {
    FILTER_INPUT: '.palette-search-input',
};

export default class ScreenPalette extends LightningElement {
    @track types;
    _fieldTypes;
    _extensionTypes;

    appExchangeLink = APP_EXCHANGE_LINK;

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
    buildModel() {
        const sections = [];

        const filterInput = this.template.querySelector(SELECTORS.FILTER_INPUT);
        const pattern = filterInput ? filterInput.value.trim() : undefined;

        const typeMap = getTypeMap(pattern);
        for (const type in typeMap) {
            if (typeMap.hasOwnProperty(type)) {
                const items = typeMap[type];
                if (items && items.length > 0) {
                    const section = createSection(type, items.sort(labelComparator));
                    sections.push(section);
                }
            }
        }

        this.types = sections;
    }

    handleSearch() {
        this.buildModel();
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
        // field type to the canvas. Figure out which field type user wants
        // to add.
        const fieldGuid = event.dataTransfer.getData('text');
        const fieldTypeName = getFieldTypeNameByGuid(this.types, fieldGuid);
        event.dataTransfer.setData('text', fieldTypeName);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('dragStartLocation', 'leftPanel'); // Needed for safari browser. effectAllowed always resolves to 'all' and it is not supported by safari.
    }

    /* TODO - W-5617771
    handleReload() {
        // This function has to reload the list of extensions in the org (names and categories) and, also,
        // refresh the definition of all the extensions in the cache (used during screen validation)
    }
    */
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

function createSection(label, items) {
    const section = {
        guid: generateGuid(),
        label,
        _children: items
    };
    return section;
}

function getTypeMap(pattern) {
    const types = [...getAllScreenFieldTypes(), ...getAllCachedExtensionTypes()].filter(labelFilter(pattern));
    const typeMap = types.reduce((acc, type) => {
        const guid = generateGuid();
        const item = {
            description: type.description || '',
            elementType: guid,
            guid,
            iconName: type.icon,
            iconBackgroundColor: 'gray',
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