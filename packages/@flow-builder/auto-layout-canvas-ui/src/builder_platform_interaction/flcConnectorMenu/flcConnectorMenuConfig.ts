import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcConnectorMenuLabels';

import type { ElementMetadata, MenuSection } from 'builder_platform_interaction/autoLayoutCanvas';

import { storeUtils } from 'builder_platform_interaction/sharedUtils';

const { generateGuid } = storeUtils;

export const PASTE_ACTION = 'Paste';
export const MERGE_PATH_ACTION = 'mergePath';
export const GERGE_ACTION = 'gerge'; // TODO name change
export const GERGE_REROUTE_ACTION = 'gergeReroute'; // TODO name change
export const GERGE_DELETE_ACTION = 'gergeDelete'; // TODO name change

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

const addGergeActionItem = {
    guid: generateGuid(),
    icon: 'utility:level_down',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.gergePathItemLabel, // TODO
    elementType: GERGE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

const rerouteGergeActionItem = {
    guid: generateGuid(),
    icon: 'utility:level_down',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.reRouteGergePathItemLabel, // TODO
    elementType: GERGE_REROUTE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

const deleteGergeActionItem = {
    guid: generateGuid(),
    icon: 'utility:delete',
    iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
    iconClass: '',
    iconSize: 'x-small',
    iconVariant: '',
    label: LABELS.deleteGergePathItemLabel, // TODO
    elementType: GERGE_DELETE_ACTION,
    rowClass: 'slds-listbox__item action-row-line-height'
};

/**
 * Create FLC menu configuration from the elements metadata
 * @param elementsMetadata
 * @param showEndElement - Whether to show the end element item
 * @param canMergePath - Whether to show the merge path item
 * @param isPasteAvailable - If paste is available
 * @param canAddGoto - Is the next element END
 * @param hasGoto - Is this a Goto connection
 */
export const configureMenu = (
    elementsMetadata: ElementMetadata[],
    showEndElement: boolean,
    isPasteAvailable: boolean,
    canMergePath: boolean,
    canAddGoto: boolean,
    hasGoto: boolean
) => {
    const sectionDefinitionsMap = {};

    let extraSections: MenuSection[] = [];
    actionSection.items = [];

    if (isPasteAvailable || canMergePath || canAddGoto || hasGoto) {
        if (hasGoto) {
            actionSection.items.push(rerouteGergeActionItem);
            actionSection.items.push(deleteGergeActionItem);
        } else if (canAddGoto) {
            actionSection.items.push(addGergeActionItem);
        }

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
                const item: any = {
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
                };
                if (elementSubtype) {
                    item.elementSubtype = elementSubtype;
                }
                sectionDefinition.items.push(item);
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
