// @ts-nocheck
import { createElement } from 'lwc';
import ScreenSectionFieldPropertiesEditor from '../screenSectionFieldPropertiesEditor';
import { query, changeEvent } from 'builder_platform_interaction/builderTestUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { AddListItemEvent, DeleteListItemEvent, ScreenEditorEventName } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

const SELECTORS = {
    LIST: 'builder_platform_interaction-list',
    LIST_BODY: 'div[slot="listBody"]',
    ROW: 'builder_platform_interaction-row',
    ROW_BODY: 'div[slot="rowBody"]',
    COMBOBOX: 'lightning-combobox'
};

const createComponentUnderTest = (props) => {
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
                    guid: 'guid',
                    fields: []
                }
            });

            return Promise.resolve().then(() => {
                const addCallback = jest.fn();
                screenSectionFieldPropEditor.addEventListener(ScreenEditorEventName.ScreenFieldAdded, addCallback);

                const list = query(screenSectionFieldPropEditor, SELECTORS.LIST);
                list.dispatchEvent(new AddListItemEvent(0));

                expect(addCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        typeName: getColumnFieldType().name,
                        position: 0,
                        parentGuid: screenSectionFieldPropEditor.field.guid
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

            screenSectionFieldPropEditor.addEventListener(ScreenEditorEventName.ScreenElementDeleted, deleteCallback);

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

            screenSectionFieldPropEditor.addEventListener(ScreenEditorEventName.ScreenElementDeleted, deleteCallback);
            screenSectionFieldPropEditor.addEventListener(
                ScreenEditorEventName.ScreenElementSelected,
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

    describe('changing the width of a column', () => {
        it('fires ColumnWidthChanged event', () => {
            const columnWidthChangedCallback = jest.fn();

            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 6 }] },
                        { guid: '2', inputParameters: [{ value: 6 }] }
                    ]
                }
            });

            screenSectionFieldPropEditor.addEventListener(
                ScreenEditorEventName.ColumnWidthChanged,
                columnWidthChangedCallback
            );

            const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
            const rowBody = listBody.querySelector(SELECTORS.ROW_BODY);
            const combobox = rowBody.querySelector(SELECTORS.COMBOBOX);
            combobox.dispatchEvent(changeEvent(7));

            const columnWidthChangedCallbackParam = columnWidthChangedCallback.mock.calls[0][0];
            expect(columnWidthChangedCallbackParam.detail).toMatchObject({
                columnGuid: '1',
                columnWidth: 7
            });
        });
    });

    describe('column width options', () => {
        it('are correct when there is only one column', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [{ guid: '1', inputParameters: [{ value: undefined }] }]
                }
            });

            const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
            const rowBody = listBody.querySelector(SELECTORS.ROW_BODY);
            const combobox = rowBody.querySelector(SELECTORS.COMBOBOX);

            expect(combobox.options).toHaveLength(1);
            expect(combobox.options[0].value).toEqual('12');
        });
        it('are correct when there are two columns', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 5 }] },
                        { guid: '2', inputParameters: [{ value: 7 }] }
                    ]
                }
            });

            const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
            const rowBodys = listBody.querySelectorAll(SELECTORS.ROW_BODY);
            const combobox1 = rowBodys[0].querySelector(SELECTORS.COMBOBOX);
            const combobox2 = rowBodys[1].querySelector(SELECTORS.COMBOBOX);

            expect(combobox1.options).toHaveLength(11);
            expect(combobox1.options[0].value).toEqual('1');
            expect(combobox1.options[10].value).toEqual('11');
            expect(combobox2.options).toHaveLength(11);
            expect(combobox2.options[0].value).toEqual('1');
            expect(combobox2.options[10].value).toEqual('11');
        });
        it('are correct according to left to right sizing', () => {
            const screenSectionFieldPropEditor = createComponentUnderTest({
                field: {
                    fields: [
                        { guid: '1', inputParameters: [{ value: 2 }] },
                        { guid: '2', inputParameters: [{ value: 7 }] },
                        { guid: '3', inputParameters: [{ value: 3 }] }
                    ]
                }
            });

            const listBody = query(screenSectionFieldPropEditor, SELECTORS.LIST_BODY);
            const rowBodys = listBody.querySelectorAll(SELECTORS.ROW_BODY);
            const combobox1 = rowBodys[0].querySelector(SELECTORS.COMBOBOX);
            const combobox2 = rowBodys[1].querySelector(SELECTORS.COMBOBOX);
            const combobox3 = rowBodys[2].querySelector(SELECTORS.COMBOBOX);

            expect(combobox1.options).toHaveLength(8);
            expect(combobox1.options[7].value).toEqual('8');
            expect(combobox2.options).toHaveLength(9);
            expect(combobox2.options[8].value).toEqual('9');
            expect(combobox3.options).toHaveLength(9);
            expect(combobox3.options[8].value).toEqual('9');
        });
    });
});
