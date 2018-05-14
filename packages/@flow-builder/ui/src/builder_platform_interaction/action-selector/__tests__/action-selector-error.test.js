import { createElement } from 'engine';
import ActionSelector from '../action-selector';
import { mockError } from 'mock-action-selector-data';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-action-selector', { is: ActionSelector });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningCombobox: 'lightning-combobox'
};

jest.mock('builder_platform_interaction-server-data-lib', () => {
    const actual = require.requireActual('builder_platform_interaction-server-data-lib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetch : (serverActionType, callback) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    callback({ error: mockError});
                    break;
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    callback({ error: mockError});
                    break;
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    callback({ error: mockError});
                    break;
                default:
            }
        }
    };
});

describe('When error occurs when retrieving data from server', () => {
    let actionSelectorComponent;
    let lightningCombobox;
    beforeEach(() => {
        actionSelectorComponent = createComponentUnderTest();
        lightningCombobox = actionSelectorComponent.querySelector(selectors.lightningCombobox);
    });
    test('Error should be displayed', () => {
        expect(lightningCombobox.setCustomValidity).toHaveBeenCalledWith('FlowBuilderActionCallEditor.retrieveInvocableActionsError');
        expect(lightningCombobox.showHelpMessageIfInvalid).toHaveBeenCalled();
    });
});