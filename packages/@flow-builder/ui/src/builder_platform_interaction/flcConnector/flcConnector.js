const BASE_CONNECTOR_WIDTH = 24;
const HALF_BASE_CONNECTOR_WIDTH = BASE_CONNECTOR_WIDTH / 2;
const BASE_HALF_STROKE_WIDTH = 3;
const CONNECTOR_HEIGHT = 144;
const GRID_SIZE = 24;
const CURVE_RADIUS = 16;

import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { ReorderConnectorsEvent } from 'builder_platform_interaction/events';
import {
    ConnectorType,
    getStyle,
    getLocation,
    getPathForStraightConnector,
    getPathForTopBentConnector,
    getPathForBottomBentConnector
} from 'builder_platform_interaction/flowUtils';

/**
 * Fixed Layout Canvas Connector Component
 */
export default class FlcConnector extends LightningElement {
    @api
    connectorInfo;

    @api
    isNew;

    @api
    isSelectionMode;

    // Variable to track if the connector has been rendered yet once or not
    _isRendered = false;

    /**
     * Computes the classes for the connector element
     */
    get computedClassName() {
        return classSet('connector')
            .add({ 'is-new': this.isNew })
            .toString();
    }

    /**
     * Checks if add element button should be visible or not
     */
    get showAddElementButton() {
        return this.connectorInfo.canAddNode && !this.isSelectionMode;
    }

    /**
     * Gets the location for the connector label
     */
    get connectorLabelStyle() {
        const { svgWidth } = this.connectorInfo;

        return getStyle({
            top: 2 * GRID_SIZE + 8,
            left: svgWidth
        });
    }

    /**
     * Gets the location for the add element button
     */
    get buttonMenuStyle() {
        const { offsetY, svgWidth } = this.connectorInfo;

        return getStyle({
            top: offsetY
                ? offsetY + GRID_SIZE / 2
                : this.connectorInfo.connectorType === ConnectorType.TOP_CHILD_CONNECTOR
                ? GRID_SIZE * 5
                : CONNECTOR_HEIGHT / 2,
            left: svgWidth
        });
    }

    /**
     * Add the inverse variant to the button when the contextual menu is open
     */
    get addIconVariant() {
        const { menuOpened } = this.connectorInfo;
        return menuOpened ? 'inverse' : '';
    }

    /**
     * Gets the svg info (height, width, path ...)
     */
    get svgInfo() {
        switch (this.connectorInfo.connectorType) {
            case ConnectorType.STRAIGHT:
                return this.getStraightConnectorInfo();
            case ConnectorType.TOP_CHILD_CONNECTOR:
                return this.getTopChildConnectorInfo();
            case ConnectorType.BOTTOM_CHILD_CONNECTOR:
                return this.getBottomChildConnectorInfo();
            case 'loop-left':
                return this.getLeftLoopConnectorInfo();
            case 'loop-right':
                return this.getRightLoopConnectorInfo();
            default:
                return {};
        }
    }

    get hasOneOption() {
        return this.connectorInfo.childReferences.length === 1;
    }

    get isConnectorDefaultOrFault() {
        return this.connectorInfo.isDefault || this.connectorInfo.isFault;
    }

    get connectorBadgeClass() {
        let classes = 'connector-badge slds-align_absolute-center slds-badge';

        if (this.connectorInfo.isDefault) {
            classes = `default-badge ${classes}`;
        } else {
            classes = `fault-badge ${classes}`;
        }

        return classes;
    }

    get connectorBadgeLabel() {
        return this.connectorInfo.isDefault ? this.connectorInfo.defaultConnectorLabel : 'Fault';
    }

    /**
     * Gets the class for the connector path
     */
    getConnectorPathClassName() {
        return this.connectorInfo.isFault ? 'canvas-path fault' : 'canvas-path';
    }

    /**
     * Gets the svg info for a straight connector
     */
    getStraightConnectorInfo() {
        const { svgHeight, offsetY, targetGuid } = this.connectorInfo;
        const style = getStyle({
            left: -HALF_BASE_CONNECTOR_WIDTH,
            top: offsetY
        });

        return {
            w: BASE_CONNECTOR_WIDTH,
            h: svgHeight,
            style,
            path: getPathForStraightConnector(
                getLocation(HALF_BASE_CONNECTOR_WIDTH, 0),
                // Reduce the end locationY for connector between last branch element and the upcoming connector curve
                getLocation(HALF_BASE_CONNECTOR_WIDTH, targetGuid ? svgHeight : svgHeight - GRID_SIZE * 2)
            ),
            pathClass: this.getConnectorPathClassName()
        };
    }

    /**
     * Gets the svg info for the connector between the parent element and it's children
     */
    getTopChildConnectorInfo() {
        const { svgWidth, svgHeight, sourceY, targetGuid } = this.connectorInfo;

        // The params  for getPathForStraightConnector are in the order startLocation and endLocation
        let path = getPathForStraightConnector(
            getLocation(HALF_BASE_CONNECTOR_WIDTH, 0),
            getLocation(HALF_BASE_CONNECTOR_WIDTH, BASE_HALF_STROKE_WIDTH + svgHeight)
        );

        // The params for getPathForTopBentConnector are in the order startLocation, curveStartLocation,
        // curveDirection, curveEndLocation, endLocation
        if (svgWidth < 0) {
            path = getPathForTopBentConnector(
                getLocation(-svgWidth + HALF_BASE_CONNECTOR_WIDTH, BASE_HALF_STROKE_WIDTH),
                getLocation(HALF_BASE_CONNECTOR_WIDTH + CURVE_RADIUS, BASE_HALF_STROKE_WIDTH),
                0,
                getLocation(HALF_BASE_CONNECTOR_WIDTH, BASE_HALF_STROKE_WIDTH + CURVE_RADIUS),
                getLocation(
                    HALF_BASE_CONNECTOR_WIDTH,
                    targetGuid ? BASE_HALF_STROKE_WIDTH + svgHeight : BASE_HALF_STROKE_WIDTH + svgHeight - GRID_SIZE * 2
                )
            );
        } else if (svgWidth > 0) {
            path = getPathForTopBentConnector(
                getLocation(0, BASE_HALF_STROKE_WIDTH),
                getLocation(svgWidth - CURVE_RADIUS, BASE_HALF_STROKE_WIDTH),
                1,
                getLocation(svgWidth, BASE_HALF_STROKE_WIDTH + CURVE_RADIUS),
                getLocation(
                    svgWidth,
                    targetGuid ? svgHeight + BASE_HALF_STROKE_WIDTH : svgHeight + BASE_HALF_STROKE_WIDTH - GRID_SIZE * 2
                )
            );
        }

        return {
            w: svgWidth !== 0 ? Math.abs(svgWidth) + HALF_BASE_CONNECTOR_WIDTH : BASE_CONNECTOR_WIDTH,
            h: svgHeight + BASE_HALF_STROKE_WIDTH,
            style: getStyle({
                left:
                    svgWidth < 0 ? svgWidth - HALF_BASE_CONNECTOR_WIDTH : svgWidth > 0 ? 0 : -HALF_BASE_CONNECTOR_WIDTH,
                top: sourceY - BASE_HALF_STROKE_WIDTH
            }),
            path,
            pathClass: this.getConnectorPathClassName()
        };
    }

    /**
     * Gets the svg info for the connector joining the child branches to the main branch
     */
    getBottomChildConnectorInfo() {
        const { svgWidth, svgHeight, offsetY, sourceY } = this.connectorInfo;
        let path;

        // The params for getPathForBottomBentConnector are in the order startLocation, firstCurveStartLocation,
        // firstCurveDirection, firstCurveEndLocation, secondCurveStartLocation, secondCurveDirection,
        // secondCurveEndLocation, endLocation
        if (svgWidth < 0) {
            path = getPathForBottomBentConnector(
                getLocation(HALF_BASE_CONNECTOR_WIDTH, 0),
                getLocation(HALF_BASE_CONNECTOR_WIDTH, 0),
                0,
                getLocation(HALF_BASE_CONNECTOR_WIDTH + CURVE_RADIUS, CURVE_RADIUS),
                getLocation(-svgWidth + HALF_BASE_CONNECTOR_WIDTH - CURVE_RADIUS, CURVE_RADIUS),
                1,
                getLocation(-svgWidth + HALF_BASE_CONNECTOR_WIDTH, 2 * CURVE_RADIUS),
                getLocation(-svgWidth + HALF_BASE_CONNECTOR_WIDTH, svgHeight)
            );
        } else if (svgWidth > 0) {
            path = getPathForBottomBentConnector(
                getLocation(svgWidth + HALF_BASE_CONNECTOR_WIDTH, 0),
                getLocation(svgWidth + HALF_BASE_CONNECTOR_WIDTH, 0),
                1,
                getLocation(svgWidth + HALF_BASE_CONNECTOR_WIDTH - CURVE_RADIUS, CURVE_RADIUS),
                getLocation(HALF_BASE_CONNECTOR_WIDTH + CURVE_RADIUS, CURVE_RADIUS),
                0,
                getLocation(HALF_BASE_CONNECTOR_WIDTH, 2 * CURVE_RADIUS),
                getLocation(HALF_BASE_CONNECTOR_WIDTH, svgHeight)
            );
        }
        return {
            w: Math.abs(svgWidth) + BASE_CONNECTOR_WIDTH,
            h: svgHeight,
            style: getStyle({
                left: svgWidth < 0 ? svgWidth - HALF_BASE_CONNECTOR_WIDTH : -HALF_BASE_CONNECTOR_WIDTH,
                top: sourceY + offsetY - GRID_SIZE * 2
            }),
            path,
            pathClass: this.getConnectorPathClassName()
        };
    }

    getLeftLoopConnectorInfo() {
        const { sourceX, sourceY, svgHeight } = this.connectorInfo;
        let { svgWidth } = this.connectorInfo;

        svgWidth += HALF_BASE_CONNECTOR_WIDTH;

        const offsetX = HALF_BASE_CONNECTOR_WIDTH;
        const offsetY = HALF_BASE_CONNECTOR_WIDTH;

        const path = `M${svgWidth},${offsetY} ${offsetX},${offsetY}  ${offsetX},${svgHeight +
            offsetY +
            0}  ${offsetX},${svgHeight + 0 + offsetY},${svgWidth},${svgHeight + 0 + offsetY}`;

        const style = getStyle({
            left: sourceX - HALF_BASE_CONNECTOR_WIDTH,
            top: sourceY - HALF_BASE_CONNECTOR_WIDTH
        });
        return {
            svgWidth,
            svgHeight: svgHeight + BASE_CONNECTOR_WIDTH,
            style,
            path,
            pathClass: this.getConnectorPathClassName()
        };
    }

    getRightLoopConnectorInfo() {
        const { sourceX, sourceY, svgHeight } = this.connectorInfo;
        let { svgWidth } = this.connectorInfo;

        svgWidth += HALF_BASE_CONNECTOR_WIDTH;
        const offsetX = HALF_BASE_CONNECTOR_WIDTH;
        const offsetY = HALF_BASE_CONNECTOR_WIDTH;

        const path = `M0,${offsetY} ${svgWidth - offsetX},${offsetY} ${svgWidth - offsetX},${svgHeight +
            offsetY} 0,${svgHeight + offsetY}`;

        const style = getStyle({
            left: sourceX,
            top: sourceY - HALF_BASE_CONNECTOR_WIDTH
        });

        return {
            svgWidth,
            svgHeight: svgHeight + BASE_CONNECTOR_WIDTH,
            style,
            path,
            pathClass: this.getConnectorPathClassName()
        };
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
        const reorderConnectorsEvent = new ReorderConnectorsEvent(
            this.connectorInfo.parent,
            this.connectorInfo.selectedChildGuid,
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
