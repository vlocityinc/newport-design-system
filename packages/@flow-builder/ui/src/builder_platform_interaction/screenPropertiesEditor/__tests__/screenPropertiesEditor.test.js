/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import { createElement } from 'lwc';
import ScreenPropertiesEditor from '../screenPropertiesEditor';
import { query } from 'builder_platform_interaction/builderTestUtils';
import { createTestScreen } from '../../builderTestUtils/screenEditorTestUtils';
import { createScreenWithFields } from 'builder_platform_interaction/elementFactory';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    SHOW_HEADER:
        'builder_platform_interaction-screen-property-field[name="showHeader"]',
    SHOW_FOOTER:
        'builder_platform_interaction-screen-property-field[name="showFooter"]',
    ALLOW_PAUSE:
        'builder_platform_interaction-screen-property-field[name="allowPause"]',
    ALLOW_BACK:
        'builder_platform_interaction-screen-property-field[name="allowBack"]',
    ALLOW_NEXT:
        'builder_platform_interaction-screen-property-field[name="allowFinish"]',
    PAUSED_TEXT:
        'builder_platform_interaction-screen-property-field[name="pausedText"]',
    HELP_TEXT:
        'builder_platform_interaction-screen-property-field[name="helpText"]'
};

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-screen-properties-editor',
        {
            is: ScreenPropertiesEditor
        }
    );
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
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
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(
                SELECTORS.NAME_AND_LABEL_FIELD
            );
            expect(nameAndLabelField.devName.value).toBe('');
        });
    });
    it('Label should be empty by default', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(
                SELECTORS.NAME_AND_LABEL_FIELD
            );
            expect(nameAndLabelField.label.value).toBe('');
        });
    });
    it('Description should be empty by default', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(
                SELECTORS.NAME_AND_LABEL_FIELD
            );
            expect(nameAndLabelField.description.value).toBe('');
        });
    });
    it('Show header is a checkbox and selected by default', () => {
        return Promise.resolve().then(() => {
            const header = query(screenPropEditor, SELECTORS.SHOW_HEADER);
            expect(header).not.toBeNull();
            expect(header.type).toBe('boolean');
            expect(header.value).toBeTruthy();
        });
    });
    it('Show footer is a checkbox and selected by default', () => {
        return Promise.resolve().then(() => {
            const footer = query(screenPropEditor, SELECTORS.SHOW_FOOTER);
            expect(footer).not.toBeNull();
            expect(footer.type).toBe('boolean');
            expect(footer.value).toBeTruthy();
        });
    });
    it('Allow pause is a checkbox and selected by default', () => {
        return Promise.resolve().then(() => {
            const allowPause = query(screenPropEditor, SELECTORS.ALLOW_PAUSE);
            expect(allowPause).not.toBeNull();
            expect(allowPause.type).toBe('boolean');
            expect(allowPause.value).toBeTruthy();
        });
    });
    it('Allow pause has helpText', () => {
        return Promise.resolve().then(() => {
            const allowPause = query(screenPropEditor, SELECTORS.ALLOW_PAUSE);
            expect(allowPause).not.toBeNull();
            expect(allowPause.helpText).not.toBeNull();
        });
    });
    it('Allow back is a checkbox and selected by default', () => {
        return Promise.resolve().then(() => {
            const allowBack = query(screenPropEditor, SELECTORS.ALLOW_BACK);
            expect(allowBack).not.toBeNull();
            expect(allowBack.type).toBe('boolean');
            expect(allowBack.value).toBeTruthy();
        });
    });
    it('Allow next is a checkbox and selected by default', () => {
        return Promise.resolve().then(() => {
            const allowNext = query(screenPropEditor, SELECTORS.ALLOW_NEXT);
            expect(allowNext).not.toBeNull();
            expect(allowNext.type).toBe('boolean');
            expect(allowNext.value).toBeTruthy();
        });
    });
    it('Pause text is a rich text editor and empty by default', () => {
        return Promise.resolve().then(() => {
            const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
            expect(pausedText).not.toBeNull();
            expect(pausedText.type).toBe('rich_string');
            expect(pausedText.value).toBe('');
        });
    });
    it('Paused text component has helpText', () => {
        return Promise.resolve().then(() => {
            const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
            expect(pausedText).not.toBeNull();
            expect(pausedText.helpText).not.toBeNull();
        });
    });
    it('Help text is a rich text editor and empty by default', () => {
        return Promise.resolve().then(() => {
            const helpText = query(screenPropEditor, SELECTORS.HELP_TEXT);
            expect(helpText).not.toBeNull();
            expect(helpText.type).toBe('rich_string');
            expect(helpText.value).toBe('');
        });
    });
});

describe('screen-properties-editor for existing screen', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.allowBack = false;
    testScreen.allowFinish = false;
    testScreen.showFooter = false;
    testScreen.showHeader = false;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('API Name is populated', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenPropEditor.shadowRoot.querySelector(
                SELECTORS.NAME_AND_LABEL_FIELD
            );
            expect(nameAndLabelField.devName.value).toBe('screen1');
        });
    });
    it('Allow back has expected value', () => {
        return Promise.resolve().then(() => {
            const allowBack = query(screenPropEditor, SELECTORS.ALLOW_BACK);
            expect(allowBack).not.toBeNull();
            expect(allowBack.value).toBe(testScreen.allowBack);
        });
    });
    it('Allow next has expected value', () => {
        return Promise.resolve().then(() => {
            const allowNext = query(screenPropEditor, SELECTORS.ALLOW_NEXT);
            expect(allowNext).not.toBeNull();
            expect(allowNext.value).toBe(testScreen.allowFinish);
        });
    });
    it('Show header has expected value', () => {
        return Promise.resolve().then(() => {
            const header = query(screenPropEditor, SELECTORS.SHOW_HEADER);
            expect(header).not.toBeNull();
            expect(header.value).toBe(testScreen.showHeader);
        });
    });
    it('Show footer has expected value', () => {
        return Promise.resolve().then(() => {
            const footer = query(screenPropEditor, SELECTORS.SHOW_FOOTER);
            expect(footer).not.toBeNull();
            expect(footer.value).toBe(testScreen.showFooter);
        });
    });
    it('Paused text has expected value', () => {
        return Promise.resolve().then(() => {
            const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
            expect(pausedText).not.toBeNull();
            expect(pausedText.value.value).toBe(testScreen.pausedText.value);
        });
    });
    it('Help text has expected value', () => {
        return Promise.resolve().then(() => {
            const helpText = query(screenPropEditor, SELECTORS.HELP_TEXT);
            expect(helpText).not.toBeNull();
            expect(helpText.type).toBe('rich_string');
            expect(helpText.value.value).toBe(testScreen.helpText.value);
        });
    });
});

describe('Paused Text component is not present if pause is not allowed', () => {
    let screenPropEditor;
    const testScreen = createTestScreen('screen1');
    testScreen.description.value = 'this is a test screen';
    testScreen.allowPause = false;
    beforeEach(() => {
        screenPropEditor = createComponentUnderTest({
            screen: testScreen
        });
    });
    it('Paused text has expected value', () => {
        return Promise.resolve().then(() => {
            const pausedText = query(screenPropEditor, SELECTORS.PAUSED_TEXT);
            expect(pausedText).toBeNull();
        });
    });
});
