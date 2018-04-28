import { createElement } from 'engine';
import VariableEditor from '../variable-editor';
import { hydratedElements, stringVariableGuid, variable } from 'mock-store-data';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { createAction, PROPERTY_EDITOR_ACTION} from 'builder_platform_interaction-actions';
import { variableReducer } from '../variable-reducer';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-editor', {
        is: VariableEditor,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction-actions', () => {
    return {
        createAction: jest.fn().mockReturnValue({}),
        PROPERTY_EDITOR_ACTION: require.requireActual('builder_platform_interaction-actions').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../variable-reducer', () => {
    return {
        variableReducer: jest.fn().mockImplementation(obj => Object.assign({}, obj)),
    };
});

jest.mock('builder_platform_interaction-data-type-lib', () => {
    return {
        FLOW_DATA_TYPE: {
            STRING: {
                label: 'Text',
                type: 'String',
            }
        },
        FEROV_DATA_TYPE: require.requireActual('builder_platform_interaction-data-type-lib').FEROV_DATA_TYPE,
    };
});

describe('variable-editor', () => {
    const stringVariable = hydratedElements[stringVariableGuid];
    it('contains a variable element', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            expect(variableEditor.node.elementType.value).toEqual(variable);
            expect(variableEditor.getNode()).toEqual(stringVariable);
        });
    });

    it('has label description component', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        const labelDescription = variableEditor.querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(stringVariable.description);
        expect(labelDescription.devName).toEqual(stringVariable.name);
    });

    it('handles the property changed event and updates the property', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            variableEditor.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
            expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
        });
    });

    describe('data type picker', () => {
        it('has a data type picker', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                expect(dataTypePicker).toBeDefined();
            });
        });

        it('gives flow data type menu items to th data type combobox', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                expect(dataTypePicker.options).toHaveLength(1);
            });
        });

        it('handles change event when data type option is selected', () => {
            const variableEditor = setupComponentUnderTest(stringVariable);
            return Promise.resolve().then(() => {
                const dataTypePicker = variableEditor.querySelector('lightning-combobox');
                const mockChangeEvent = new CustomEvent('change', { detail: { value: ''}});
                dataTypePicker.dispatchEvent(mockChangeEvent);
                expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
                expect(variableReducer.mock.calls[0][0]).toEqual(variableEditor.node);
            });
        });
    });
});