import { createElement } from 'lwc';
import FlcNode from 'builder_platform_interaction/flcNode';
import { FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/events';
import { ElementType } from 'builder_platform_interaction/flowUtils';

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-flcNode', {
        is: FlcNode
    });

    el.nodeInfo = props.nodeInfo;
    el.isSelectionMode = props.isSelectionMode;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    selectionCheckbox: '.selection-checkbox'
};

describe('FlcNode', () => {
    let nodeInfo;
    beforeEach(() => {
        nodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'dummyIcon',
                label: 'elementType',
                type: ElementType.DEFAULT
            },
            menuOpened: false
        };
    });

    it('Does not show the selection checkbox in Base Mode', () => {
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: false });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox).toBeNull();
    });

    it('Shows the selection checkbox in Selection Mode', () => {
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox).not.toBeNull();
    });

    it('Does not show selection box for Start Element in Selection Mode', () => {
        nodeInfo.metadata.type = ElementType.START;
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox).toBeNull();
    });

    it('Does not show selection box for End Element in Selection Mode', () => {
        nodeInfo.metadata.type = ElementType.END;
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox).toBeNull();
    });

    it('The Selection Box should be disabled when isSelectable is true', () => {
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox.disabled).toBeFalsy();
    });

    it('The Selection Box should be disabled when isSelectable is false', () => {
        nodeInfo.config.isSelectable = false;
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox.disabled).toBeTruthy();
    });

    it('The Selection Box should have the correct icon name and variant when not selected', () => {
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox.iconName).toEqual('utility:add');
        expect(selectionCheckbox.variant).toEqual('border-filled');
    });

    it('The Selection Box should have the correct icon name and variant when selected', () => {
        nodeInfo.config.isSelected = true;
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
        expect(selectionCheckbox.iconName).toEqual('utility:check');
        expect(selectionCheckbox.variant).toEqual('brand');
    });

    it('Should dispatch FlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is not selected)', () => {
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const eventCallback = jest.fn();
        flcNodeComponent.addEventListener(FlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
        flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Should dispatch FlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is selected)', () => {
        nodeInfo.config.isSelected = true;
        const flcNodeComponent = createComponentUnderTest({ nodeInfo, isSelectionMode: true });
        const eventCallback = jest.fn();
        flcNodeComponent.addEventListener(FlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
        flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
        expect(eventCallback).toHaveBeenCalled();
    });
});
