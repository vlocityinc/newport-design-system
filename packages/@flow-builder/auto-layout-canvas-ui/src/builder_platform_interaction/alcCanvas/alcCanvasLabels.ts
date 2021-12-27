import cancelButtonLabel from '@salesforce/label/FlowBuilderAlertModal.cancelButtonLabel';
import confirmDeleteLabel from '@salesforce/label/FlowBuilderAlertModal.confirmDeleteLabel';
import deleteWarningBodyTextLabel from '@salesforce/label/FlowBuilderAlertModal.deleteWarningBodyTextLabel';
import deleteWarningHeaderTitle from '@salesforce/label/FlowBuilderAlertModal.deleteWarningHeaderTitle';

export const labelsMap = {
    cancelButtonLabel,
    deleteWarningHeaderTitle,
    deleteWarningBodyTextLabel,
    confirmDeleteLabel
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
