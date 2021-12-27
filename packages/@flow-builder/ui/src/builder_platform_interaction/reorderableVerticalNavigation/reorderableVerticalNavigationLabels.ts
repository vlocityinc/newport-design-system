import ariaLiveItemGrabbed from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemGrabbedInfo';
import ariaLiveItemReorder from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemReorderInfo';
import ariaLiveItemUnGrabbed from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemUnGrabbedInfo';
import childElementListboxSectionAriaDescribedBy from '@salesforce/label/FlowBuilderCommonPropertyEditor.childElementListboxSectionAriaDescribedBy';
import childElementListboxSectionAriaLabel from '@salesforce/label/FlowBuilderCommonPropertyEditor.childElementListboxSectionAriaLabel';

const labelsMap = {
    childElementListboxSectionAriaLabel,
    childElementListboxSectionAriaDescribedBy,
    ariaLiveItemReorder,
    ariaLiveItemGrabbed,
    ariaLiveItemUnGrabbed
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
