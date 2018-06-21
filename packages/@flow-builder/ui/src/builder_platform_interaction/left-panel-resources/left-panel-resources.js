import { Element, api } from 'engine';
import { NewResourceEvent } from 'builder_platform_interaction-events';

import newResourceButtonText from '@label/FlowBuilderLeftPanel.newResourceButtonText';

const LABELS = {
    LEFT_PANEL_RESOURCE_TAB_NEUTRAL_BUTTON: newResourceButtonText,
};

export default class LeftPanelResources extends Element {
    @api resources;

    get labels() {
        return LABELS;
    }

    handleAddNewResourceButtonClick = (event) => {
        event.stopPropagation();
        const handleOnClickEvent = new NewResourceEvent();
        this.dispatchEvent(handleOnClickEvent);
    };
}