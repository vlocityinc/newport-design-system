import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { ConnectorRenderInfo, ConnectorLabelType } from 'builder_platform_interaction/autoLayoutCanvas';
import { getStyleFromGeometry } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from './flcConnectorLabels';

/**
 * Auto layout Canvas Connector Component.
 */
export default class FlcConnector extends LightningElement {
    @api
    connectorInfo!: ConnectorRenderInfo;

    @api
    isSelectionMode!: boolean;

    get labels() {
        return LABELS;
    }

    /**
     * Checks if add element button should be visible or not
     */
    get showAddElementButton() {
        return this.connectorInfo.addInfo && !this.isSelectionMode;
    }

    /**
     * Gets the location for the add element button
     */
    get buttonMenuStyle() {
        return getStyleFromGeometry({ y: this.connectorInfo.addInfo!.offsetY });
    }

    /**
     * Add the inverse variant to the button when the contextual menu is open
     */
    get addIconVariant() {
        const { addInfo } = this.connectorInfo;
        return addInfo && addInfo.menuOpened ? 'inverse' : '';
    }

    /**
     * Gets the info needed to render the connector svg
     */
    get svgInfo() {
        const { svgInfo } = this.connectorInfo;

        const { path, geometry } = svgInfo;

        return {
            width: geometry.w,
            height: geometry.h,
            style: getStyleFromGeometry(geometry),
            path
        };
    }

    get hasConnectorBadge() {
        return this.connectorInfo.labelType !== ConnectorLabelType.NONE;
    }

    get connectorBadgeClass() {
        const labelType = this.connectorInfo.labelType;

        return classSet('connector-badge slds-align_absolute-center slds-badge').add({
            'fault-badge': labelType === ConnectorLabelType.FAULT
        });
    }

    get connectorBadgeLabel() {
        const labelType: ConnectorLabelType = this.connectorInfo.labelType!;

        switch (labelType) {
            case ConnectorLabelType.LOOP_AFTER_LAST:
                return LABELS.afterLastBadgeLabel;
            case ConnectorLabelType.FAULT:
                return LABELS.faultConnectorBadgeLabel;
            case ConnectorLabelType.LOOP_FOR_EACH:
                return LABELS.forEachBadgeLabel;
            case ConnectorLabelType.BRANCH:
                return this.connectorInfo.connectorBadgeLabel;
            default:
                return '';
        }
    }

    /**
     * Gets the class for the svg
     */
    get svgClassName() {
        return classSet(this.connectorInfo.isFault ? 'fault' : this.connectorInfo.type).add({
            'connector-to-be-deleted': this.connectorInfo.toBeDeleted
        });
    }

    get connectorLabelStyle() {
        return getStyleFromGeometry({ y: this.connectorInfo.labelOffsetY });
    }
}
