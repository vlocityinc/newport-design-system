import childElementListboxSectionAriaLabel from '@salesforce/label/FlowBuilderCommonPropertyEditor.childElementListboxSectionAriaLabel';
import childElementListboxSectionAriaDescribedBy from '@salesforce/label/FlowBuilderCommonPropertyEditor.childElementListboxSectionAriaDescribedBy';
import ariaLiveItemReorder from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemReorderInfo';
import ariaLiveItemGrabbed from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemGrabbedInfo';
import ariaLiveItemUnGrabbed from '@salesforce/label/FlowBuilderCommonPropertyEditor.ariaLiveItemUnGrabbedInfo';

const labelsMap = {
    childElementListboxSectionAriaLabel,
    childElementListboxSectionAriaDescribedBy,
    ariaLiveItemReorder,
    ariaLiveItemGrabbed,
    ariaLiveItemUnGrabbed
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
