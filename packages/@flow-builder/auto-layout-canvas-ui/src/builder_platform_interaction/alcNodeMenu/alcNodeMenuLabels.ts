import copyActionLabel from '@salesforce/label/AlcNodeContextualMenu.copyActionLabel';
import deleteActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteActionLabel';
import backButtonAlternativeText from '@salesforce/label/AlcNodeContextualMenu.backButtonAlternativeText';
import backButtonTitle from '@salesforce/label/AlcNodeContextualMenu.backButtonTitle';
import deleteBranchElementComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.deleteBranchElementComboboxLabel';
import addFaultActionLabel from '@salesforce/label/AlcNodeContextualMenu.addFaultActionLabel';
import deleteFaultActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteFaultActionLabel';
import editDetailsFooterActionLabel from '@salesforce/label/AlcNodeContextualMenu.editDetailsFooterActionLabel';
import editDetailsFooterActionTitle from '@salesforce/label/AlcNodeContextualMenu.editDetailsFooterActionTitle';
import deleteFooterActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteFooterActionLabel';
import deleteFooterActionTitle from '@salesforce/label/AlcNodeContextualMenu.deleteFooterActionTitle';
import openReferenceFlowTitle from '@salesforce/label/AlcNodeContextualMenu.openReferenceFlowTitle';

export const labelsMap = {
    copyActionLabel,
    deleteActionLabel,
    backButtonAlternativeText,
    backButtonTitle,
    deleteBranchElementComboboxLabel,
    addFaultActionLabel,
    deleteFaultActionLabel,
    editDetailsFooterActionLabel,
    editDetailsFooterActionTitle,
    deleteFooterActionLabel,
    deleteFooterActionTitle,
    openReferenceFlowTitle
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
