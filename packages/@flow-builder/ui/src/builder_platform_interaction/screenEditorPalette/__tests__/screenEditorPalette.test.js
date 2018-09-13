import ScreenPalette from "builder_platform_interaction/screenEditorPalette";
import { createElement } from 'lwc';
import { SCREEN_EDITOR_EVENT_NAME } from "builder_platform_interaction/events";
import { getShadowRoot } from 'lwc-test-utils';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-screen-editor-palette', { is: ScreenPalette });
    // Using the setter for screenFieldTypes triggers buildModel which populates the palette.
    el.screenFieldTypes = [];
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
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
                    name: 'ZNumber', // For testing sorting, to ensure we sort by label
                    fieldType: 'InputField',
                    dataType: 'Number',
                    label: 'Number',
                    icon: 'utility:topic2',
                    category: 'Input'
                }];
        },
        getAllCachedExtensionTypes: () => {
            const componentInstanceFieldType = require.requireActual('builder_platform_interaction-screen-editor-utils').COMPONENT_INSTANCE;
            return [
                {
                    name: 'flowruntime:fileUpload',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'File Upload',
                    icon: 'utility:type_tool',
                    category: 'Input'
                }, {
                    name: 'orgns:customComp',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'Custom Comp',
                    icon: 'utility:type_tool',
                    category: 'Custom'
                }];
        }
    };
});

describe('Screen Editor Palette', () => {
    let element;
    let basePalette;
    let eventCallback;
    let guid;
    beforeEach(() => {
        element = createComponentForTest();
        eventCallback = jest.fn();
        return Promise.resolve().then(() => {
            basePalette = getShadowRoot(element).querySelector('builder_platform_interaction-palette');
            guid = basePalette.data[3].key;
        });
    });
    it('should list all the screen fields and extensions, sorted within category', () => {
        expect(basePalette.data).toHaveLength(7);
        expect(basePalette.data[0].label).toBe('Input');
        expect(basePalette.data[1].label).toBe('File Upload');
        expect(basePalette.data[2].label).toBe('Number');
        expect(basePalette.data[3].label).toBe('Text Area');
        expect(basePalette.data[4].label).toBe('Text Input');
        expect(basePalette.data[5].label).toBe('Custom');
        expect(basePalette.data[6].label).toBe('Custom Comp');
    });
    it('should fire an event when clicking a field type', () => {
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
    it('should modify the event with the field type when dragging a field type', () => {
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