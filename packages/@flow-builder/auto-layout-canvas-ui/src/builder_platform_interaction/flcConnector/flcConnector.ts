import { LightningElement, api } from 'lwc';
import {
    ConditionType,
    ConnectorType,
    ConnectorVariant,
    ConnectorRenderInfo
} from 'builder_platform_interaction/autoLayoutCanvas';
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

    isDefaultBranchConnector() {
        return this.connectorInfo.conditionType === ConditionType.DEFAULT;
    }

    isFaultConnector() {
        return this.connectorInfo.conditionType === ConditionType.FAULT;
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
        return this.isDefaultBranchConnector() || this.isFaultConnector() || this.isLoopConnectorWithBadge();
    }

    get connectorBadgeClass() {
        let classes = 'connector-badge slds-align_absolute-center slds-badge';

        if (this.isDefaultBranchConnector() || this.isLoopConnectorWithBadge()) {
            classes = `default-badge ${classes}`;
        } else {
            classes = `fault-badge ${classes}`;
        }

        return classes;
    }

    get connectorBadgeLabel() {
        const connectorType = this.connectorInfo.type;
        if (
            (connectorType === ConnectorType.BRANCH_HEAD || connectorType === ConnectorType.BRANCH_EMPTY_HEAD) &&
            this.connectorInfo.variant === ConnectorVariant.LOOP
        ) {
            return LABELS.forEachBadgeLabel;
        } else if (connectorType === ConnectorType.LOOP_AFTER_LAST) {
            return LABELS.afterLastBadgeLabel;
        }

        return this.isFaultConnector()
            ? this.labels.faultConnectorBadgeLabel
            : this.connectorInfo.defaultConnectorLabel;
    }

    /**
     * Gets the class for the svg
     */
    get svgClassName() {
        let classes = this.connectorInfo.isFault ? 'fault' : this.connectorInfo.type;
        if (this.connectorInfo.toBeDeleted) {
            classes = `${classes} connector-to-be-deleted`;
        }

        return classes;
    }

    get connectorLabelStyle() {
        return getStyleFromGeometry({ y: this.connectorInfo.labelOffsetY });
    }

    isLoopConnectorWithBadge() {
        const { type, variant } = this.connectorInfo;

        if (variant === ConnectorVariant.LOOP) {
            return type === ConnectorType.BRANCH_HEAD || type === ConnectorType.BRANCH_EMPTY_HEAD;
        }

        return type === ConnectorType.LOOP_AFTER_LAST;
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
