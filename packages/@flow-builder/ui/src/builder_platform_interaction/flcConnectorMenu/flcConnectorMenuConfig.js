import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const PASTE_ACTION = 'Paste';

const pasteSection = {
    guid: generateGuid(),
    heading: '',
    items: [
        {
            guid: generateGuid(),
            description: 'Paste copied element(s)',
            icon: 'standard:textbox',
            separator: true,
            label: 'Paste',
            elementType: PASTE_ACTION
        }
    ],
    label: 'Paste Section'
};

/**
 * Create FLC menu configuration from the elements metadata
 * @param {Object} elementsMetadata
 * @param {Boolean} showEndElement
 * @param {Boolean} isPasteAvailable
 */
export const configureMenu = (elementsMetadata, showEndElement, isPasteAvailable) => {
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
                icon
            });

            return acc;
        },
        isPasteAvailable ? [pasteSection] : []
    );

    return { sections };
};
