// @ts-nocheck
import { createElement } from 'lwc';
import ScreenSectionFieldPropertiesEditor from '../screenSectionFieldPropertiesEditor';
import { query } from 'builder_platform_interaction/builderTestUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { AddListItemEvent, DeleteListItemEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction/events';

const SELECTORS = {
    LIST: 'builder_platform_interaction-list',
    LIST_BODY: 'div[slot="listBody"]',
    ROW: 'builder_platform_interaction-row'
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
    describe('add column', () => {
        it('dispatches an AddScreenField', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: []
                }
            });

            return Promise.resolve().then(() => {
                const addCallback = jest.fn();
                screenSectionFieldPropEditor.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED, addCallback);

                const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
                list.dispatchEvent(new AddListItemEvent(0));

                expect(addCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        typeName: getColumnFieldType().name,
                        position: 0,
                        parent: screenSectionFieldPropEditor.field
                    })
                );
            });
        });
    });

    describe('delete column', () => {
        it('button is disabled if there is only one column', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [{ guid: '1', inputParameters: [{ value: 12 }] }]
                }
            });

            return Promise.resolve().then(() => {
                const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
                const row = listBody.querySelector(SELECTORS.ROW);
                expect(row.showDelete).toBeFalsy();
            });
        });
        it('button is enabled if there is more than one column', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 6 }] },
                        { guid: '2', inputParameters: [{ value: 6 }] }
                    ]
                }
            });

            return Promise.resolve().then(() => {
                const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
                const row = listBody.querySelector(SELECTORS.ROW);
                expect(row.showDelete).toBeTruthy();
            });
        });
        it('fires ScreenElementDeletedEvent', () => {
            const deleteCallback = jest.fn();

            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 6 }] },
                        { guid: '2', inputParameters: [{ value: 6 }] }
                    ]
                }
            });

            screenSectionFieldPropEditor.addEventListener(
                SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED,
                deleteCallback
            );

            const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
            list.dispatchEvent(new DeleteListItemEvent(0));

            const deleteCallbackParam = deleteCallback.mock.calls[0][0];
            expect(deleteCallbackParam.detail).toMatchObject({
                screenElement: screenSectionFieldPropEditor.field.fields[0],
                callback: expect.any(Function)
            });
        });
        it('callback reselects section', () => {
            const deleteCallback = jest.fn();
            const selectedCallback = jest.fn();

            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 6 }] },
                        { guid: '2', inputParameters: [{ value: 6 }] }
                    ]
                }
            });

            screenSectionFieldPropEditor.addEventListener(
                SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED,
                deleteCallback
            );
            screenSectionFieldPropEditor.addEventListener(
                SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED,
                selectedCallback
            );

            const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
            list.dispatchEvent(new DeleteListItemEvent(0));

            const deleteCallbackParam = deleteCallback.mock.calls[0][0];

            deleteCallbackParam.detail.callback();

            const selectCallbackParam = selectedCallback.mock.calls[0][0];
            expect(selectCallbackParam.detail).toMatchObject({
                screenElement: screenSectionFieldPropEditor.field
            });
        });
    });
});
