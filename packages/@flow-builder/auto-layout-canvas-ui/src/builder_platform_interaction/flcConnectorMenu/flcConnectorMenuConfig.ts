// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcConnectorMenuLabels';

export const PASTE_ACTION = 'Paste';

export const pasteSection = {
    guid: generateGuid(),
    heading: '',
    items: [
        {
            guid: generateGuid(),
            description: LABELS.pasteItemDescription,
            icon: 'standard:record',
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass: 'paste-icon',
            iconSize: 'small',
            iconVariant: '',
            label: LABELS.pasteItemLabel,
            elementType: PASTE_ACTION
        }
    ],
    label: LABELS.pasteSectionLabel,
    separator: true
};

/**
 * Create FLC menu configuration from the elements metadata
 * @param {Object} elementsMetadata
 * @param {Boolean} showEndElement
 * @param {Boolean} isPasteAvailable
 */
export const configureMenu = (elementsMetadata = [], showEndElement, isPasteAvailable) => {
    const sectionDefinitionsMap = {};

    const sections = elementsMetadata.reduce(
        (acc, { section = null, description, icon, iconShape, iconBackgroundColor, label, elementType, type }) => {
            if (section == null || (type === ElementType.END && !showEndElement)) {
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

            let iconContainerClass = 'slds-media__figure slds-listbox__option-icon';
            let iconClass = '';
            let iconSize = 'small';
            let iconVariant = '';

            if (iconBackgroundColor) {
                iconClass = iconBackgroundColor;
            }

            if (iconShape === ICON_SHAPE.CIRCLE && type === ElementType.END) {
                iconClass = `${iconClass} end-element-svg`;
                iconSize = 'xx-small';
                iconVariant = 'inverse';
            } else if (iconShape === ICON_SHAPE.DIAMOND) {
                iconContainerClass = `${iconContainerClass} rotate-icon-container slds-icon-standard-decision`;
                iconClass = `${iconClass} rotate-icon-svg`;
            }

            sectionDefinition.items.push({
                guid: generateGuid(),
                description,
                label,
                elementType,
                icon,
                iconContainerClass,
                iconClass,
                iconSize,
                iconVariant
            });

            return acc;
        },
        isPasteAvailable ? [pasteSection] : []
    );

    return { sections };
};
