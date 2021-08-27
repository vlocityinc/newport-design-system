import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { LABELS } from './alcConnectorMenuLabels';

import type { ElementMetadata, MenuSection } from 'builder_platform_interaction/autoLayoutCanvas';

import { storeUtils } from 'builder_platform_interaction/sharedUtils';

const { generateGuid } = storeUtils;

export const PASTE_ACTION = 'Paste';
export const GOTO_ACTION = 'goTo';
export const GOTO_REROUTE_ACTION = 'goToReroute';
export const GOTO_DELETE_ACTION = 'goToDelete';

const actionSection: MenuSection = {
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

const addGoToActionItem = {
    guid: generateGuid(),
    icon: 'utility:level_down',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.goToPathItemLabel,
    elementType: GOTO_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

const rerouteGoToActionItem = {
    guid: generateGuid(),
    icon: 'utility:level_down',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.reRouteGoToPathItemLabel,
    elementType: GOTO_REROUTE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

const deleteGoToActionItem = {
    guid: generateGuid(),
    icon: 'utility:delete',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.deleteGoToPathItemLabel,
    elementType: GOTO_DELETE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

/**
 * Create ALC menu configuration from the elements metadata
 *
 * @param elementsMetadata
 * @param showEndElement - Whether to show the end element item
 * @param isPasteAvailable - If paste is available
 * @param canAddGoto - Is the next element END
 * @param isGoToConnector - Is this a Goto connection
 */
export const configureMenu = (
    elementsMetadata: ElementMetadata[],
    showEndElement: boolean,
    isPasteAvailable: boolean,
    canAddGoto: boolean,
    isGoToConnector: boolean
) => {
    const sectionDefinitionsMap = {};

    let extraSections: MenuSection[] = [];
    actionSection.items = [];

    if (isPasteAvailable || canAddGoto || isGoToConnector) {
        if (isGoToConnector) {
            actionSection.items.push(rerouteGoToActionItem);
            actionSection.items.push(deleteGoToActionItem);
        } else if (canAddGoto) {
            actionSection.items.push(addGoToActionItem);
        }

        if (isPasteAvailable) {
            actionSection.items.push(pasteActionItem);
        }

        extraSections = [actionSection];
    }

    const sections = elementsMetadata.reduce(
        (
            acc,
            {
                section,
                description,
                icon,
                iconShape,
                iconBackgroundColor,
                label,
                elementType,
                elementSubtype,
                type,
                isSupported
            }
        ) => {
            if (section == null || (type === NodeType.END && !showEndElement)) {
                return acc;
            }

            let sectionDefinition = sectionDefinitionsMap[section];
            if (!sectionDefinition) {
                sectionDefinitionsMap[section] = sectionDefinition = {
                    guid: generateGuid(),
                    heading: type === NodeType.ORCHESTRATED_STAGE ? null : section,
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

            if (iconShape === ICON_SHAPE.CIRCLE && type === NodeType.END) {
                iconClass = `${iconClass} end-element-svg`;
                iconSize = 'xx-small';
                iconVariant = 'inverse';
            } else if (iconShape === ICON_SHAPE.DIAMOND) {
                iconContainerClass = `${iconContainerClass} rotate-icon-container slds-icon-standard-decision`;
                iconClass = `${iconClass} rotate-icon-svg`;
            }

            // Using the new isSupported property to determine what is shown in the connector menu
            if (isSupported) {
                const item = {
                    guid: generateGuid(),
                    description,
                    label,
                    elementType,
                    icon,
                    iconContainerClass,
                    iconClass,
                    iconSize,
                    iconVariant,
                    rowClass: 'slds-listbox__item',
                    elementSubtype
                };

                sectionDefinition.items.push(item);
            }

            return acc;
        },
        extraSections
    );
    // Filtering out sections that no longer have items in them.
    const updatedSections = sections.filter((section) => {
        return section.items?.length > 0;
    });
    return { sections: updatedSections };
};
