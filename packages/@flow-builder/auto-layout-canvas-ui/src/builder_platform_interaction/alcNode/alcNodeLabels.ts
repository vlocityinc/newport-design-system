import ariaLabelNode from '@salesforce/label/AlcNode.ariaLabelNode';
import checkboxLabel from '@salesforce/label/AlcNode.checkboxLabel';
import incomingGoToLabel from '@salesforce/label/AlcNode.incomingGoToLabel';
import nodeIconAltText from '@salesforce/label/AlcNode.nodeIconAltText';
import selectionCheckboxAltText from '@salesforce/label/AlcNode.selectionCheckboxAltText';
import deleteAllPathsComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.deleteAllPathsComboboxLabel';
import errorIconAlternativeText from '@salesforce/label/FlowBuilderCanvasElement.errorIconAlternativeText';
import errorIconTitle from '@salesforce/label/FlowBuilderCanvasElement.errorIconTitle';

export const labelsMap = {
    nodeIconAltText,
    selectionCheckboxAltText,
    deleteAllPathsComboboxLabel,
    errorIconAlternativeText,
    errorIconTitle,
    checkboxLabel,
    incomingGoToLabel,
    ariaLabelNode
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
