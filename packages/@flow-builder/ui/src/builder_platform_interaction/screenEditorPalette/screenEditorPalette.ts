// @ts-nocheck
import { LightningElement, track, api } from 'lwc';
import { labelFilter } from 'builder_platform_interaction/filterLib';
import { SCREEN_EDITOR_GUIDS, setDragFieldValue } from 'builder_platform_interaction/screenEditorUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { createAddScreenFieldEvent } from 'builder_platform_interaction/events';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import { orgHasFlowBuilderAutomaticFields } from 'builder_platform_interaction/contextLib';
import templateWhenAutomaticFieldsIsDisabled from './screenEditorPalette.html';
import templateWhenAutomaticFieldsIsEnabled from './screenEditorPaletteInTab.html';

const SELECTORS = {
    FILTER_INPUT: '.palette-search-input'
};

export default class ScreenPalette extends LightningElement {
    @track types;
    _screenFieldTypes;
    _extensionTypes;

    appExchangeLink = APP_EXCHANGE_LINK;

    labels = LABELS;

    orgHasFlowBuilderAutomaticFields = orgHasFlowBuilderAutomaticFields();

    @api get screenFieldTypes() {
        return this._screenFieldTypes;
    }

    set screenFieldTypes(screenFieldTypes) {
        this._screenFieldTypes = screenFieldTypes;
        this.buildModel();
    }

    @api get extensionTypes() {
        return this._extensionTypes;
    }

    set extensionTypes(extensionTypes) {
        this._extensionTypes = extensionTypes;
        this.buildModel();
    }

    // Create palette model
    buildModel() {
        const sections = [];

        const filterInput = this.template.querySelector(SELECTORS.FILTER_INPUT);
        const pattern = filterInput ? filterInput.value.trim() : undefined;

        if (this.screenFieldTypes || this.extensionTypes) {
            const typeMap = getTypeMap(pattern, this.screenFieldTypes, this.extensionTypes);
            for (const type in typeMap) {
                if (typeMap.hasOwnProperty(type)) {
                    const items = typeMap[type];
                    if (items && items.length > 0) {
                        const section = createSection(type, items.sort(labelComparator));
                        sections.push(section);
                    }
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
    };

    handleDragStart(event) {
        // Dragging an element could mean user wants to add the corresponding
        // field type to the canvas. Figure out which field type user wants
        // to add.
        const { elementType: fieldGuid } = JSON.parse(event.dataTransfer.getData('text'));
        const fieldTypeName = getFieldTypeNameByGuid(this.types, fieldGuid);
        event.dataTransfer.setData('text', fieldTypeName);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('dragStartLocation', SCREEN_EDITOR_GUIDS.PALETTE); // Needed for safari browser. effectAllowed always resolves to 'all' and it is not supported by safari.
        setDragFieldValue(fieldTypeName);
    }

    /* TODO - W-5617771
    handleReload() {
        // This function has to reload the list of extensions in the org (names and categories) and, also,
        // refresh the definition of all the extensions in the cache (used during screen validation)
    }
    */

    render() {
        return this.orgHasFlowBuilderAutomaticFields
            ? templateWhenAutomaticFieldsIsEnabled
            : templateWhenAutomaticFieldsIsDisabled;
    }
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
    throw new Error('Unable to find field type by guid');
}

function createSection(label, items) {
    const section = {
        guid: generateGuid(),
        label,
        _children: items
    };
    return section;
}

function getTypeMap(pattern: string, screenFieldTypes: Array<any> = [], extTypes: Array<any> = []) {
    const types = [...screenFieldTypes, ...extTypes].filter(labelFilter(pattern));
    const typeMap = types.reduce((acc, type) => {
        const guid = generateGuid();
        const item = {
            description: type.description || '',
            elementType: guid,
            guid,
            iconName: type.icon,
            iconBackgroundColor: 'background-gray',
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
