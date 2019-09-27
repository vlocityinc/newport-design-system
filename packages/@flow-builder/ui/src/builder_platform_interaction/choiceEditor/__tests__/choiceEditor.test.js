import { createElement } from 'lwc';
import ChoiceEditor from '../choiceEditor';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { choiceReducer } from '../choiceReducer';
import {
    PropertyChangedEvent,
    ComboboxStateChangedEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import {
    getResourceByUniqueIdentifier,
    getFerovInfoAndErrorFromEvent
} from 'builder_platform_interaction/expressionUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { LABELS } from '../choiceEditorLabels';
import { FEROV_DATA_TYPE } from '../../dataTypeLib/dataTypeLib';
import { STORED_VALUE_DATA_TYPE_PROPERTY } from 'builder_platform_interaction/elementFactory';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
    INPUT_SELECTION_CHECKBOX: '.test-input-selection-checkbox',
    PROMPT_TEXT: '.prompt-text',
    REQUIRED_CHECKBOX: '.test-required-checkbox',
    VALIDATE_CHECKBOX: '.test-validate-checkbox',
    VALIDATION_EDITOR: 'builder_platform_interaction-validation-editor',
    RESOURCE_RICH_TEXT_EDITOR:
        'builder_platform_interaction-resourced-rich-text-editor',
    LIGHTNING_INPUT_RICH_TEXT: 'lightning-input-rich-text',
    RICH_TEXT_PLAIN_TEXT_SWITCH:
        'builder_platform_interaction-rich-text-plain-text-switch'
};

const setupComponentUnderTest = choiceObject => {
    const element = createElement(
        'builder_platform_interaction-choice-editor',
        {
            is: ChoiceEditor
        }
    );
    element.node = choiceObject;
    document.body.appendChild(element);
    return element;
};

const focusoutEvent = new FocusEvent('focusout', {
    bubbles: true,
    composed: true,
    cancelable: true
});

const blurEvent = new FocusEvent('blur', {
    bubbles: true,
    composed: true,
    cancelable: true
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual(
            '../../actions/actions.js'
        ).PROPERTY_EDITOR_ACTION
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../choiceReducer', () => {
    return {
        choiceReducer: jest
            .fn()
            .mockImplementation(obj => Object.assign({}, obj))
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getFerovDataTypeForValidId: jest.fn(),
        getItemOrDisplayText: require.requireActual(
            '../../expressionUtils/expressionUtils.js'
        ).getItemOrDisplayText,
        getFerovInfoAndErrorFromEvent: jest
            .fn()
            .mockName('getFerovInfoAndErrorFromEvent')
    };
});

describe('choice-editor', () => {
    const defaultChoiceObject = {
        choiceText: 'choiceText',
        dataType: { value: 'String', error: null },
        description: 'Desc',
        elementType: 'CHOICE',
        guid: 'guid1',
        isShowInputSelected: false,
        isValidateSelected: false,
        name: 'choice1',
        storedValue: 'storedValue',
        storedValueIndex: {
            value: 'guid',
            error: null
        },
        userInput: undefined
    };

    const userInputChoiceObject = {
        choiceText: 'choiceText',
        dataType: 'String',
        description: 'Desc',
        elementType: 'CHOICE',
        guid: 'guid1',
        isShowInputSelected: true,
        isValidateSelected: false,
        name: 'choice1',
        storedValue: 'storedValue',
        storedValueIndex: {
            value: 'guid',
            error: null
        },
        userInput: {
            promptText: 'promptText',
            isRequired: true,
            validationRule: undefined
        }
    };

    const validationRuleChoiceObject = {
        choiceText: 'choiceText',
        dataType: 'String',
        description: 'Desc',
        elementType: 'CHOICE',
        guid: 'guid1',
        isShowInputSelected: true,
        isValidateSelected: true,
        name: 'choice1',
        storedValue: 'storedValue',
        storedValueIndex: {
            value: 'guid',
            error: null
        },
        userInput: {
            promptText: 'promptText',
            isRequired: true,
            validationRule: {
                errorMessage: 'errorMessage',
                formulaExpression: 'formulaExpression'
            }
        }
    };

    describe('Label description component', () => {
        let choiceEditor;
        let labelDescription;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(defaultChoiceObject);
            labelDescription = choiceEditor.shadowRoot.querySelector(
                SELECTORS.LABEL_DESCRIPTION
            );
        });

        it('Label-Description should be defined', () => {
            expect(labelDescription).toBeDefined();
        });

        it('Devname should be same as the name of the choiceObject', () => {
            expect(labelDescription.devName).toEqual(defaultChoiceObject.name);
        });

        it('Description should be same as the description of the choiceObject', () => {
            expect(labelDescription.description).toEqual(
                defaultChoiceObject.description
            );
        });
    });

    it('"rich text/plain text switch" NOT displayed inside the resourced rich text editor', () => {
        const choiceEditor = setupComponentUnderTest(defaultChoiceObject);
        const choiceTextResourcedRichText = choiceEditor.shadowRoot.querySelector(
            SELECTORS.RESOURCE_RICH_TEXT_EDITOR
        );
        expect(
            choiceTextResourcedRichText.shadowRoot.querySelector(
                SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH
            )
        ).toBeNull();
    });
    it('Handles the property changed event and updates the property', () => {
        const choiceEditor = setupComponentUnderTest(defaultChoiceObject);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent(
                'description',
                'new desc',
                null
            );
            choiceEditor.shadowRoot
                .querySelector('builder_platform_interaction-label-description')
                .dispatchEvent(event);
            expect(createAction).toHaveBeenCalledWith(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                {
                    propertyName: 'description',
                    value: 'new desc',
                    error: null
                }
            );
        });
    });

    describe('Handles on change for Choice Text input field', () => {
        let choiceEditor;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(defaultChoiceObject);
        });

        it('When input is valid', () => {
            const previousXMLSerializer = window.XMLSerializer;
            try {
                const newValue = 'newValue';
                window.XMLSerializer = jest.fn(() => ({
                    serializeToString: () => newValue
                }));
                const choiceTextResourcedRichText = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.RESOURCE_RICH_TEXT_EDITOR
                );
                choiceTextResourcedRichText.dispatchEvent(
                    new CustomEvent('change', {
                        detail: {
                            value: newValue
                        }
                    })
                );

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'choiceText',
                        value: newValue,
                        error: null
                    }
                );
            } finally {
                window.XMLSerializer = previousXMLSerializer;
            }
        });

        it('When input is invalid', () => {
            const previousXMLSerializer = window.XMLSerializer;
            try {
                const newValue = '';
                window.XMLSerializer = jest.fn(() => ({
                    serializeToString: () => ''
                }));
                const choiceTextResourcedRichText = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.RESOURCE_RICH_TEXT_EDITOR
                );
                const lightningInputRichText = choiceTextResourcedRichText.shadowRoot.querySelector(
                    SELECTORS.LIGHTNING_INPUT_RICH_TEXT
                );
                lightningInputRichText.dispatchEvent(
                    new CustomEvent('change', {
                        detail: {
                            value: newValue
                        }
                    })
                );

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'choiceText',
                        value: newValue,
                        error: LABELS.cannotBeBlank
                    }
                );
            } finally {
                window.XMLSerializer = previousXMLSerializer;
            }
        });
    });

    describe('choice data type picker', () => {
        let choiceEditor;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(defaultChoiceObject);
        });

        const dispatchValueChangedEvent = (editor, payload) => {
            const dataTypePicker = editor.shadowRoot.querySelector(
                'builder_platform_interaction-data-type-picker'
            );
            const mockChangeEvent = new ValueChangedEvent(payload);
            dataTypePicker.dispatchEvent(mockChangeEvent);
        };

        it('Has a data type picker', () => {
            const dataTypePicker = choiceEditor.shadowRoot.querySelector(
                'lightning-combobox'
            );
            expect(dataTypePicker).toBeDefined();
        });

        it('Gives flow data type menu items to the data type combobox', () => {
            const dataTypePicker = choiceEditor.shadowRoot
                .querySelector('builder_platform_interaction-data-type-picker')
                .shadowRoot.querySelector('lightning-combobox');
            expect(dataTypePicker.options).toHaveLength(5);
        });

        it('Handles change event when data type option is selected', () => {
            const eventPayload = { dataType: 'Number' };
            dispatchValueChangedEvent(choiceEditor, eventPayload);
            expect(createAction).toHaveBeenCalledWith(
                PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE,
                { value: eventPayload }
            );
        });

        describe('Clears the default value when switching data type', () => {
            beforeEach(() => {
                defaultChoiceObject.storedValue = 'mock default value';
                const eventPayload = { dataType: 'Number' };
                dispatchValueChangedEvent(choiceEditor, eventPayload);
            });

            it('storedValue should get updated', () => {
                expect(createAction.mock.calls[1][1].propertyName).toEqual(
                    'storedValue'
                );
            });

            it('storedValue should be updated to null', () => {
                expect(createAction.mock.calls[1][1].value).toEqual(null);
            });
        });
    });

    describe('Default value combobox', () => {
        it('should call getFerovInfoAndErrorFromEvent to get the ferov data type of new combobox value', () => {
            const choiceEditor = setupComponentUnderTest(defaultChoiceObject);
            const selectedMenuItem = {
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
                displayText: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}'
            };
            const mockFerovInfo = {
                dataType: FEROV_DATA_TYPE.BOOLEAN,
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
                error: null
            };
            getResourceByUniqueIdentifier.mockReturnValueOnce({});
            getFerovInfoAndErrorFromEvent.mockReturnValueOnce(mockFerovInfo);

            const valueChangedEvent = new ComboboxStateChangedEvent(
                selectedMenuItem,
                null,
                null
            );
            const flowCombobox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.FEROV_RESOURCE_PICKER
            );
            flowCombobox.dispatchEvent(valueChangedEvent);
            expect(getFerovInfoAndErrorFromEvent).toHaveBeenCalledWith(
                valueChangedEvent,
                defaultChoiceObject.dataType.value
            );
            expect(createAction).toHaveBeenCalledWith(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                {
                    propertyName: STORED_VALUE_DATA_TYPE_PROPERTY,
                    value: mockFerovInfo.dataType,
                    error: null
                }
            );
        });
    });

    describe('inputSelection checkbox', () => {
        let choiceEditor;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(defaultChoiceObject);
        });

        describe('When inputSelection checkbox is checked', () => {
            let checked;
            let inputSelectionCheckbox;
            beforeEach(() => {
                checked = true;
                inputSelectionCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.INPUT_SELECTION_CHECKBOX
                );
                inputSelectionCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );
            });

            const userInputPayload = {
                propertyName: 'userInput',
                value: {
                    isRequired: false,
                    promptText: {
                        value: null,
                        error: null
                    },
                    validationRule: undefined
                },
                error: null
            };

            it('updateElementProperty action should be fired with the right values', () => {
                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isShowInputSelected',
                        value: checked,
                        error: null
                    }
                );
            });

            it('isShowInputSelected should be set to true', () => {
                expect(choiceReducer.mock.calls[0][1]).toEqual({
                    propertyName: 'isShowInputSelected',
                    value: true,
                    error: null
                });
            });

            it('userInput object should have the right structure', () => {
                expect(choiceReducer.mock.calls[1][1]).toEqual(
                    userInputPayload
                );
            });
        });

        describe('When inputSelection checkbox is unchecked', () => {
            let checked;
            let inputSelectionCheckbox;
            beforeEach(() => {
                checked = false;
                inputSelectionCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.INPUT_SELECTION_CHECKBOX
                );
                inputSelectionCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );
            });

            it('updateElementProperty action should be fired with the right values', () => {
                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isShowInputSelected',
                        value: checked,
                        error: null
                    }
                );
            });

            it('isShowInputSelected should be set to false', () => {
                expect(choiceReducer.mock.calls[0][1]).toEqual({
                    propertyName: 'isShowInputSelected',
                    value: false,
                    error: null
                });
            });

            it('isValidateSelected property should be set to false', () => {
                expect(choiceReducer.mock.calls[1][1]).toEqual({
                    propertyName: 'isValidateSelected',
                    value: false,
                    error: null
                });
            });

            it('userInput property should be set to undefined', () => {
                expect(choiceReducer.mock.calls[2][1]).toEqual({
                    propertyName: 'userInput',
                    value: undefined,
                    error: null
                });
            });
        });
    });

    describe('UserInput section', () => {
        let choiceEditor;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(userInputChoiceObject);
        });

        it('inputSelection checkbox should show up', () => {
            const inputSelectionCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.INPUT_SELECTION_CHECKBOX
            );
            expect(inputSelectionCheckbox).toBeDefined();
        });

        it('inputSelection checkbox should be checked', () => {
            const inputSelectionCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.INPUT_SELECTION_CHECKBOX
            );
            expect(inputSelectionCheckbox.checked).toBeTruthy();
        });

        it('promptText input field should show up', () => {
            const promptTextInput = choiceEditor.shadowRoot.querySelector(
                SELECTORS.PROMPT_TEXT
            );
            expect(promptTextInput).toBeDefined();
        });

        it('Required field should show up', () => {
            const requiredCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.REQUIRED_CHECKBOX
            );
            expect(requiredCheckbox).toBeDefined();
        });

        it('Required field should be checked', () => {
            const requiredCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.REQUIRED_CHECKBOX
            );
            expect(requiredCheckbox.checked).toBeTruthy();
        });

        it('Validate field should show up', () => {
            const validateCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.VALIDATE_CHECKBOX
            );
            expect(validateCheckbox).toBeDefined();
        });

        it('Validate should not be checked', () => {
            const validateCheckbox = choiceEditor.shadowRoot.querySelector(
                SELECTORS.VALIDATE_CHECKBOX
            );
            expect(validateCheckbox.checked).toBeFalsy();
        });

        describe('Handles focus out for Prompt Text input field', () => {
            it('When input is valid', () => {
                const newValue = 'newValue';
                const promptTextInput = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.PROMPT_TEXT
                );
                promptTextInput.value = newValue;
                promptTextInput.dispatchEvent(focusoutEvent);

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'promptText',
                        value: newValue,
                        error: null
                    }
                );
            });

            it('When input is invalid', () => {
                const newValue = '';
                const promptTextInput = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.PROMPT_TEXT
                );
                promptTextInput.value = newValue;
                promptTextInput.dispatchEvent(focusoutEvent);

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'promptText',
                        value: newValue,
                        error: LABELS.cannotBeBlank
                    }
                );
            });
        });

        describe('Handles on blur for Prompt Text input field', () => {
            it('When input contains a p tag at the beginning', () => {
                const choiceObject = {
                    choiceText: { value: '<p>my value</p>', error: null },
                    dataType: 'String',
                    description: 'Desc',
                    elementType: 'CHOICE',
                    guid: 'guid1',
                    isShowInputSelected: true,
                    isValidateSelected: false,
                    name: 'choice1',
                    storedValue: 'storedValue',
                    storedValueIndex: {
                        value: 'guid',
                        error: null
                    },
                    userInput: {
                        promptText: 'promptText',
                        isRequired: true,
                        validationRule: undefined
                    }
                };
                choiceEditor = setupComponentUnderTest(choiceObject);
                const choiceTextResourcedRichText = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.RESOURCE_RICH_TEXT_EDITOR
                );

                choiceTextResourcedRichText.dispatchEvent(blurEvent);

                expect(choiceEditor.getNode().choiceText.value).toBe(
                    'my value'
                );
            });
            it('When input contains a p tag in the middle', () => {
                const choiceObject = {
                    choiceText: { value: 'my <p>value</p>', error: null },
                    dataType: 'String',
                    description: 'Desc',
                    elementType: 'CHOICE',
                    guid: 'guid1',
                    isShowInputSelected: true,
                    isValidateSelected: false,
                    name: 'choice1',
                    storedValue: 'storedValue',
                    storedValueIndex: {
                        value: 'guid',
                        error: null
                    },
                    userInput: {
                        promptText: 'promptText',
                        isRequired: true,
                        validationRule: undefined
                    }
                };
                choiceEditor = setupComponentUnderTest(choiceObject);
                const choiceTextResourcedRichText = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.RESOURCE_RICH_TEXT_EDITOR
                );

                choiceTextResourcedRichText.dispatchEvent(blurEvent);

                expect(choiceEditor.getNode().choiceText.value).toBe(
                    'my <p>value</p>'
                );
            });
        });

        describe('isRequired checkbox', () => {
            it('When isRequired checkbox is checked', () => {
                const checked = true;
                const isRequiredCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.REQUIRED_CHECKBOX
                );
                isRequiredCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isRequired',
                        value: checked,
                        error: null
                    }
                );
            });

            it('When isRequired checkbox is unchecked', () => {
                const checked = false;
                const isRequiredCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.REQUIRED_CHECKBOX
                );
                isRequiredCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );

                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isRequired',
                        value: checked,
                        error: null
                    }
                );
            });
        });
    });

    describe('isValidate checkbox', () => {
        let choiceEditor;
        beforeEach(() => {
            choiceEditor = setupComponentUnderTest(userInputChoiceObject);
        });

        describe('When isValidate checkbox is checked', () => {
            let checked;
            let isValidateCheckbox;
            beforeEach(() => {
                checked = true;
                isValidateCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.VALIDATE_CHECKBOX
                );
                isValidateCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );
            });

            const validationRulePayload = {
                propertyName: 'validationRule',
                value: {
                    errorMessage: {
                        value: '',
                        error: null
                    },
                    formulaExpression: {
                        value: '',
                        error: null
                    }
                },
                error: null
            };

            it('isValidateSelected should be updated to true', () => {
                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isValidateSelected',
                        value: checked,
                        error: null
                    }
                );
            });

            it('validationRule object should have the right structure', () => {
                expect(choiceReducer.mock.calls[2][1]).toEqual(
                    validationRulePayload
                );
            });
        });

        describe('When isValidate checkbox is unchecked', () => {
            let checked;
            let isValidateCheckbox;
            beforeEach(() => {
                checked = false;
                isValidateCheckbox = choiceEditor.shadowRoot.querySelector(
                    SELECTORS.VALIDATE_CHECKBOX
                );
                isValidateCheckbox.dispatchEvent(
                    new CustomEvent('change', { detail: { checked } })
                );
            });

            it('isValidateSelected should be updated to false', () => {
                expect(createAction).toHaveBeenCalledWith(
                    PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                    {
                        propertyName: 'isValidateSelected',
                        value: checked,
                        error: null
                    }
                );
            });

            it('validationRule should be set to undefined', () => {
                expect(choiceReducer.mock.calls[2][1]).toEqual({
                    propertyName: 'validationRule',
                    value: undefined,
                    error: null
                });
            });
        });
    });

    describe('validationRule section', () => {
        it('Validation-Editor should show up', () => {
            const choiceEditor = setupComponentUnderTest(
                validationRuleChoiceObject
            );
            const validationEditor = choiceEditor.shadowRoot.querySelector(
                SELECTORS.VALIDATION_EDITOR
            );
            expect(validationEditor).toBeDefined();
        });
    });

    describe('Validation', () => {
        it('Calls reducer with validate all event', () => {
            const choiceEditor = setupComponentUnderTest(
                validationRuleChoiceObject
            );
            choiceEditor.validate();
            expect(choiceReducer.mock.calls[1][1]).toEqual({
                type: VALIDATE_ALL
            });
        });
    });
});
