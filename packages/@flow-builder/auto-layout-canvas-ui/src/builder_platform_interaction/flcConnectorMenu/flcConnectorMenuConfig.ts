// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcConnectorMenuLabels';

export const PASTE_ACTION = 'Paste';
export const MERGE_PATH_ACTION = 'mergePath';

const actionSection = {
    guid: generateGuid(),
    heading: '',
    items: [],
    label: LABELS.actionSectionLabel,
    separator: true
};

const pasteActionItem = {
    guid: generateGuid(),
    icon: 'utility:paste',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.pasteItemLabel,
    elementType: PASTE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

const mergeActionItem = {
    guid: generateGuid(),
    icon: 'utility:merge',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: 'branch-merge',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.mergePathItemLabel,
    elementType: MERGE_PATH_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

/**
 * Create FLC menu configuration from the elements metadata
 * @param {Object} elementsMetadata
 * @param {Boolean} showEndElement - Whether to show the end element item
 * @param {Boolean} canMergePath - Whether to show the merge path item
 * @param {Boolean} isPasteAvailable - If paste is available
 */
export const configureMenu = (elementsMetadata, showEndElement, isPasteAvailable, canMergePath) => {
    const sectionDefinitionsMap = {};

    let extraSections = [];
    actionSection.items = [];

    if (isPasteAvailable || canMergePath) {
        if (isPasteAvailable) {
            actionSection.items.push(pasteActionItem);
        }

        if (canMergePath) {
            actionSection.items.push(mergeActionItem);
        }

        extraSections = [actionSection];
    }

    const sections = elementsMetadata.reduce(
        (
            acc,
            { section = null, description, icon, iconShape, iconBackgroundColor, label, elementType, type, isSupported }
        ) => {
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

            // Using the new isSupported property to determine what is shown in the connector menu
            if (isSupported) {
                sectionDefinition.items.push({
                    guid: generateGuid(),
                    description,
                    label,
                    elementType,
                    icon,
                    iconContainerClass,
                    iconClass,
                    iconSize,
                    iconVariant,
                    rowClass: 'slds-listbox__item'
                });
            }

            return acc;
        },
        extraSections
    );
    // Filtering out sections that no longer have items in them.
    const updatedSections = sections.filter((section) => {
        return section.items && section.items.length > 0;
    });
    return { sections: updatedSections };
};
