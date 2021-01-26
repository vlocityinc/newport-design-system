// @ts-nocheck
import ScreenPalette from 'builder_platform_interaction/screenEditorPalette';
import { createElement } from 'lwc';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import { dragStartEvent, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/contextLib', () => {
    return {
        orgHasFlowBuilderAutomaticFields: jest.fn().mockReturnValue(true),
        isTestMode: jest.fn().mockReturnValue(false)
    };
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-palette', { is: ScreenPalette });
    // Using the setter for screenFieldTypes triggers buildModel which populates the palette.
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const extensionTypes = [
    {
        name: 'flowruntime:fileUpload',
        fieldType: FlowScreenFieldType.ComponentInstance,
        dataType: undefined,
        label: 'File Upload',
        icon: 'utility:type_tool',
        category: 'Input'
    },
    {
        name: 'orgns:customComp',
        fieldType: FlowScreenFieldType.ComponentInstance,
        dataType: undefined,
        label: 'Custom Comp',
        icon: 'utility:type_tool',
        category: 'Custom'
    }
];

const screenFieldTypes = [
    {
        name: 'TextBox',
        fieldType: 'InputField',
        dataType: 'String',
        label: 'Text Input',
        icon: 'utility:type_tool',
        category: 'Input'
    },
    {
        name: 'LargeTextArea',
        fieldType: 'LargeTextArea',
        dataType: undefined,
        label: 'Text Area',
        icon: 'utility:type_tool',
        category: 'Input'
    },
    {
        name: 'ZNumber', // For testing sorting, to ensure we sort by label
        fieldType: 'InputField',
        dataType: 'Number',
        label: 'Number',
        icon: 'utility:topic2',
        category: 'Input'
    }
];
jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const { SCREEN_EDITOR_GUIDS, InputsOnNextNavToAssocScrnOption, getFieldByGuid } = jest.requireActual(
        'builder_platform_interaction/screenEditorUtils'
    );
    return {
        SCREEN_EDITOR_GUIDS,
        setDragFieldValue: jest.fn(),
        InputsOnNextNavToAssocScrnOption,
        getFieldByGuid
    };
});

describe('Screen Editor Palette', () => {
    let element;
    let basePalette;
    let eventCallback;
    let guid;
    beforeEach(async () => {
        element = createComponentForTest({ screenFieldTypes, extensionTypes });
        eventCallback = jest.fn();
        await ticks(1);
        basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        guid = basePalette.data[3].key;
    });
    it('should list all the screen fields and extensions, sorted within category', () => {
        expect(basePalette.data).toHaveLength(7);
        expect(basePalette.data[0].label).toBe('Input (4)');
        expect(basePalette.data[1].label).toBe('File Upload');
        expect(basePalette.data[2].label).toBe('Number');
        expect(basePalette.data[3].label).toBe('Text Area');
        expect(basePalette.data[4].label).toBe('Text Input');
        expect(basePalette.data[5].label).toBe('Custom (1)');
        expect(basePalette.data[6].label).toBe('Custom Comp');
    });
    it('should fire an event when clicking a field type', async () => {
        element.addEventListener(ScreenEditorEventName.ScreenFieldAdded, eventCallback);
        const paletteClickEvent = new CustomEvent('paletteitemclicked', {
            detail: { guid }
        });
        basePalette.dispatchEvent(paletteClickEvent);
        await ticks(1);
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0]).toMatchObject({
            detail: {
                typeName: 'LargeTextArea'
            }
        });
    });
    it('should modify the event with the field type when dragging a field type', () => {
        const dragStart = dragStartEvent(JSON.stringify({ elementType: guid }));
        const dataTransfer = dragStart.dataTransfer;

        basePalette.dispatchEvent(dragStart);

        expect(dataTransfer.getData('text')).toBe(JSON.stringify({ fieldTypeName: 'LargeTextArea' }));
        expect(dataTransfer.effectAllowed).toBe('copy');
    });
});

describe('Screen Editor Palette when there are no extension types', () => {
    it('should list all the screen fields and extensions, sorted within category', async () => {
        expect.assertions(5);
        const element = createComponentForTest({ screenFieldTypes, undefined });
        await ticks(1);
        const basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        expect(basePalette.data).toHaveLength(4);
        expect(basePalette.data[0].label).toBe('Input (3)');
        expect(basePalette.data[1].label).toBe('Number');
        expect(basePalette.data[2].label).toBe('Text Area');
        expect(basePalette.data[3].label).toBe('Text Input');
    });
});

describe('Screen Editor Palette when there are no screen field types', () => {
    it('should list all the screen fields and extensions, sorted within category', async () => {
        expect.assertions(5);
        const element = createComponentForTest({ undefined, extensionTypes });
        await ticks(1);
        const basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        expect(basePalette.data).toHaveLength(4);
        expect(basePalette.data[0].label).toBe('Input (1)');
        expect(basePalette.data[1].label).toBe('File Upload');
        expect(basePalette.data[2].label).toBe('Custom (1)');
        expect(basePalette.data[3].label).toBe('Custom Comp');
    });
});
