import { createElement } from 'lwc';
import ActionSelector from "../actionSelector";
import { mockError } from "mock/actionSelectorData";
import { getShadowRoot } from 'lwc-test-utils';

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
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                    return Promise.reject(mockError);
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    return Promise.reject(mockError);
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return Promise.reject(mockError);
                default:
                    return Promise.reject();
            }
        }
    };
});

describe('When error occurs when retrieving data from server', () => {
    let actionSelectorComponent;
    let lightningCombobox;
    beforeEach(() => {
        actionSelectorComponent = createComponentUnderTest();
        lightningCombobox = getShadowRoot(actionSelectorComponent).querySelector(selectors.lightningCombobox);
    });
    test('Error should be displayed', () => {
        expect(lightningCombobox.setCustomValidity).toHaveBeenCalledWith('FlowBuilderActionCallEditor.retrieveInvocableActionsError');
        expect(lightningCombobox.showHelpMessageIfInvalid).toHaveBeenCalled();
    });
});