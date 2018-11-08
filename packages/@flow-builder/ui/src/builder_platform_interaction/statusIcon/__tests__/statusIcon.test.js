import { createElement } from 'lwc';
import StatusIcon from '../statusIcon';
import { invokePopover } from 'builder_platform_interaction/builderUtils';

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokePopover: jest.fn()
    };
});

function createComponentForTest({ disableAutoOpen = false } = {}) {
    const el = createElement('builder_platform_interaction-parameter-item', { is: StatusIcon });
    Object.assign(el, { disableAutoOpen });
    document.body.appendChild(el);
    return el;
}

describe('status-icon', () => {
    describe('When messages are set', () => {
        it('does not open the panel auto-open is disabled', () => {
            const statusIconCmp = createComponentForTest({ disableAutoOpen : true});
            statusIconCmp.messages = {'PropertyEditorFooter': ['a message']};
            expect(invokePopover).not.toHaveBeenCalled();
        });
    });
});