import actionSectionLabel from '@salesforce/label/AlcConnectorContextualMenu.actionSectionLabel';
import deleteGoToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.deleteGoToPathItemLabel';
import goToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.goToPathItemLabel';
import menuHeader from '@salesforce/label/AlcConnectorContextualMenu.menuHeader';
import pasteMultiItemLabel from '@salesforce/label/AlcConnectorContextualMenu.pasteMultiItemLabel';
import pasteOneItemLabel from '@salesforce/label/AlcConnectorContextualMenu.pasteOneActionItemLabel';
import reRouteGoToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.reRouteGoToPathItemLabel';

export const labelsMap = {
    menuHeader,
    actionSectionLabel,
    pasteMultiItemLabel,
    pasteOneItemLabel,
    goToPathItemLabel,
    reRouteGoToPathItemLabel,
    deleteGoToPathItemLabel
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
