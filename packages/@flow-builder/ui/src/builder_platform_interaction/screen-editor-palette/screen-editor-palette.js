import { Element } from 'engine';
import { getAllScreenFieldTypes } from 'builder_platform_interaction-screen-editor-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

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

            sections[fieldType.category]._children.push({
                description: fieldType.description || '',
                elementType: fieldType,
                guid: generateGuid(),
                iconName: fieldType.icon,
                label: fieldType.label
            });
        }
    }

    handleSearch() {
        this.template.querySelector('builder_platform_interaction-palette').filter(this.template.querySelector(FILTER_INPUT_SELECTOR).value);
    }

    handleReload() {}
}
