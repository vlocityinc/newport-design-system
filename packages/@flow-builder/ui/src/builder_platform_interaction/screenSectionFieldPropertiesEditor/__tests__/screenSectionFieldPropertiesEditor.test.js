import { createElement } from 'lwc';
import ScreenSectionFieldPropertiesEditor from '../screenSectionFieldPropertiesEditor';
import { query } from 'builder_platform_interaction/builderTestUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction/events';

const SELECTORS = {
    ADD_BUTTON: 'lightning-button'
};

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-section-field-properties-editor', {
        is: ScreenSectionFieldPropertiesEditor
    });

    Object.assign(el, props);

    document.body.appendChild(el);
    return el;
};

describe('screen-section-field-properties-editor', () => {
    describe('add button', () => {
        it('is active if no columns present', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: []
                }
            });

            return Promise.resolve().then(() => {
                const addButton = query(screenSectionFieldPropEditor, SELECTORS.ADD_BUTTON);
                expect(addButton.disabled).toBeFalsy();
            });
        });
        it('is active if three columns present', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [{}, {}, {}]
                }
            });

            return Promise.resolve().then(() => {
                const addButton = query(screenSectionFieldPropEditor, SELECTORS.ADD_BUTTON);
                expect(addButton.disabled).toBeFalsy();
            });
        });
        it('is disabled if four columns present', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [{}, {}, {}, {}]
                }
            });

            return Promise.resolve().then(() => {
                const addButton = query(screenSectionFieldPropEditor, SELECTORS.ADD_BUTTON);
                expect(addButton.disabled).toBeTruthy();
            });
        });
        it('dispatches an AddScreenField', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: []
                }
            });

            screenSectionFieldPropEditor.dispatchEvent = jest.fn();

            return Promise.resolve().then(() => {
                const callback = jest.fn();
                screenSectionFieldPropEditor.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED, callback);

                const addButton = query(screenSectionFieldPropEditor, SELECTORS.ADD_BUTTON);
                addButton.click();

                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        typeName: getColumnFieldType().name,
                        position: 0,
                        parent: screenSectionFieldPropEditor.field
                    })
                );
            });
        });
    });
});
