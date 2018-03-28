import { Element, api } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';

export default class LeftPanelResources extends Element {
    @api resources;

    addNewResourceButtonClick = (event) => {
        event.stopPropagation();
        const handleOnClickEvent = new CustomEvent(EVENT.ADD_NEW_RESOURCE, {
            bubbles: true,
            composed: true,
            cancelable: true,
        });
        this.dispatchEvent(handleOnClickEvent);
    };
}