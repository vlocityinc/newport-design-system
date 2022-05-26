import allResources from '@salesforce/label/FlowBuilderFieldInput.allResources';
import entityFields from '@salesforce/label/FlowBuilderFieldInput.entityFields';
import resourceType from '@salesforce/label/FlowBuilderFieldInput.resourceType';
import settingsAlt from '@salesforce/label/FlowBuilderFieldInput.settingsAlt';
import settingsTitle from '@salesforce/label/FlowBuilderFieldInput.settingsTitle';

export const labelsMap = {
    allResources,
    settingsTitle,
    settingsAlt,
    entityFields,
    resourceType
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
