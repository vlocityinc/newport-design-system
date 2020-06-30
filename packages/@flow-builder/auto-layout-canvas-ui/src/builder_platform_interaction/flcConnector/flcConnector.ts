import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { ConnectorRenderInfo, ConnectorLabelType } from 'builder_platform_interaction/autoLayoutCanvas';
import { getStyleFromGeometry } from 'builder_platform_interaction/flcComponentsUtils';
import { ReorderConnectorsEvent } from 'builder_platform_interaction/flcEvents';
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

    hasConditions() {
        return this.connectorInfo.conditionOptions;
    }

    get isLabelPickerDisabled() {
        return this.hasOneOption || this.isSelectionMode;
    }

    get hasOneOption() {
        return this.hasConditions() && this.connectorInfo.conditionOptions!.length === 1;
    }

    get canSelectLabel() {
        return this.hasConditions() && !this.isDefaultOrFault;
    }

    get hasConnectorBadge() {
        return this.connectorInfo.labelType !== ConnectorLabelType.NONE;
    }

    get connectorBadgeClass() {
        const labelType = this.connectorInfo.labelType;

        return classSet('connector-badge slds-align_absolute-center slds-badge').add({
            'default-badge': labelType !== ConnectorLabelType.FAULT,
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
            case ConnectorLabelType.BRANCH_DEFAULT:
                return this.connectorInfo.defaultConnectorLabel;
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

    /**
     * Helper function to return the input component present in the base combobox used for connector labels
     */
    _getComboboxInputComponent = combobox => {
        // Grabbing the baseCombobox's input component
        const baseCombobox = combobox && combobox.shadowRoot.querySelector('lightning-base-combobox');
        const baseComboboxInput = baseCombobox && baseCombobox.shadowRoot.querySelector('input');

        return baseComboboxInput;
    };

    /**
     * Helper function to set the background color for the base combobox's input component.
     * This is currently being used to set the background color on hover in and out.
     */
    _setComboboxInputBackgroundColor = color => {
        const combobox = this.template.querySelector('lightning-combobox');
        const baseComboboxInput = this._getComboboxInputComponent(combobox);
        if (baseComboboxInput) {
            baseComboboxInput.style.background = color;
        }
    };

    handleComboboxChange = event => {
        const { connectionInfo, conditionValue } = this.connectorInfo;
        const reorderConnectorsEvent = new ReorderConnectorsEvent(
            connectionInfo.parent,
            conditionValue,
            event.detail.value
        );
        this.dispatchEvent(reorderConnectorsEvent);
    };

    /**
     * Sets the background color of the combobox on hover.
     *
     * @param {object} event - Mouse over event on the combobox used for connector labels
     */
    handleComboboxMouseOver = event => {
        event.stopPropagation();
        if (!this.hasOneOption) {
            this._setComboboxInputBackgroundColor('#f4f6f9');
        }
    };

    /**
     * Resets the background color of the combobox to white on hover out.
     * @param {object} event - Mouse out event on the combobox used for connector labels
     */
    handleComboboxMouseOut = event => {
        event.stopPropagation();
        if (!this.hasOneOption) {
            this._setComboboxInputBackgroundColor('#fff');
        }
    };
}
