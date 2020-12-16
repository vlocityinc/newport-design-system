// @ts-nocheck
import { createElement } from 'lwc';
import FlcBuilderContainer from 'builder_platform_interaction/flcBuilderContainer';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/flcBuilder', () => require('builder_platform_interaction_mocks/flcBuilder'));

jest.mock('builder_platform_interaction/storeLib', () => {
    function getStore() {
        return {
            getCurrentState: jest.fn(() => {
                return { elements: {} };
            }),
            subscribe: jest.fn(() => jest.fn()),
            unsubscribe: jest.fn()
        };
    }

    return {
        Store: {
            getStore
        }
    };
});

const createComponentForTest = () => {
    const el = createElement('builder_platform_interaction-flc-builder-container', {
        is: FlcBuilderContainer
    });

    el.isSelectionMode = false;
    el.isPasteAvailable = false;
    el.elementsMetadata = null;

    document.body.appendChild(el);

    return el;
};

describe('flc builder container', () => {
    let cmp;

    beforeEach(() => {
        cmp = createComponentForTest();
    });

    const getBuilderContainerElement = () =>
        cmp.shadowRoot.querySelector('builder_platform_interaction-flc-builder-container');

    const getFlcBuilder = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-builder');

    it('renders the component', async () => {
        await ticks(1);
        expect(getBuilderContainerElement).not.toBeNull();
    });

    it('offsets when in selection mode', async () => {
        await ticks(1);
        expect(getFlcBuilder().offsets).toEqual([0, 0]);

        cmp.isSelectionMode = true;
        await ticks(1);
        expect(getFlcBuilder().offsets).toEqual([320, 0]);
    });
});
