// @ts-nocheck
import { createElement } from 'lwc';
import SteppedStageNode from '../steppedStageNode';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { AddElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-stepped-stage-node', {
        is: SteppedStageNode
    });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    ADD_ITEM: '.add-item'
};

describe('Stepped-Stage-Node', () => {
    const ssGuid = 'STEPPED_STAGE_11';
    const itemGuid = 'someStepGuid';
    let steppedStageElement;

    beforeEach(() => {
        steppedStageElement = createComponentUnderTest({
            name: 'mySteppedStageName',
            label: 'mySteppedStageLabel',
            description: 'myDescription',
            elementType: ELEMENT_TYPE.STEPPED_STAGE,
            guid: ssGuid,
            metadata: {
                dynamicNodeComponentSelector: () => {
                    return [{ name: 'some_step', guid: itemGuid }];
                }
            },
            isCanvasElement: true
        });
    });

    it('add item', () => {
        const cb = jest.fn();
        steppedStageElement.addEventListener(AddElementEvent.EVENT_NAME, cb);

        const addStep = steppedStageElement.shadowRoot.querySelector(selectors.ADD_ITEM);

        const event = new MouseEvent('click');
        addStep.dispatchEvent(event);

        expect(cb.mock.calls[0][0].detail.guid).toEqual(steppedStageElement.guid);
    });

    it('open item property editor', () => {
        const cb = jest.fn();
        steppedStageElement.addEventListener(EditElementEvent.EVENT_NAME, cb);

        const step = steppedStageElement.shadowRoot.querySelector(`div[data-item-guid='${itemGuid}']`);

        const event = new MouseEvent('dblclick');
        step.dispatchEvent(event);

        expect(cb.mock.calls[0][0].detail.canvasElementGUID).toEqual(itemGuid);
    });

    it('delete item', () => {
        const cb = jest.fn();
        steppedStageElement.addEventListener(DeleteElementEvent.EVENT_NAME, cb);

        const deleteButton = steppedStageElement.shadowRoot.querySelector(`button[data-item-guid='${itemGuid}']`);

        const event = new MouseEvent('click');
        deleteButton.dispatchEvent(event);

        expect(cb.mock.calls[0][0].detail).toEqual({
            selectedElementGUID: [itemGuid],
            parentGUID: ssGuid,
            childIndexToKeep: undefined,
            selectedElementType: ELEMENT_TYPE.STEPPED_STAGE_ITEM
        });
    });
});
