// @ts-nocheck
import {
    dragStartEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import ScreenPalette from 'builder_platform_interaction/screenEditorPalette';
import { createElement } from 'lwc';

const mockedContextLib = require('builder_platform_interaction_mocks/contextLib');
jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

async function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-palette', { is: ScreenPalette });
    // Using the setter for screenFieldTypes triggers buildModel which populates the palette.
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    await ticks(1);
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
        element = await createComponentForTest({ screenFieldTypes, extensionTypes });
        eventCallback = jest.fn();
        basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        guid = basePalette.data[0]._children[2].guid;
    });
    it('should list all the screen fields and extensions, sorted within category', () => {
        expect(basePalette.data).toHaveLength(2);
        const [inputSection, customSection] = basePalette.data;

        expect(inputSection.label).toBe('Input');
        expect(customSection.label).toBe('Custom');

        expect(inputSection._children.map((item) => item.label)).toEqual([
            'File Upload',
            'Number',
            'Text Area',
            'Text Input'
        ]);
        expect(customSection._children.map((item) => item.label)).toEqual(['Custom Comp']);
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
    it('displays App Exchange banner without automatic fields org perm', () => {
        mockedContextLib.orgHasFlowBuilderAutomaticFields = jest.fn().mockReturnValue(false);
        expect(element.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BUTTON_BANNER)).toBeTruthy();
    });
    it('displays App Exchange banner with automatic fields org perm', () => {
        mockedContextLib.orgHasFlowBuilderAutomaticFields = jest.fn().mockReturnValue(true);
        expect(element.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BUTTON_BANNER)).toBeTruthy();
    });
});

describe('Screen Editor Palette when there are no extension types', () => {
    it('should list all the screen fields and extensions, sorted within category', async () => {
        const element = await createComponentForTest({ screenFieldTypes, undefined });
        const basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        expect(basePalette.data).toHaveLength(1);
        const inputSection = basePalette.data[0];

        expect(inputSection.label).toBe('Input');
        expect(inputSection._children[0].label).toBe('Number');
        expect(inputSection._children[1].label).toBe('Text Area');
        expect(inputSection._children[2].label).toBe('Text Input');
    });
});

describe('Screen Editor Palette when there are no screen field types', () => {
    it('should list all the screen fields and extensions, sorted within category', async () => {
        const element = await createComponentForTest({ undefined, extensionTypes });
        const basePalette = element.shadowRoot.querySelector('builder_platform_interaction-palette');
        expect(basePalette.data).toHaveLength(2);
        const [inputSection, customSection] = basePalette.data;

        expect(inputSection.label).toBe('Input');
        expect(inputSection._children[0].label).toBe('File Upload');
        expect(customSection.label).toBe('Custom');
        expect(customSection._children[0].label).toBe('Custom Comp');
    });
});
