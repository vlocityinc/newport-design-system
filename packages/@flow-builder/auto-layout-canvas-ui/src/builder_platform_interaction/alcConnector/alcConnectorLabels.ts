import addElementIconAltText from '@salesforce/label/AlcConnector.addElementIconAltText';
import connectorButtonLabel from '@salesforce/label/AlcConnector.connectorButtonLabel';
import faultConnectorBadgeLabel from '@salesforce/label/AlcConnector.faultConnectorBadgeLabel';
import afterLastBadgeLabel from '@salesforce/label/FlowBuilderConnectorLabels.afterLastBadgeLabel';
import forEachBadgeLabel from '@salesforce/label/FlowBuilderConnectorLabels.forEachBadgeLabel';

export const labelsMap = {
    addElementIconAltText,
    faultConnectorBadgeLabel,
    connectorButtonLabel,
    forEachBadgeLabel,
    afterLastBadgeLabel
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
