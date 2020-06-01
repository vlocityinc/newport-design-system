import { Guid, ElementsMetadata } from 'builder_platform_interaction/autoLayoutCanvas';

import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ToggleMenuEvent, PasteEvent, MergeWithExistingPathEvent } from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { configureMenu, PASTE_ACTION, MERGE_PATH_ACTION } from './flcConnectorMenuConfig';
import { LABELS } from './flcConnectorMenuLabels';

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class FlcConnectorMenu extends Menu {
    @api
    childIndex: number | undefined;

    @api
    elementsMetadata: ElementsMetadata | undefined;

    /* true if this branch can be merged, false otherwise*/
    @api
    canMergeEndedBranch: boolean | undefined;

    @api
    next: Guid | undefined;

    @api
    parent: Guid | undefined;

    @api
    prev: Guid | undefined;

    @api
    isPasteAvailable: boolean | undefined;

    get menuConfiguration() {
        const showEndElement = this.next == null;
        return configureMenu(this.elementsMetadata, showEndElement, this.isPasteAvailable, this.canMergeEndedBranch);
    }

    get labels(): Labels {
        return LABELS;
    }

    handleSelectMenuItem(event) {
        this.dispatchEvent(new ToggleMenuEvent({}));
        const action = event.currentTarget.getAttribute('data-value');

        switch (action) {
            case PASTE_ACTION:
                this.dispatchEvent(new PasteEvent(this.prev!, this.next!, this.parent!, this.childIndex!));
                break;
            case MERGE_PATH_ACTION:
                this.dispatchEvent(new MergeWithExistingPathEvent(this.next!));
                break;
            default:
                this.dispatchEvent(
                    // @ts-ignore
                    new AddElementEvent(
                        event.currentTarget.getAttribute('data-value'),
                        0,
                        0,
                        null,
                        null,
                        this.prev,
                        this.next,
                        this.parent,
                        this.childIndex
                    )
                );
        }
    }
}
