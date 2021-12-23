import cancelButtonLabel from '@salesforce/label/FlowBuilderAlertModal.cancelButtonLabel';
import deleteWarningHeaderTitle from '@salesforce/label/FlowBuilderAlertModal.deleteWarningHeaderTitle';
import deleteWarningBodyTextLabel from '@salesforce/label/FlowBuilderAlertModal.deleteWarningBodyTextLabel';
import confirmDeleteLabel from '@salesforce/label/FlowBuilderAlertModal.confirmDeleteLabel';

export const labelsMap = {
    cancelButtonLabel,
    deleteWarningHeaderTitle,
    deleteWarningBodyTextLabel,
    confirmDeleteLabel
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
