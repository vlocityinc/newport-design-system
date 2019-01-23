import {createElement} from 'lwc';
import LoopEditor from "builder_platform_interaction/loopEditor";
import { getShadowRoot } from 'lwc-test-utils';
import {
    stringCollectionVariable1DevName,
    stringCollectionVariable1Guid,
    stringVariableDevName,
    stringVariableGuid,
    accountSObjectCollectionVariableDevName,
    accountSObjectCollectionVariableGuid,
    accountSObjectVariableDevName,
    accountSObjectVariableGuid,
    caseSObjectCollectionVariableDevName,
} from "mock/storeData";
import { resolveRenderCycles} from '../resolveRenderCycles';

jest.mock('builder_platform_interaction/storeLib', () => {
    const mockStoreLib = require('builder_platform_interaction_mocks/storeLib');
    const originalCreateSelector = require.requireActual('builder_platform_interaction/storeLib').createSelector;
    const partialStoreLibMock = Object.assign({}, mockStoreLib);
    partialStoreLibMock.createSelector = originalCreateSelector;

    return partialStoreLibMock;
});

const SELECTORS = {
    COLLECTION_VARIABLE: '.test-loop-collection',
    LOOP_VARIABLE: '.test-loop-variable',
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker',
    COMBOBOX: 'builder_platform_interaction-combobox',
    LIGHTNING_COMBOBOX: 'lightning-grouped-combobox',
    LABEL_DESCRIPTION_COMPONENT: 'builder_platform_interaction-label-description',
    LABEL: '.label',
    DEV_NAME: '.devName'
};

/**
 * Error message map for validation of literal value.
 *
 * Note that some of the labels here are not the actual labels, but rather the '<section_name.key_name>'.
 * This is due to the fact that we are importing labels via a Global Value Provider (GVP) and the
 * test runner returns default values for those imports. See the following for more info:
 *
 * http://raptor.sfdc.es/guide/testing-core.html#Handling-GVP-Imports
 */
const VALIDATION_ERROR_MESSAGES = {
    GENERIC : 'FlowBuilderCombobox.genericErrorMessage',
    DATATYPE_MISMATCH: 'FlowBuilderLoopEditor.loopVariableErrorMessage',
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
};

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

const blurEvent = new FocusEvent('blur', {
    'bubbles'   : true,
    'cancelable': true,
});

const focusEvent = new FocusEvent('focus', {
    'bubbles'   : true,
    'cancelable': true,
});

const textInputEvent = (textInput) => {
    return new CustomEvent('textinput', {
        'bubbles'   : true,
        'cancelable': true,
        detail: { text: textInput },
    });
};

const TEST_LOOP_NAME = 'test loop name';
const TEST_LOOP_DEV_NAME = 'test_loop_dev_name';

let loopForTesting;
let emptyLoopForTesting;

const itSkip = it.skip;

beforeEach(() => {
    loopForTesting = {
        label : {value: TEST_LOOP_NAME, error: null},
        name : {value: TEST_LOOP_DEV_NAME, error: null},
        description : {value: 'test loop description', error: null},
        collectionReference: {value: stringCollectionVariable1Guid, error: null},
        assignNextValueToReference: {value: stringVariableGuid, error: null},
        iterationOrder: {value:'Asc', error: null },
        elementType : 'LOOP',
        guid : 'LOOP_1'
    };
    emptyLoopForTesting = {
        label : {value: '', error: null},
        name : {value: '', error: null},
        description : {value: '', error: null},
        collectionReference: {value: null, error: null},
        assignNextValueToReference: {value: null, error: null},
        config: {isSelected: false},
        elementType : 'LOOP',
        guid : 'LOOP_2'
    };
});

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-loop-editor', { is: LoopEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const getLoopVariableComboboxElement = (loop) => {
    const loopVariable = getShadowRoot(loop).querySelector(SELECTORS.LOOP_VARIABLE);
    const resourcePicker = getShadowRoot(loopVariable).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const combobox = getShadowRoot(resourcePicker).querySelector(SELECTORS.COMBOBOX);
    const lightningGroupCombobox = getShadowRoot(combobox).querySelector(SELECTORS.LIGHTNING_COMBOBOX);
    return lightningGroupCombobox;
};

const getCollectionVariableComboboxElement = (loop) => {
    const collectionVariable = getShadowRoot(loop).querySelector(SELECTORS.COLLECTION_VARIABLE);
    const resourcePicker = getShadowRoot(collectionVariable).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const combobox = getShadowRoot(resourcePicker).querySelector(SELECTORS.COMBOBOX);
    const lightningGroupCombobox = getShadowRoot(combobox).querySelector(SELECTORS.LIGHTNING_COMBOBOX);
    return lightningGroupCombobox;
};


describe('Loop Editor', () => {
    describe('name and dev name', () => {
        it('after the user modifies the name, the dev name is not changed if it already exists', () => {
            const newLoopName = 'new loop name!';
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const labelInput = getShadowRoot(getShadowRoot(loopElement).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                labelInput.mockUserInput(newLoopName);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    // Only the label is updated, the dev name stays the same
                    expect(loopElement.node.label.value).toBe(newLoopName);
                    expect(loopElement.node.name.value).toBe(TEST_LOOP_DEV_NAME);
                });
            });
        });
        it('after the user modifies the name, an empty dev name is auto-updated', () => {
            const newLoopName = 'new loop name!';
            const newLoopAutopopulatedDevName = 'new_loop_name';
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const labelInput = getShadowRoot(getShadowRoot(loopElement).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                labelInput.mockUserInput(newLoopName);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    // Both label and the dev name are updated
                    expect(loopElement.node.label.value).toBe(newLoopName);
                    expect(loopElement.node.name.value).toBe(newLoopAutopopulatedDevName);
                });
            });
        });
    });
    describe('loop variable', () => {
        it('is correctly loaded, with no error, for an existing loop', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                expect(loopVariableLightningCombobox.inputText).toBe('{!' + stringVariableDevName + '}');
                expect(loopVariableLightningCombobox.validity).toBeFalsy();
            });
        });
        it('is disabled when creating a new loop', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                // collection variable is enabled
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                expect(colVariableLightningCombobox.disabled).toBeFalsy();
                // loop variable is disabled initially when a new loop is
                // created
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                expect(loopVariableLightningCombobox.disabled).toBeTruthy();
            });
        });
        it('is enabled after the collection variable is set to a valid value', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + stringCollectionVariable1DevName + '}'));
                return resolveRenderCycles(() => {
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        // loop variable should be enabled now
                        const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                        expect(loopVariableLightningCombobox.disabled).toBeFalsy();
                    });
                });
            });
        });
        it('is still disabled after the collection variable is set to an invalid value', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
                colVariableLightningCombobox.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    // loop variable should be still disabled
                    const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                    expect(loopVariableLightningCombobox.disabled).toBeTruthy();
                });
            });
        });
        it('becomes disabled after the collection variable is set from a valid value to an invalid one', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                // first check that the loop variable is enabled
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                expect(loopVariableLightningCombobox.disabled).toBeFalsy();
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
                colVariableLightningCombobox.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    // loop variable should be disabled now
                    expect(loopVariableLightningCombobox.disabled).toBeTruthy();
                });
            });
        });

        itSkip('shows only variables of the same type as the collection variable', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                return resolveRenderCycles(() => {
                    // initially the loop variable has only the "New Resource" in the menu data
                    expect(loopVariableLightningCombobox.items).toHaveLength(1);
                    colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + stringCollectionVariable1DevName + '}'));
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                                // loop variable should only show variables with dataType of String
                                expect(loopVariableLightningCombobox.items).toHaveLength(2);
                                expect(loopVariableLightningCombobox.items[1].label).toBe('FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL');
                                expect(loopVariableLightningCombobox.items[1].items).toHaveLength(1);
                                expect(loopVariableLightningCombobox.items[1].items[0].text).toBe(stringVariableDevName);
                                expect(loopVariableLightningCombobox.items[1].items[0].subText).toBe('String');
                                expect(loopVariableLightningCombobox.items[1].items[0].displayText).toBe('{!' + stringVariableDevName + '}');
                                expect(loopVariableLightningCombobox.items[1].items[0].value).toBe(stringVariableGuid);
                            });
                });
            });
        });
        it('shows an error when its data type is different from the data type in the collection variable', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                return resolveRenderCycles(() => {
                    // Switch collection variable from a string type variable
                    // to a sObject type variable
                    colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accountSObjectCollectionVariableDevName + '}'));
                    return resolveRenderCycles(() => {
                        colVariableLightningCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            // loop variable should keep the previous value but show a
                            // data mismatch error
                            expect(loopVariableLightningCombobox.inputText).toBe('{!' + stringVariableDevName + '}');
                            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
                        });
                    });
                });
            });
        });
        it('shows only sObject variables of the same type as the sObject selected in the collection variable', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accountSObjectCollectionVariableDevName + '}'));
                return resolveRenderCycles(() => {
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        // loop variable should only show variables with dataType of String
                        expect(loopVariableLightningCombobox.items).toHaveLength(2);
                        expect(loopVariableLightningCombobox.items[1].label).toBe('FLOWBUILDERELEMENTCONFIG.SOBJECTVARIABLEPLURALLABEL');
                        expect(loopVariableLightningCombobox.items[1].items).toHaveLength(1);
                        expect(loopVariableLightningCombobox.items[1].items[0].dataType).toBe('SObject');
                        expect(loopVariableLightningCombobox.items[1].items[0].subtype).toBe('Account');
                        expect(loopVariableLightningCombobox.items[1].items[0].text).toBe(accountSObjectVariableDevName);
                        expect(loopVariableLightningCombobox.items[1].items[0].subText).toBe('Account');
                        expect(loopVariableLightningCombobox.items[1].items[0].displayText).toBe('{!' + accountSObjectVariableDevName + '}');
                        expect(loopVariableLightningCombobox.items[1].items[0].value).toBe(accountSObjectVariableGuid);
                    });
                });
            });
        });
        it('shows an error when its sObject type is different from the sObject type in the collection variable', () => {
            const loopWithSobjectForTesting = {
                label : {value: TEST_LOOP_NAME, error: null},
                name : {value: TEST_LOOP_DEV_NAME, error: null},
                description : {value: 'test loop description', error: null},
                collectionReference: {value: accountSObjectCollectionVariableGuid, error: null},
                assignNextValueToReference: {value: accountSObjectVariableGuid, error: null},
                iterationOrder: {value:'Asc', error: null },
                elementType : 'LOOP',
                guid : 'LOOP_3'
            };
            const loopElement = createComponentForTest(loopWithSobjectForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                return resolveRenderCycles(() => {
                    // Switch collection variable from an Account sObject type variable
                    //  to a Case sObject type variable
                    colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + caseSObjectCollectionVariableDevName + '}'));
                    return resolveRenderCycles(() => {
                        colVariableLightningCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            // loop variable should keep the previous value but show a
                            // data mismatch error
                            expect(loopVariableLightningCombobox.inputText).toBe('{!' + accountSObjectVariableDevName + '}');
                            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
                        });
                    });
                });
            });
        });
        it('shows an error if the user deletes the value of the variable', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                loopVariableLightningCombobox.dispatchEvent(textInputEvent(''));
                return resolveRenderCycles(() => {
                    loopVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(loopVariableLightningCombobox.inputText).toBe('');
                        expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                    });
                });
            });
        });
        itSkip('clears the datatype mismatch error when the invalid value is corrected', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                return resolveRenderCycles(() => {
                    // Switch collection variable from a string type variable
                    // to a sObject type variable
                    colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accountSObjectCollectionVariableDevName + '}'));
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        // loop variable should keep the previous value but show a
                        // data mismatch error
                        expect(loopVariableLightningCombobox.inputText).toBe('{!' + stringVariableDevName + '}');
                        expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);

                        // User corrects the invalid value
                        loopVariableLightningCombobox.dispatchEvent(focusEvent);
                        return resolveRenderCycles(() => {
                            loopVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accountSObjectVariableDevName + '}'));
                            loopVariableLightningCombobox.dispatchEvent(blurEvent);
                            return resolveRenderCycles(() => {
                                expect(loopVariableLightningCombobox.validity).toBeFalsy();
                            });
                        });
                    });
                });
            });
        });
        it('maintains a datatype mismatch error after the user clicks in and out of the box - W-5143108', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                return resolveRenderCycles(() => {
                    // Switch collection variable from a string type variable
                    // to a sObject type variable
                    colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accountSObjectCollectionVariableDevName + '}'));
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        // loop variable shows a data type mismatch error
                        expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);

                        // The error is still there after the user clicks outside the combobox
                        loopVariableLightningCombobox.click();
                        loopVariableLightningCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
                        });
                    });
                });
            });
        });
    });
    describe('collection variable', () => {
        it('is correctly loaded, with no error, for an existing loop', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                expect(colVariableLightningCombobox.inputText).toBe('{!' + stringCollectionVariable1DevName + '}');
                expect(colVariableLightningCombobox.validity).toBeFalsy();
            });
        });
        it('shows only collection variables in dropdown', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.click();
                return resolveRenderCycles(() => {
                    expect(colVariableLightningCombobox.items).toHaveLength(3);
                    expect(colVariableLightningCombobox.items[1].label).toBe('FLOWBUILDERELEMENTCONFIG.COLLECTIONVARIABLEPLURALLABEL');
                    // There are 3 non-sObject variables with 'isCollection: true' in the mock-store data
                    expect(colVariableLightningCombobox.items[1].items).toHaveLength(3);
                    expect(colVariableLightningCombobox.items[1].items[0].text).toBe(stringCollectionVariable1DevName);
                    expect(colVariableLightningCombobox.items[2].label).toBe('FLOWBUILDERELEMENTCONFIG.SOBJECTCOLLECTIONVARIABLEPLURALLABEL');
                    // There are 2 sObject collection variables in the mock-store data
                    expect(colVariableLightningCombobox.items[2].items).toHaveLength(2);
                    expect(colVariableLightningCombobox.items[2].items[0].text).toBe(accountSObjectCollectionVariableDevName);
                    expect(colVariableLightningCombobox.items[2].items[0].subText).toBe('Account');
                });
            });
        });
        it('updates the display text after the user changes the value of the variable to another valid value', () => {
            const loopElement = createComponentForTest(emptyLoopForTesting);
            return resolveRenderCycles(() => {
                const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + stringCollectionVariable1DevName + '}'));
                return resolveRenderCycles(() => {
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(colVariableLightningCombobox.inputText).toBe('{!' + stringCollectionVariable1DevName + '}');
                        expect(colVariableLightningCombobox.validity).toBeFalsy();
                    });
                });
            });
        });
        it('shows an error if the user deletes the value of the variable', () => {
            const loopElement = createComponentForTest(loopForTesting);
            return resolveRenderCycles(() => {
                return resolveRenderCycles(() => {
                    const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                    colVariableLightningCombobox.dispatchEvent(textInputEvent(''));
                    colVariableLightningCombobox.dispatchEvent(blurEvent);
                    return resolveRenderCycles(() => {
                        expect(colVariableLightningCombobox.inputText).toBe('');
                        expect(colVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                    });
                });
            });
        });
    });
});

