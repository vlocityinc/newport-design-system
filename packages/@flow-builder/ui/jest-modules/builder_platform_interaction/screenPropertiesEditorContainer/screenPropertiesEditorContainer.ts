import { shortcuts } from 'builder_platform_interaction/app';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
const { ShiftF6 } = commands;

const { BaseKeyboardInteraction, withKeyboardInteractions, createShortcut } = keyboardInteractionUtils;
export default class ScreenPropertiesEditorContainer extends withKeyboardInteractions(LightningElement) {
    @api
    focus;

    @api
    focusExpandButton;

    @api
    focusLabelDescription = jest.fn();

    @api node;

    @api processType;

    @api
    extensionTypes;

    @api
    mode;

    @api
    validate;

    handleShiftFocusBackward() {
        // TODO: why is this empty?
    }

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(shortcuts.shiftFocusBackward, new ShiftF6(() => this.handleShiftFocusBackward()))
            ])
        ];
    }
}
