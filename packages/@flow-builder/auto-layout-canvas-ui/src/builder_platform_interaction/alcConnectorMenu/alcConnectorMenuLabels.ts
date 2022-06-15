import actionSectionLabel from '@salesforce/label/AlcConnectorContextualMenu.actionSectionLabel';
import deleteGoToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.deleteGoToPathItemLabel';
import goToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.goToPathItemLabel';
import loadingResultsText from '@salesforce/label/AlcConnectorContextualMenu.loadingResultsText';
import menuHeader from '@salesforce/label/AlcConnectorContextualMenu.menuHeader';
import pasteMultiItemLabel from '@salesforce/label/AlcConnectorContextualMenu.pasteMultiItemLabel';
import pasteOneItemLabel from '@salesforce/label/AlcConnectorContextualMenu.pasteOneItemLabel';
import reRouteGoToPathItemLabel from '@salesforce/label/AlcConnectorContextualMenu.reRouteGoToPathItemLabel';
import searchInputLabel from '@salesforce/label/AlcConnectorContextualMenu.searchInputLabel';
import searchInputPlaceholder from '@salesforce/label/AlcConnectorContextualMenu.searchInputPlaceholder';
import searchSectionHeading from '@salesforce/label/AlcConnectorContextualMenu.searchSectionHeading';

export const labelsMap = {
    menuHeader,
    actionSectionLabel,
    pasteMultiItemLabel,
    pasteOneItemLabel,
    goToPathItemLabel,
    reRouteGoToPathItemLabel,
    deleteGoToPathItemLabel,
    searchInputLabel,
    searchInputPlaceholder,
    searchSectionHeading,
    loadingResultsText
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
