import { Element, api } from 'engine';
import { NewResourceEvent } from 'builder_platform_interaction-events';

export default class LeftPanelResources extends Element {
    @api resources;

    handleAddNewResourceButtonClick = (event) => {
        event.stopPropagation();
        const handleOnClickEvent = new NewResourceEvent();
        this.dispatchEvent(handleOnClickEvent);
    };
}