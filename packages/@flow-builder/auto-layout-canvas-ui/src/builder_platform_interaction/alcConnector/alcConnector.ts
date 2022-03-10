import {
    AutoLayoutCanvasMode,
    CanvasContext,
    getCssStyle,
    getStyleFromGeometry,
    isMenuOpened,
    scheduleTask
} from 'builder_platform_interaction/alcComponentsUtils';
import { OutgoingGoToStubClickEvent } from 'builder_platform_interaction/alcEvents';
import {
    ConnectorMenuInfo,
    getConnectorMenuInfo,
    newMenuRenderedEvent
} from 'builder_platform_interaction/alcMenuUtils';
import {
    ConnectorLabelType,
    ConnectorRenderInfo,
    FlowModel,
    getConnectionTarget,
    hasGoTo,
    MenuType,
    NodeType,
    resolveParent,
    START_IMMEDIATE_INDEX
} from 'builder_platform_interaction/autoLayoutCanvas';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { classSet } from 'lightning/utils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './alcConnectorLabels';

const selectors = {
    menuTrigger: 'builder_platform_interaction-alc-menu-trigger',
    menu: '.menu'
};

/**
 * Auto layout Canvas Connector Component.
 */
export default class AlcConnector extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    connectorInfo!: ConnectorRenderInfo;

    @api
    connectorAriaInfo;

    @api
    flowModel!: FlowModel;

    _canvasContext?: CanvasContext;

    @api
    set canvasContext(canvasContext: CanvasContext) {
        this._canvasContext = canvasContext;
        this.menu = this.isMenuOpened() ? getConnectorMenuInfo(this.canvasContext, this.flowModel) : null;
    }

    get canvasContext() {
        return this._canvasContext!;
    }

    _menu: ConnectorMenuInfo | null = null;

    get menu(): ConnectorMenuInfo | null {
        return this._menu;
    }

    set menu(menu: ConnectorMenuInfo | null) {
        this._menu = menu;

        if (menu != null) {
            scheduleTask(() => this.postMenuRenderTask());
        }
    }

    get labels() {
        return LABELS;
    }

    get disableAddElements() {
        return this.canvasContext.connectorMenuMetadata == null;
    }

    /**
     * Checks if add element button should be visible or not
     *
     * @returns - True if the add button need to be displayed
     */
    get showAddElementButton() {
        return (
            this.connectorInfo.addInfo &&
            this.canvasContext.mode === AutoLayoutCanvasMode.DEFAULT &&
            !this.disableAddElements
        );
    }

    /**
     * Checks if this connector's menu is open
     *
     * @returns true iff this connector's menu is open
     */
    isMenuOpened() {
        return isMenuOpened(this.canvasContext, MenuType.CONNECTOR, this.connectorInfo?.source);
    }

    /**
     * Gets css to position the menu trigger container
     *
     * @returns  the menu trigger container css
     */
    get menuTriggerContainerStyle() {
        return getStyleFromGeometry({ y: this.connectorInfo.addInfo!.offsetY });
    }

    /**
     * Gets the class for the menu trigger container
     *
     * @returns the menu trigger container classs
     */
    get menuTriggerContainerClass() {
        return this.isMenuOpened() ? 'slds-is-open' : '';
    }

    /**
     * Add the inverse variant to the button when the contextual menu is open
     *
     * @returns Icon variant
     */
    get addIconVariant() {
        return this.isMenuOpened() ? 'inverse' : '';
    }

    /**
     * The menu trigger variant for the connector
     *
     * @returns the menu trigger variant
     */
    get menuTriggerVariant() {
        return MenuType.CONNECTOR;
    }

    /**
     * Gets the info needed to render the connector svg
     *
     * @returns The SVG info
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

    get isGoToConnector() {
        return this.flowModel && hasGoTo(this.flowModel, this.connectorInfo.source);
    }

    /**
     * Gets the location for the goToTargetLabel using the end location of the goTo connector svg
     *
     * @returns The Goto CSS
     */
    get goToTargetLabelStyle() {
        const { svgInfo } = this.connectorInfo;
        return getCssStyle({
            'margin-left': svgInfo.endLocation.x + 5,
            top: svgInfo.endLocation.y - 10
        });
    }

    get goToTargetLabel() {
        return this.flowModel[getConnectionTarget(this.flowModel, this.connectorInfo.source)!].label;
    }

    // TODO: W-9025580 [Trust] Review how badge is displayed
    // based on if scheduled path is supported or not
    get hasConnectorBadge() {
        return this.connectorInfo.labelType !== ConnectorLabelType.NONE;
    }

    get connectorBadgeClass() {
        const labelType = this.connectorInfo.labelType;

        return classSet('connector-badge slds-align_absolute-center slds-badge').add({
            'fault-badge': labelType === ConnectorLabelType.FAULT,
            'connector-highlighted': this.connectorInfo.isHighlighted
        });
    }

    get goToTargetClass() {
        const target = getConnectionTarget(this.flowModel, this.connectorInfo.source);
        return classSet('go-to-info slds-is-relative').add({
            'highlighted-container': target === this.canvasContext.incomingStubGuid
        });
    }

    getBranchLabel(source) {
        const { guid, childIndex } = source;
        const { defaultConnectorLabel, nodeType, children, childReferences } = resolveParent(this.flowModel, guid);

        if (childIndex == null) {
            return defaultConnectorLabel;
        }

        const defaultIndex = nodeType === NodeType.START ? START_IMMEDIATE_INDEX : children.length - 1;

        if (childIndex === defaultIndex) {
            return defaultConnectorLabel;
        }

        const { childReference } =
            nodeType === NodeType.START ? childReferences[childIndex - 1] : childReferences[childIndex];

        return this.flowModel[childReference].label;
    }

    get connectorBadgeLabel() {
        const labelType: ConnectorLabelType = this.connectorInfo.labelType;

        switch (labelType) {
            case ConnectorLabelType.LOOP_AFTER_LAST:
                return LABELS.afterLastBadgeLabel;
            case ConnectorLabelType.FAULT:
                return LABELS.faultConnectorBadgeLabel;
            case ConnectorLabelType.LOOP_FOR_EACH:
                return LABELS.forEachBadgeLabel;
            case ConnectorLabelType.BRANCH:
                return this.getBranchLabel(this.connectorInfo.source);
            default:
                return '';
        }
    }

    /**
     * Gets the class for the svg
     *
     * @returns The SVG classSet for connector
     */
    get svgClassName() {
        return classSet(this.connectorInfo.isFault ? 'fault' : this.connectorInfo.type).add({
            'connector-to-be-deleted': this.connectorInfo.toBeDeleted,
            'connector-highlighted': this.connectorInfo.isHighlighted
        });
    }

    get connectorLabelStyle() {
        return getStyleFromGeometry({ y: this.connectorInfo.labelOffsetY, x: this.connectorInfo.labelOffsetX });
    }

    /**
     * Handles the click on the outgoing goTo stub and dispatches an event to handle the same
     *
     * @param event - click event fired when clicking on the outgoing goTo stub
     */
    handleOutgoingStubClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const outgoingStubClickEvent = new OutgoingGoToStubClickEvent(this.connectorInfo.source);
        this.dispatchEvent(outgoingStubClickEvent);
    };

    @api
    focus() {
        this.dom.menuTrigger.focus();
    }

    /**
     * Task to run after rendering the connector menu
     */
    postMenuRenderTask() {
        const menu = this.dom.menu;

        if (menu != null) {
            this.dispatchEvent(newMenuRenderedEvent(menu));
        }
    }
}
