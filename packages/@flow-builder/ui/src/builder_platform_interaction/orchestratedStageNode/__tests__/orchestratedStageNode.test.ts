// @ts-nocheck
import { createElement } from 'lwc';
import OrchestratedStageNode from '../orchestratedStageNode';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { commands } from 'builder_platform_interaction/sharedUtils';
import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (node, props) => {
    const el = createElement('builder_platform_interaction-orchestrated-stage-node', {
        is: OrchestratedStageNode
    });
    el.node = node;
    el.isDefaultMode = true;
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    STEP_ITEM: 'div[role="option"]',
    ADD_ITEM: 'button.add-item',
    DELETE_ITEM: 'button.delete-item',
    STEP_MENU_TRIGGER: 'button.step-menu-trigger',
    LIGHTNING_POPUP: 'lightning-popup'
};

describe('Stepped-Stage-Node', () => {
    const ssGuid = 'ORCHESTRATED_STAGE_11';
    const itemGuid = 'someStepGuid';
    let orchestratedStageElement;
    let mockNode;

    beforeEach(() => {
        mockNode = {
            name: 'myOrchestratedStageName',
            label: 'myOrchestratedStageLabel',
            description: 'myDescription',
            elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE,
            guid: ssGuid,
            metadata: {
                dynamicNodeComponentSelector: () => {
                    return [
                        {
                            name: 'some_step',
                            guid: itemGuid,
                            config: {}
                        },
                        {
                            name: 'some_step_2',
                            guid: itemGuid + '_2',
                            config: {}
                        },
                        {
                            name: 'some_step_3',
                            guid: itemGuid + '_3',
                            config: {
                                hasError: true
                            }
                        }
                    ];
                }
            },
            isCanvasElement: true
        };
    });

    afterEach(() => {
        orchestratedStageElement = undefined;
    });

    describe('menu interactions', () => {
        beforeEach(() => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
        });
        it('opens the stage step menu via trigger button (on click)', () => {
            const lightningPopup = orchestratedStageElement.shadowRoot.querySelector(selectors.LIGHTNING_POPUP);
            const stepMenuTrigger = orchestratedStageElement.shadowRoot.querySelector(selectors.STEP_MENU_TRIGGER);

            lightningPopup.show = jest.fn();

            stepMenuTrigger.click();

            expect(lightningPopup.show).toBeCalled();
        });

        it('closes the opened stage step menu via trigger button (on click)', () => {
            const lightningPopup = orchestratedStageElement.shadowRoot.querySelector(selectors.LIGHTNING_POPUP);
            const stepMenuTrigger = orchestratedStageElement.shadowRoot.querySelector(selectors.STEP_MENU_TRIGGER);

            lightningPopup.show = jest.fn();
            lightningPopup.close = jest.fn();

            // open step menu
            stepMenuTrigger.click();
            // assert the popover is opened
            expect(lightningPopup.show).toBeCalled();

            // close step menu
            stepMenuTrigger.click();
            // assert the popover is closed
            expect(lightningPopup.close).toBeCalled();
        });

        it('closes the opened stage step menu via trigger button (mixed Space/Enter)', () => {
            const lightningPopup = orchestratedStageElement.shadowRoot.querySelector(selectors.LIGHTNING_POPUP);
            const stepMenuTrigger = orchestratedStageElement.shadowRoot.querySelector(selectors.STEP_MENU_TRIGGER);

            lightningPopup.show = jest.fn();
            lightningPopup.close = jest.fn();

            stepMenuTrigger.focus();

            // open step menu
            orchestratedStageElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
            // assert the popover is opened
            expect(lightningPopup.show).toBeCalled();

            // close step menu
            orchestratedStageElement.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
            // assert the popover is closed
            expect(lightningPopup.close).toBeCalled();
        });

        it('returns focus to the menu trigger on FocusOutEvent', () => {
            const focusCallback = jest.fn();

            const lightningPopup = orchestratedStageElement.shadowRoot.querySelector(selectors.LIGHTNING_POPUP);
            const stepMenuTrigger = orchestratedStageElement.shadowRoot.querySelector(selectors.STEP_MENU_TRIGGER);

            stepMenuTrigger.addEventListener('focus', focusCallback);

            lightningPopup.dispatchEvent(new FocusOutEvent());

            expect(focusCallback).toBeCalled();
        });
    });

    describe('step error state', () => {
        beforeEach(() => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
        });
        const STAGE_STEP_ERROR_CLASS = 'stage-step-error';

        it('css class not present if no error', async () => {
            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);
            expect(stepItem.classList.contains(STAGE_STEP_ERROR_CLASS)).toBeFalsy();
        });

        it('css class present if error', async () => {
            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}_3']`);

            expect(stepItem.classList.contains(STAGE_STEP_ERROR_CLASS)).toBeTruthy();
        });
    });

    describe('edit step item', () => {
        it('opens the property editor panel for a step item (on click)', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();
            orchestratedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

            const event = new MouseEvent('click');
            stepItem.dispatchEvent(event);

            expect(cb.mock.calls[0][0].detail).toEqual({
                canvasElementGUID: itemGuid,
                designateFocus: false,
                elementType: 'STAGE_STEP',
                mode: 'editelement'
            });
        });
        it('does not open the property editor panel for a step item (on click) in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const cb = jest.fn();
            orchestratedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

            const event = new MouseEvent('click');
            stepItem.dispatchEvent(event);

            expect(cb).toHaveBeenCalledTimes(0);
        });
        it('opens the property editor panel for a step item (on space/enter keydown)', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();
            orchestratedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

            stepItem.focus();

            orchestratedStageElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);

            expect(cb.mock.calls[0][0].detail).toEqual({
                canvasElementGUID: itemGuid,
                designateFocus: true,
                elementType: 'STAGE_STEP',
                mode: 'editelement'
            });
        });
        it('does not open the property editor panel for a step item (on enter keydown)', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const cb = jest.fn();
            orchestratedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

            stepItem.focus();

            orchestratedStageElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);

            expect(cb).toHaveBeenCalledTimes(0);
        });
        it('does not open the property editor panel for a step item (on space keydown)', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const cb = jest.fn();
            orchestratedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

            const stepItem = orchestratedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

            stepItem.focus();

            orchestratedStageElement.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);

            expect(cb).toHaveBeenCalledTimes(0);
        });
        it('ensures that setting the guidForPropertyEditor selects the corresponding step', async () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            // mock setting the activeElementGuid to the current step being edited
            orchestratedStageElement.activeElementGuid = 'someStepGuid_3';

            await ticks(1);

            expect(stepItems[2].ariaSelected).toEqual('true');
        });
        it('ensures that setting the guidForPropertyEditor as null resets the last edited element selection', async () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            expect.assertions(2);

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            // mock setting the activeElementGuid to the current step being edited
            orchestratedStageElement.activeElementGuid = 'someStepGuid_3';

            await ticks(1);

            expect(stepItems[2].ariaSelected).toEqual('true');

            // mock clearing the activeElementGuid to falsify aria-selected on the last edited step
            orchestratedStageElement.activeElementGuid = null;

            await ticks(1);

            expect(stepItems[2].ariaSelected).toEqual('false');
        });
    });

    it('delete item', () => {
        orchestratedStageElement = createComponentUnderTest(mockNode);
        const cb = jest.fn();
        orchestratedStageElement.addEventListener(DeleteElementEvent.EVENT_NAME, cb);

        const deleteButton = orchestratedStageElement.shadowRoot.querySelector(`button[data-item-guid='${itemGuid}']`);

        const event = new MouseEvent('click');
        deleteButton.dispatchEvent(event);

        expect(cb.mock.calls[0][0].detail).toEqual({
            selectedElementGUID: [itemGuid],
            parentGUID: ssGuid,
            childIndexToKeep: undefined,
            selectedElementType: ELEMENT_TYPE.STAGE_STEP
        });
    });

    describe('keyboard navigation', () => {
        it('moves the tab focus to the next step item', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the first step item
            stepItems[0].focus();

            // add an event listener on the 2nd step item for the focus event
            stepItems[1].addEventListener('focus', cb);

            // simulate a down arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);

            expect(cb).toHaveBeenCalled();
        });
        it('moves the tab focus to the prev step item', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the first step item
            stepItems[1].focus();

            // add an event listener on the 2nd step item for the focus event
            stepItems[0].addEventListener('focus', cb);

            // simulate a up arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);

            expect(cb).toHaveBeenCalled();
        });
        it('moves the tab focus to the top step item', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the 3rd (last) step item
            stepItems[2].focus();

            // add an event listener on the 1st step item for the focus event
            stepItems[0].addEventListener('focus', cb);

            // simulate a up arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);

            expect(cb).toHaveBeenCalled();
        });
        it('moves the tab focus to the bottom step item', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the first step item
            stepItems[0].focus();

            // add an event listener on the 3rd (last) step item for the focus event
            stepItems[2].addEventListener('focus', cb);

            // simulate a up arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);

            expect(cb).toHaveBeenCalled();
        });
        it('does execute an up keyboard handler when in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the first step item
            stepItems[0].focus();

            // add an event listener on the 3rd (last) step item for the focus event
            stepItems[2].addEventListener('focus', cb);

            // simulate a up arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);

            expect(cb).toHaveBeenCalledTimes(1);
        });
        it('does execute a down keyboard handler when in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const cb = jest.fn();

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;
            // set tab focus on the first step item
            stepItems[0].focus();

            // add an event listener on the 3rd (last) step item for the focus event
            stepItems[1].addEventListener('focus', cb);

            // simulate a down arrow keypress on the container
            orchestratedStageElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);

            expect(cb).toHaveBeenCalledTimes(1);
        });
    });

    describe('tab indexing', () => {
        it('ensures that only the first step item has been initialized with a tab index', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            expect([stepItems[0].tabIndex, stepItems[1].tabIndex, stepItems[2].tabIndex]).toEqual([0, -1, -1]);
        });
        it('ensures that only the last focused step item has a tab index', async () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            stepItems[0].focus();

            orchestratedStageElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);

            // mock the updated node object being passed into the component following some change event
            orchestratedStageElement.node = mockNode;

            await ticks(1);

            expect([stepItems[0].tabIndex, stepItems[1].tabIndex, stepItems[2].tabIndex]).toEqual([-1, 0, -1]);
        });
        it('ensures that only the last edited step item has a tab index', async () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            // mock clicking it, to open the PEiP for the element being edited
            stepItems[2].click();

            // mock setting the activeElementGuid to the step being edited
            orchestratedStageElement.activeElementGuid = 'someStepGuid_3';

            await ticks(1);

            expect([stepItems[0].tabIndex, stepItems[1].tabIndex, stepItems[2].tabIndex]).toEqual([-1, -1, 0]);
        });
        it('ensures step items have a tab index in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });

            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            expect([stepItems[0].tabIndex, stepItems[1].tabIndex, stepItems[2].tabIndex]).toEqual([0, -1, -1]);
        });
    });

    describe('button visibility', () => {
        it('displays the delete button in edit mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            // const deleteButton = orchestratedStageElement.shadowRoot.querySelector(`button[data-item-guid='${itemGuid}']`);
            const deleteButtons = orchestratedStageElement.shadowRoot.querySelectorAll(selectors.DELETE_ITEM);
            expect(deleteButtons.length).toBe(3);
        });
        it('does not display the delete button in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableDeleteElements: true });
            const deleteButtons = orchestratedStageElement.shadowRoot.querySelectorAll(selectors.DELETE_ITEM);
            expect(deleteButtons.length).toBe(0);
        });
        it('displays the add-step button in edit mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode);
            const addStepButtons = orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_MENU_TRIGGER);
            expect(addStepButtons.length).toBe(1);
        });
        it('does not display the add-step button in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableAddElements: true });
            const addStepButtons = orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_MENU_TRIGGER);
            expect(addStepButtons.length).toBe(0);
        });
    });
    describe('item styling', () => {
        it('does not have .disabled class in debug mode', () => {
            orchestratedStageElement = createComponentUnderTest(mockNode, { disableEditElements: true });
            const stepItems = orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM + '.disabled');
            expect(stepItems.length).toBe(0);
        });
    });
});
