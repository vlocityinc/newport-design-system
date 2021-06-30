// @ts-nocheck
import { createElement } from 'lwc';
import OrchestratedStageNode from '../orchestratedStageNode';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { commands } from 'builder_platform_interaction/sharedUtils';

import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const { EnterCommand, ArrowDown, ArrowUp } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const sharedcommands = require('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands: sharedcommands });
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-orchestrated-stage-node', {
        is: OrchestratedStageNode
    });
    el.node = node;
    el.isDefaultMode = true;
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    STEP_ITEM: 'div[role="option"]',
    ADD_ITEM: 'button.add-item',
    DELETE_ITEM: 'button.delete-item'
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
                            guid: itemGuid
                        },
                        {
                            name: 'some_step_2',
                            guid: itemGuid + '_2'
                        },
                        {
                            name: 'some_step_3',
                            guid: itemGuid + '_3'
                        }
                    ];
                }
            },
            isCanvasElement: true
        };

        orchestratedStageElement = createComponentUnderTest(mockNode);
    });

    // TODO @W-9127952: Change the below tests to check that the 'Add Step' button opens the Step Menu
    // describe('add step item', () => {
    //     it('adds a new step item (on click)', () => {
    //         const cb = jest.fn();
    //         orchestratedStageElement.addEventListener(AddElementEvent.EVENT_NAME, cb);

    //         const addStepButton = orchestratedStageElement.shadowRoot.querySelector(selectors.ADD_ITEM);

    //         const event = new MouseEvent('click');

    //         addStepButton.dispatchEvent(event);

    //         expect(cb).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 detail: {
    //                     designateFocus: false,
    //                     actionType: ACTION_TYPE.CREATE_WORK_ITEM,
    //                     elementType: 'STAGE_STEP',
    //                     parent: ssGuid
    //                 }
    //             })
    //         );
    //     });
    //     it('adds a new step item (on space/enter keydown)', () => {
    //         const cb = jest.fn();
    //         orchestratedStageElement.addEventListener(AddElementEvent.EVENT_NAME, cb);

    //         const addStepButton = orchestratedStageElement.shadowRoot.querySelector(selectors.ADD_ITEM);

    //         addStepButton.focus();

    //         orchestratedStageElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);

    //         expect(cb).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 detail: {
    //                     designateFocus: true,
    //                     actionType: ACTION_TYPE.CREATE_WORK_ITEM,
    //                     elementType: 'STAGE_STEP',
    //                     parent: ssGuid
    //                 }
    //             })
    //         );
    //     });
    // });

    describe('edit step item', () => {
        it('opens the property editor panel for a step item (on click)', () => {
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
        it('opens the property editor panel for a step item (on space/enter keydown)', () => {
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
        it('ensures that setting the guidForPropertyEditor selects the corresponding step', async () => {
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            // mock setting the activeElementGuid to the current step being edited
            orchestratedStageElement.activeElementGuid = 'someStepGuid_3';

            await ticks(1);

            expect(stepItems[2].ariaSelected).toEqual('true');
        });
        it('ensures that setting the guidForPropertyEditor as null resets the last edited element selection', async () => {
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
    });

    describe('tab indexing', () => {
        it('ensures that only the first step item has been initialized with a tab index', () => {
            const stepItems = Array.from(
                orchestratedStageElement.shadowRoot.querySelectorAll(selectors.STEP_ITEM)
            ) as any;

            expect([stepItems[0].tabIndex, stepItems[1].tabIndex, stepItems[2].tabIndex]).toEqual([0, -1, -1]);
        });
        it('ensures that only the last focused step item has a tab index', async () => {
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
    });
});
