import { createElement } from 'lwc';
import List from '../list';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { query } from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ADD_BUTTON: 'lightning-button'
};
function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-list', { is: List });

    Object.assign(el, props);

    document.body.appendChild(el);
    return el;
}

// TODO should come from some kind of item factory
const size1 = [
    {
        assignToReference: {
            value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
            error: null
        },
        assignmentOperatorType: { value: 'Assign', error: null },
        value: { value: 'xyz', error: null }
    }
];

describe('list', () => {
    it('handles the property changed event and updates the property', () => {
        const list = createComponentForTest();
        list.items = deepCopy(size1);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            list.addEventListener('addlistitem', callback);
            list.shadowRoot.querySelector('lightning-button').click();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('add button not disabled when maxItems is not specified', () => {
        const list = createComponentForTest({
            items: deepCopy(size1)
        });
        const nameField = query(list, SELECTORS.ADD_BUTTON);
        expect(nameField.disabled).toBeFalsy();
    });

    it('add button disabled when item count is >= maxItems', () => {
        const list = createComponentForTest({
            maxItems: 1,
            items: deepCopy(size1)
        });

        const nameField = query(list, SELECTORS.ADD_BUTTON);
        expect(nameField.disabled).toBeTruthy();
    });
});
