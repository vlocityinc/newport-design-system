import { createElement } from 'lwc';
import FlcNodeMenu from 'builder_platform_interaction/flcNodeMenu';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { DeleteElementEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';

const action = {
    section: 'Interaction',
    type: 'default',
    icon: 'standard:lightning_component',
    label: 'Action',
    value: 'ActionCall',
    elementType: 'ActionCall',
    description: 'Perform an action ou'
};

const del = {
    section: 'Flow Control',
    type: 'decision',
    icon: 'standard:waits',
    label: 'Pause',
    value: 'Wait',
    elementType: 'Wait',
    description: 'Pause th'
};

const createComponentUnderTest = metaData => {
    const el = createElement('builder_platform_interaction-flc-node-menu', {
        is: FlcNodeMenu
    });
    el.elementMetadata = metaData;
    document.body.appendChild(el);
    return el;
};

describe('the node menu', () => {
    it('renders the component ', () => {
        const menu = createComponentUnderTest(action);
        expect(menu).toBeDefined();
    });
    it('The delete case dispatches the delete event ', async () => {
        const menu = createComponentUnderTest(del);
        await ticks(1);
        const callback = jest.fn();
        menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
        menu.shadowRoot.querySelector('.slds-dropdown__item a').click();
        expect(callback).toHaveBeenCalled();
    });
    it('The custom event case dispatches the toggle menu event ', async () => {
        const menu = createComponentUnderTest(del);
        await ticks(1);
        const callback = jest.fn();
        menu.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        menu.shadowRoot.querySelector('.slds-dropdown__item a').click();
        expect(callback).toHaveBeenCalled();
    });
});
