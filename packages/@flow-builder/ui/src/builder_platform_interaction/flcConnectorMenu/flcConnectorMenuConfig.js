import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const SVG_UTILITY_SPRITE_PATH = '/assets/icons/utility-sprite/svg/symbols.svg';
const SVG_STANDARD_SPRITE_PATH = '/_slds/icons/standard-sprite/svg/symbols.svg';

const pasteSection = {
    guid: generateGuid(),
    heading: '',
    items: [
        {
            guid: generateGuid(),
            description: 'Paste copied element(s)',
            icon: `${SVG_UTILITY_SPRITE_PATH}#paste`,
            separator: true,
            style: 'slds-icon_container slds-icon-standard-textbox',
            label: 'Paste',
            elementType: 'Paste'
        }
    ],
    label: 'Paste Section'
};

/**
 * Create FLC menu configuration from the elements metadata
 * @param {Object} elementsMetadata
 */
export const configureMenu = (elementsMetadata, showEndElement) => {
    const sectionDefinitionsMap = {};

    const sections = elementsMetadata.reduce(
        (acc, { section = null, description, icon, label, elementType }) => {
            if (section == null || (elementType === ELEMENT_TYPE.END_ELEMENT && !showEndElement)) {
                return acc;
            }

            let sectionDefinition = sectionDefinitionsMap[section];
            if (!sectionDefinition) {
                sectionDefinitionsMap[section] = sectionDefinition = {
                    guid: generateGuid(),
                    heading: section,
                    label: section,
                    items: []
                };

                acc.push(sectionDefinition);
            }

            sectionDefinition.items.push({
                guid: generateGuid(),
                description,
                label,
                elementType,
                style: `slds-icon_container slds-icon-${icon.replace(/[:_]/g, '-')}`,
                icon: `${SVG_STANDARD_SPRITE_PATH}#${icon.split(':')[1]}`
            });

            return acc;
        },
        [pasteSection]
    );

    return { sections };
};
