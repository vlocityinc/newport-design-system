// @ts-nocheck
/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import { createElement } from 'lwc';
import ScreenPropertiesEditor from '../screenPropertiesEditor';
import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { createTestScreen } from '../../builderTestUtils/screenEditorTestUtils';
import { createScreenWithFields } from 'builder_platform_interaction/elementFactory';
import { FOOTER_LABEL_TYPE, PAUSE_MESSAGE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    SHOW_HEADER: 'builder_platform_interaction-screen-property-field[name="showHeader"]',
    SHOW_FOOTER: 'builder_platform_interaction-screen-property-field[name="showFooter"]',
    ALLOW_HELP: 'builder_platform_interaction-screen-property-field[name="allowHelp"]',
    PAUSED_TEXT: 'builder_platform_interaction-screen-property-field[name="pausedText"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
    NEXT_OR_FINISH_LABEL_TYPE: 'lightning-radio-group[name="nextOrFinishLabelType"]',
    PAUSE_LABEL_TYPE: 'lightning-radio-group[name="pauseLabelType"]',
    PREVIOUS_LABEL_TYPE: 'lightning-radio-group[name="backLabelType"]',
    PAUSE_MESSAGE_TYPE: 'lightning-radio-group[name="pauseMessageType"]',
    NEXT_LABEL: 'builder_platform_interaction-screen-property-field[name="nextOrFinishLabel"]',
    BACK_LABEL: 'builder_platform_interaction-screen-property-field[name="backLabel"]',
    PAUSE_LABEL: 'builder_platform_interaction-screen-property-field[name="pauseLabel"]'
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-properties-editor', {
        is: ScreenPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

describe('screen-properties-editor for new screen', () => {
    let screenPropEditor;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            // Use elementFactory to create the new/blank screen.
            screen: createScreenWithFields()
        });
    });
    it('API Name should be empty by default', () => {
        const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe('');
    });
    it('Label should be empty by default', () => {
        const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.label.value).toBe('');
    });
    it('Description should be empty by default', () => {
        const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.description.value).toBe('');
    });

    it('Show header is a checkbox and selected by default', () => {
        const header = query(screenPropEditor, SELECTORS.SHOW_HEADER);
        expect(header).not.toBeNull();
        expect(header.type).toBe('boolean');
        expect(header.value).toBeTruthy();
    });
    it('Show footer is a checkbox and selected by default', () => {
        const footer = query(screenPropEditor, SELECTORS.SHOW_FOOTER);
        expect(footer).not.toBeNull();
        expect(footer.type).toBe('boolean');
        expect(footer.value).toBeTruthy();
    });
    it('Provide Help is a checkbox and is unselected by default', () => {
        const provideHelp = query(screenPropEditor, SELECTORS.ALLOW_HELP);
        expect(provideHelp).not.toBeNull();
        expect(provideHelp.type).toBe('boolean');
        expect(provideHelp.value).toBe(false);
    });
    it('Help text is hide by default', () => {
        const helpText = query(screenPropEditor, SELECTORS.HELP_TEXT);
        expect(helpText).toBeNull();
    });
    it('Next or Finish is a radio group and is set to standard by default', () => {
        const nextOrFinishRadioGroup = query(screenPropEditor, SELECTORS.NEXT_OR_FINISH_LABEL_TYPE);
        expect(nextOrFinishRadioGroup.value).toEqual(FOOTER_LABEL_TYPE.STANDARD);
    });
    it('Previous is a radio group and is set to standard by default', () => {
        const previousRadioGroup = query(screenPropEditor, SELECTORS.PREVIOUS_LABEL_TYPE);
        expect(previousRadioGroup.value).toEqual(FOOTER_LABEL_TYPE.STANDARD);
    });
    it('Pause is a radio group and is set to standard by default', () => {
        const pauseRadioGroup = query(screenPropEditor, SELECTORS.PAUSE_LABEL_TYPE);
        expect(pauseRadioGroup.value).toEqual(FOOTER_LABEL_TYPE.STANDARD);
    });

    it('Pause Confirmation Type is a radio group and is set to Standard by default', () => {
        const pauseConfirmationRadioGroup = query(screenPropEditor, SELECTORS.PAUSE_MESSAGE_TYPE);
        expect(pauseConfirmationRadioGroup.value).toEqual(PAUSE_MESSAGE_TYPE.STANDARD);
    });

    it('Pause Confirmation Message is hide by default', () => {
        const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
        expect(pausedText).toBeNull();
    });
});

describe('screen-properties-editor for existing screen', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.showFooter = true;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('API Name is populated', () => {
        const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe('screen1');
    });
    it('Show header has expected value', () => {
        const header = query(screenPropEditor, SELECTORS.SHOW_HEADER);
        expect(header).not.toBeNull();
        expect(header.value).toBe(testScreen.showHeader);
    });
    it('Show footer has expected value', () => {
        const footer = query(screenPropEditor, SELECTORS.SHOW_FOOTER);
        expect(footer).not.toBeNull();
        expect(footer.value).toBe(testScreen.showFooter);
    });
});

describe('screen-properties-editor for screen with custom footer buttons', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.nextOrFinishLabelType = FOOTER_LABEL_TYPE.CUSTOM;
    testScreen.backLabelType = FOOTER_LABEL_TYPE.CUSTOM;
    testScreen.pauseLabelType = FOOTER_LABEL_TYPE.CUSTOM;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('Custom Label input for next or finish button is present', () => {
        const customNextOrFinishLabel = query(screenPropEditor, SELECTORS.NEXT_LABEL);
        expect(customNextOrFinishLabel).not.toBeNull();
        expect(customNextOrFinishLabel.type).toBe('string');
    });

    it('Custom Label input for previous button is present', () => {
        const customPreviousLabel = query(screenPropEditor, SELECTORS.BACK_LABEL);
        expect(customPreviousLabel).not.toBeNull();
        expect(customPreviousLabel.type).toBe('string');
    });

    it('Custom Label input for pause button is present', () => {
        const customPauseLabel = query(screenPropEditor, SELECTORS.PAUSE_LABEL);
        expect(customPauseLabel).not.toBeNull();
        expect(customPauseLabel.type).toBe('string');
    });
});

describe('screen-properties-editor for screen with no pause message', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.pauseLabelType = FOOTER_LABEL_TYPE.HIDE;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });

    it('Pause confirmation message radio group is not present', () => {
        const pauseMessageType = query(screenPropEditor, SELECTORS.PAUSE_MESSAGE_TYPE);
        expect(pauseMessageType).toBeNull();
    });
});

describe('screen-properties-editor for screen with standard pause message', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.pauseLabelType = FOOTER_LABEL_TYPE.STANDARD;
    testScreen.pauseMessageType = PAUSE_MESSAGE_TYPE.STANDARD;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('Pause confirmation message radio group is present', () => {
        const pauseMessageType = query(screenPropEditor, SELECTORS.PAUSE_MESSAGE_TYPE);
        expect(pauseMessageType).not.toBeNull();
    });

    it('Pause text Editor is not present', () => {
        const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
        expect(pausedText).toBeNull();
    });
});

describe('screen-properties-editor for screen with hidden header and footer', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.showFooter = false;
    testScreen.showHeader = false;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('Provide help checkbox is present', () => {
        const allowHelp = query(screenPropEditor, SELECTORS.ALLOW_HELP);
        expect(allowHelp).not.toBeNull();
    });

    it('Custom footer controls are present', () => {
        const nextOrFinishLabelType = query(screenPropEditor, SELECTORS.NEXT_OR_FINISH_LABEL_TYPE);
        expect(nextOrFinishLabelType).not.toBeNull();

        const pauseLabelType = query(screenPropEditor, SELECTORS.PAUSE_LABEL_TYPE);
        expect(pauseLabelType).not.toBeNull();

        const backLabelType = query(screenPropEditor, SELECTORS.PREVIOUS_LABEL_TYPE);
        expect(backLabelType).not.toBeNull();

        const pauseMessageType = query(screenPropEditor, SELECTORS.PAUSE_MESSAGE_TYPE);
        expect(pauseMessageType).not.toBeNull();
    });
});

describe('screen-properties-editor for screen with custom pause message', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.pauseLabelType = FOOTER_LABEL_TYPE.STANDARD;
    testScreen.pauseMessageType = PAUSE_MESSAGE_TYPE.CUSTOM;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('Pause text Editor is present and has expected value', async () => {
        const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
        expect(pausedText).not.toBeNull();
        expect(pausedText.type).toBe('rich_string');
        expect(pausedText.value.value).toBe(testScreen.pausedText.value);
    });
});

describe('screen-properties-editor for screen with help text', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.allowHelp = true;

    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('help Text component is present and has expected value', () => {
        const helpText = query(screenPropEditor, SELECTORS.HELP_TEXT);
        expect(helpText).not.toBeNull();
        expect(helpText.type).toBe('rich_string');
        expect(helpText.value.value).toBe(testScreen.helpText.value);
    });
});

describe('Dispatching property changed event on footer config changes', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';

    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('next or finish radio buttons are dispatching event with correct properites', () => {
        const nextOrFinishRadioGroup = query(screenPropEditor, SELECTORS.NEXT_OR_FINISH_LABEL_TYPE);
        const radioButtonsSelectedCallBack = jest.fn();
        screenPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, radioButtonsSelectedCallBack);
        const event = new CustomEvent('change', {
            detail: {
                value: FOOTER_LABEL_TYPE.CUSTOM
            }
        });
        nextOrFinishRadioGroup.dispatchEvent(event);
        expect(radioButtonsSelectedCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    oldValue: expect.objectContaining({ value: FOOTER_LABEL_TYPE.STANDARD }),
                    propertyName: 'nextOrFinishLabelType',
                    value: expect.objectContaining({
                        value: FOOTER_LABEL_TYPE.CUSTOM
                    })
                })
            })
        );
    });

    it('previous radio buttons are dispatching event with correct properites', () => {
        const previousRadioGroup = query(screenPropEditor, SELECTORS.PREVIOUS_LABEL_TYPE);
        const radioButtonsSelectedCallBack = jest.fn();
        screenPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, radioButtonsSelectedCallBack);
        const event = new CustomEvent('change', {
            detail: {
                value: FOOTER_LABEL_TYPE.CUSTOM
            }
        });
        previousRadioGroup.dispatchEvent(event);
        expect(radioButtonsSelectedCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    oldValue: expect.objectContaining({ value: FOOTER_LABEL_TYPE.STANDARD }),
                    propertyName: 'backLabelType',
                    value: expect.objectContaining({
                        value: FOOTER_LABEL_TYPE.CUSTOM
                    })
                })
            })
        );
    });

    it('pause radio buttons are dispatching event with correct properites', () => {
        const pauseRadioGroup = query(screenPropEditor, SELECTORS.PAUSE_LABEL_TYPE);
        const radioButtonsSelectedCallBack = jest.fn();
        screenPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, radioButtonsSelectedCallBack);
        const event = new CustomEvent('change', {
            detail: {
                value: FOOTER_LABEL_TYPE.CUSTOM
            }
        });
        pauseRadioGroup.dispatchEvent(event);
        expect(radioButtonsSelectedCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    oldValue: expect.objectContaining({ value: FOOTER_LABEL_TYPE.STANDARD }),
                    propertyName: 'pauseLabelType',
                    value: expect.objectContaining({
                        value: FOOTER_LABEL_TYPE.CUSTOM
                    })
                })
            })
        );
    });

    it('pause confirmation message radio buttons are dispatching event with correct properites', () => {
        const pauseMessageTypeRadioGroup = query(screenPropEditor, SELECTORS.PAUSE_MESSAGE_TYPE);
        const radioButtonsSelectedCallBack = jest.fn();
        screenPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, radioButtonsSelectedCallBack);
        const event = new CustomEvent('change', {
            detail: {
                value: PAUSE_MESSAGE_TYPE.CUSTOM
            }
        });
        pauseMessageTypeRadioGroup.dispatchEvent(event);
        expect(radioButtonsSelectedCallBack).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    oldValue: expect.objectContaining({ value: PAUSE_MESSAGE_TYPE.STANDARD }),
                    propertyName: 'pauseMessageType',
                    value: expect.objectContaining({
                        value: PAUSE_MESSAGE_TYPE.CUSTOM
                    })
                })
            })
        );
    });
});
