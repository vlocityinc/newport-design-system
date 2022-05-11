import { DeleteGoToConnectionEvent, GoToPathEvent, PasteOnCanvasEvent } from 'builder_platform_interaction/alcEvents';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import { ConnectionSource, ElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { api } from 'lwc';
import {
    configureMenu,
    GOTO_ACTION,
    GOTO_DELETE_ACTION,
    GOTO_REROUTE_ACTION,
    PASTE_ACTION
} from './alcConnectorMenuConfig';
import { LABELS } from './alcConnectorMenuLabels';

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class AlcConnectorMenu extends AlcMenu {
    static className = 'connector-menu';

    @api
    metadata!: ConnectorMenuMetadata;

    @api
    source!: ConnectionSource;

    @api
    elementsMetadata: ElementMetadata[] = [];

    @api
    numPasteElementsAvailable!: number;

    /* whether the end element should be shown in the menu */
    @api
    canAddEndElement!: boolean;

    @api
    canAddGoto!: boolean;

    @api
    isGoToConnector!: boolean;

    get menuConfiguration() {
        return configureMenu(
            this.metadata,
            this.elementsMetadata,
            this.canAddEndElement,
            this.numPasteElementsAvailable,
            this.canAddGoto,
            this.isGoToConnector
        );
    }

    get labels() {
        return LABELS;
    }

    /**
     * Menu item action behaviour dependent on the attributes of the selected element
     *
     * @param currentTarget the HTML element selected in the menu
     */
    override doSelectMenuItem(currentTarget: HTMLElement) {
        super.doSelectMenuItem(currentTarget);

        const { value, subType, actionType, actionName, actionIsStandard } = currentTarget.dataset;

        const source = this.source;

        switch (value) {
            case PASTE_ACTION:
                this.dispatchEvent(new PasteOnCanvasEvent(this.source));
                break;
            case GOTO_ACTION:
                this.dispatchEvent(new GoToPathEvent(source));
                break;
            case GOTO_DELETE_ACTION:
                this.dispatchEvent(new DeleteGoToConnectionEvent(source));
                break;
            case GOTO_REROUTE_ACTION:
                this.dispatchEvent(new GoToPathEvent(source, true));
                break;
            default: {
                const alcConnectionSource = source;

                this.dispatchEvent(
                    new AddElementEvent({
                        elementType: value!,
                        elementSubtype: subType!,
                        actionType: actionType!,
                        actionName: actionName!,
                        actionIsStandard: actionIsStandard === 'true',
                        locationX: 0,
                        locationY: 0,
                        alcConnectionSource,
                        designateFocus: true
                    })
                );
            }
        }
    }
}
