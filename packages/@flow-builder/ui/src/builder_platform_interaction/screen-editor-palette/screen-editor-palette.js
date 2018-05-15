import { Element } from 'engine';
import { getAllScreenFieldTypes } from 'builder_platform_interaction-screen-editor-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import {
    localizeString,
    I18N_KEY_SCREEN_PALETTE_TITLE,
    I18N_KEY_SCREEN_PALETTE_SEARCH,
    I18N_KEY_SCREEN_PALETTE_SEARCH_PLACEHOLDER
} from 'builder_platform_interaction-screen-editor-i18n-utils';

export default class ScreenPalette extends Element {
    types;

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

            sections[fieldType.category]._children.push({
                description: fieldType.description || '',
                elementType: fieldType,
                guid: generateGuid(),
                iconName: fieldType.icon,
                label: fieldType.label
            });
        }
    }

    get titleLabel() {
        return localizeString(I18N_KEY_SCREEN_PALETTE_TITLE);
    }

    get searchLabel() {
        return localizeString(I18N_KEY_SCREEN_PALETTE_SEARCH);
    }

    get searchPlaceholder() {
        return localizeString(I18N_KEY_SCREEN_PALETTE_SEARCH_PLACEHOLDER);
    }

    handleSearch() {
        // this.root.querySelector('builder_platform_interaction-palette').filter(this.root.querySelector('#filter-input').value);
    }

    handleClearSearch() {
        this.root.querySelector('#filter-input').value = '';
        this.handleSearch();
    }
}
