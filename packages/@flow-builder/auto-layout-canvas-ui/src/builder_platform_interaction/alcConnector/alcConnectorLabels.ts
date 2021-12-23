import addElementIconAltText from '@salesforce/label/AlcConnector.addElementIconAltText';
import faultConnectorBadgeLabel from '@salesforce/label/AlcConnector.faultConnectorBadgeLabel';
import connectorButtonLabel from '@salesforce/label/AlcConnector.connectorButtonLabel';
import forEachBadgeLabel from '@salesforce/label/FlowBuilderConnectorLabels.forEachBadgeLabel';
import afterLastBadgeLabel from '@salesforce/label/FlowBuilderConnectorLabels.afterLastBadgeLabel';

export const labelsMap = {
    addElementIconAltText,
    faultConnectorBadgeLabel,
    connectorButtonLabel,
    forEachBadgeLabel,
    afterLastBadgeLabel
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
