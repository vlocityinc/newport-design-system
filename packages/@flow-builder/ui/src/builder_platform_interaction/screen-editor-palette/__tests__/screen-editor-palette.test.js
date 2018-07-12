import ScreenPalette from 'builder_platform_interaction-screen-editor-palette';
import { createElement } from 'engine';
import { SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-screen-editor-palette', { is: ScreenPalette });
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction-screen-editor-utils', () => {
    return {
        getAllScreenFieldTypes: () => {
            return [
                {
                    name: 'TextBox',
                    fieldType: 'InputField',
                    dataType: 'String',
                    label: 'Text Input',
                    icon: 'utility:type_tool',
                    category: 'Input'
                }, {
                    name: 'LargeTextArea',
                    fieldType: 'LargeTextArea',
                    dataType: undefined,
                    label: 'Text Area',
                    icon: 'utility:type_tool',
                    category: 'Input'
                }, {
                    name: 'Number',
                    fieldType: 'InputField',
                    dataType: 'Number',
                    label: 'Number',
                    icon: 'utility:topic2',
                    category: 'Input'
                }];
        },
        getAllCachedExtensionTypes: () => {
            return [];
        }
    };
});

describe('Screen Editor Palette', () => {
    describe('Adding a new field', () => {
        let element;
        let basePalette;
        let eventCallback;
        let guid;
        beforeEach(() => {
            element = createComponentForTest();
            eventCallback = jest.fn();
            Promise.resolve().then(() => {
                basePalette = getShadowRoot(element).querySelector('builder_platform_interaction-palette');
                guid = basePalette.data[2].key;
            });
        });
        it('should fire an event when clicking', () => {
            element.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED, eventCallback);
            const paletteClickEvent = new CustomEvent('paletteitemclicked', {detail: {guid}});
            basePalette.dispatchEvent(paletteClickEvent);
            return Promise.resolve().then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        typeName: 'LargeTextArea'
                    }
                });
            });
        });
        it('should modify the event with the field type when dragging', () => {
            element.addEventListener('dragstart', eventCallback);
            const dragStartEvent = new CustomEvent('dragstart');
            dragStartEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                    this.types = [];
                    this.types[0] = type;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dragStartEvent.dataTransfer.setData('text', guid);
            basePalette.dispatchEvent(dragStartEvent);

            expect(dragStartEvent.dataTransfer.getData('text')).toBe('LargeTextArea');
            expect(dragStartEvent.dataTransfer.effectAllowed).toBe('copy');
        });
    });
});