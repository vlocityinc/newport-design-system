import { LightningElement, api } from 'lwc';
import { LABELS } from './welcomeMatBodyLabels';
import { EnterCommand } from 'builder_platform_interaction/commands';
import { KeyboardInteractions } from 'builder_platform_interaction/keyboardInteractionUtils';

const FREE_FORM_CANVAS = 'freeformCanvas';
const AUTO_LAYOUT_CANVAS = 'autolayoutCanvas';

export default class WelcomeMatBody extends LightningElement {
    @api processType;
    @api triggerType;
    @api createCallback;
    @api closeCallback;
    @api keyboardInteractions;

    _currentFocus;

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    get labels() {
        return LABELS;
    }

    createFreeFormCanvas = () => {
        this.createCallback(this.processType, this.triggerType, false);
        this.closeCallback();
    };

    createAutoLayoutCanvas = () => {
        this.createCallback(this.processType, this.triggerType, true);
        this.closeCallback();
    };

    handleFocusOnFreeForm() {
        this._currentFocus = FREE_FORM_CANVAS;
    }

    handleFocusOnAutoLayout() {
        this._currentFocus = AUTO_LAYOUT_CANVAS;
    }

    handleEnter() {
        if (this._currentFocus === FREE_FORM_CANVAS) {
            this.createFreeFormCanvas();
        } else if (this._currentFocus === AUTO_LAYOUT_CANVAS) {
            this.createAutoLayoutCanvas();
        }
    }

    setupCommandsAndShortcuts() {
        const enterCommand = new EnterCommand(() => this.handleEnter());
        this.keyboardInteractions.setupCommandAndShortcut(enterCommand, { key: 'Enter' });
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
