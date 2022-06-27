import addFaultActionLabel from '@salesforce/label/AlcNodeContextualMenu.addFaultActionLabel';
import backButtonAlternativeText from '@salesforce/label/AlcNodeContextualMenu.backButtonAlternativeText';
import backButtonTitle from '@salesforce/label/AlcNodeContextualMenu.backButtonTitle';
import copyActionLabel from '@salesforce/label/AlcNodeContextualMenu.copyActionLabel';
import cutActionLabel from '@salesforce/label/AlcNodeContextualMenu.cutActionLabel';
import cutFooterActionLabel from '@salesforce/label/AlcNodeContextualMenu.cutFooterActionLabel';
import cutFooterActionTitle from '@salesforce/label/AlcNodeContextualMenu.cutFooterActionTitle';
import cutOrDeleteBranchElementComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.cutOrDeleteBranchElementComboboxLabel';
import deleteActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteActionLabel';
import deleteFaultActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteFaultActionLabel';
import deleteFooterActionLabel from '@salesforce/label/AlcNodeContextualMenu.deleteFooterActionLabel';
import deleteFooterActionTitle from '@salesforce/label/AlcNodeContextualMenu.deleteFooterActionTitle';
import editDetailsFooterActionLabel from '@salesforce/label/AlcNodeContextualMenu.editDetailsFooterActionLabel';
import editDetailsFooterActionTitle from '@salesforce/label/AlcNodeContextualMenu.editDetailsFooterActionTitle';
import openReferenceFlowTitle from '@salesforce/label/AlcNodeContextualMenu.openReferenceFlowTitle';

export const labelsMap = {
    copyActionLabel,
    cutActionLabel,
    cutFooterActionLabel,
    cutFooterActionTitle,
    deleteActionLabel,
    backButtonAlternativeText,
    backButtonTitle,
    cutOrDeleteBranchElementComboboxLabel,
    addFaultActionLabel,
    deleteFaultActionLabel,
    editDetailsFooterActionLabel,
    editDetailsFooterActionTitle,
    deleteFooterActionLabel,
    deleteFooterActionTitle,
    openReferenceFlowTitle
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
