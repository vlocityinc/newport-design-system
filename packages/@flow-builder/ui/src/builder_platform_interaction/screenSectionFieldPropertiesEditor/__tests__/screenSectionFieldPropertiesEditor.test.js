import { createElement } from 'lwc';
import ScreenSectionFieldPropertiesEditor from '../screenSectionFieldPropertiesEditor';
import { query } from 'builder_platform_interaction/builderTestUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    PropertyChangedEvent,
    SCREEN_EDITOR_EVENT_NAME
} from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

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

        it('dispatches PropertyChangedEvent with resized columns', async () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [{ guid: '1', inputParameters: [{ value: 12 }] }]
                }
            });

            const addListener = jest.fn();
            screenSectionFieldPropEditor.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED, addListener);

            const propertyChangedListener = jest.fn();
            screenSectionFieldPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, propertyChangedListener);

            const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
            await list.dispatchEvent(new AddListItemEvent(0));

            const callback = addListener.mock.calls[0][0].callback;

            screenSectionFieldPropEditor.field = Object.assign({}, screenSectionFieldPropEditor.field, {
                fields: [
                    { guid: '1', inputParameters: [{ value: 12 }] },
                    { guid: '2', inputParameters: [{ value: 12 }] }
                ]
            });

            // Manually trigger the callback
            callback();

            await ticks(1);

            expect(propertyChangedListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: expect.objectContaining({
                        propertyName: 'fields',
                        value: [
                            { guid: '1', inputParameters: [{ name: 'width', value: 6 }] },
                            { guid: '2', inputParameters: [{ name: 'width', value: 6 }] }
                        ],
                        error: null
                    })
                })
            );
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

        it('callback dispatches PropertyChangedEvent with resized columns', async () => {
            const deleteListener = jest.fn();

            const propertyChangedListener = jest.fn();

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
                deleteListener
            );

            screenSectionFieldPropEditor.addEventListener(PropertyChangedEvent.EVENT_NAME, propertyChangedListener);

            const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
            list.dispatchEvent(new DeleteListItemEvent(0));

            screenSectionFieldPropEditor.field = Object.assign({}, screenSectionFieldPropEditor.field, {
                fields: [{ guid: '1', inputParameters: [{ value: 6 }] }]
            });

            const deleteCallbackParam = deleteListener.mock.calls[0][0];
            deleteCallbackParam.detail.callback();

            await ticks(1);

            const propertyChangedParam = propertyChangedListener.mock.calls[0][0];
            expect(propertyChangedParam.detail).toMatchObject({
                propertyName: 'fields',
                value: [{ guid: '1', inputParameters: [{ name: 'width', value: 12 }] }],
                error: null
            });
        });
    });
});
