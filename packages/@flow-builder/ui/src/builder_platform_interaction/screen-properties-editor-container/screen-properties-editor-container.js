import { Element, api, track } from 'engine';
import { isScreen } from 'builder_platform_interaction-screen-editor-utils';
import { createScreenNodeSelectedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

/*
 * Right hand side component, used to toggle between screen and field property editors.
 */
export default class ScreenEditorPropertiesEditorContainer extends Element {
    @api node;
    @track toggleIconName = 'utility:expand_alt';
    labels = LABELS;

    get isScreen() {
        return isScreen(this.node);
    }

    handleToggleExpand = (/* event */) => {
        const container = this.template.querySelector('.properties-editor-panel');

        container.classList.toggle('slds-size_medium');
        const expanded = container.classList.toggle('slds-size_x-large');

        this.toggleIconName = expanded ? 'utility:contract_alt' :  'utility:expand_alt';
    }

    handleScreenSelection =  (/* event */) => {
        this.dispatchEvent(createScreenNodeSelectedEvent(this.node));
    }
}