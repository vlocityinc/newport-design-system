import { createElement } from 'lwc';
import OutputResourcePicker from '../outputResourcePicker';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getMenuData,
    getResourceByUniqueIdentifier,
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape
} from 'builder_platform_interaction/expressionUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    getRHSTypes,
    RULE_OPERATOR
} from 'builder_platform_interaction/ruleLib';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { retrieveResourceComplexTypeFields } from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const setupComponentUnderTest = props => {
    const element = createElement(
        'builder_platform_interaction-output-resource-picker',
        {
            is: OutputResourcePicker
        }
    );
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const expectedElementConfig = {
    elementType: ELEMENT_TYPE.VARIABLE,
    shouldBeWritable: true
};

const parentRecordVar = {
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
    subtype: 'Account'
};

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        getOutputRules: jest
            .fn()
            .mockReturnValue(['rule1'])
            .mockName('getOutputRules'),
        getRHSTypes: jest
            .fn()
            .mockReturnValue({
                paramType: 'Data',
                dataType: 'Currency',
                collection: false
            })
            .mockName('getRHSTypes'),
        elementToParam: jest.fn()
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getMenuData: jest
            .fn()
            .mockReturnValue(['ferovMenuData'])
            .mockName('getMenuData'),
        getResourceByUniqueIdentifier: jest.fn(),
        mutateFlowResourceToComboboxShape: jest.fn(),
        mutateFieldToComboboxShape: jest.fn(),
        retrieveResourceComplexTypeFields: jest
            .fn()
            .mockImplementation(element => {
                return element.subtype === 'Account'
                    ? require('mock/serverEntityData').mockAccountFields
                    : undefined;
            })
    };
});

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        getPropertiesForClass: jest.fn().mockName('getPropertiesForClass')
    };
});

describe('output-resource-picker', () => {
    let props;

    beforeEach(() => {
        props = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementParam: { elementType: ELEMENT_TYPE.VARIABLE },
            comboboxConfig: { label: 'test label' },
            showNewResource: true
        };
    });

    describe('base resource picker', () => {
        it('exists', () => {
            const outputResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                    BaseResourcePicker.SELECTOR
                );
                expect(baseResourcePicker).toBeDefined();
            });
        });

        it('has the combobox config object set', () => {
            props.comboboxConfig = {
                label: 'test label',
                literalsAllowed: false,
                placeholder: 'FlowBuilderCombobox.outputPlaceholder'
            };
            const outputResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                    BaseResourcePicker.SELECTOR
                );
                expect(baseResourcePicker.comboboxConfig).toEqual(
                    props.comboboxConfig
                );
            });
        });
        it('has the value set', () => {
            props.value = 'testValue';
            const outputResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                    BaseResourcePicker.SELECTOR
                );
                expect(baseResourcePicker.value).toEqual(props.value);
            });
        });
    });

    describe('combobox state changed event handler', () => {
        let outputResourcePicker;
        const displayText = 'hello world';

        beforeEach(() => {
            outputResourcePicker = setupComponentUnderTest(props);
        });
        it('updates the value to the item if there is both item and display text', () => {
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            const itemPayload = { value: 'foo' };
            baseResourcePicker.dispatchEvent(
                new ComboboxStateChangedEvent(itemPayload, displayText)
            );
            return Promise.resolve().then(() => {
                expect(baseResourcePicker.value).toEqual(itemPayload);
            });
        });
        it('updates the value to the item if there is no display text', () => {
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            const itemPayload = { value: 'foo' };
            baseResourcePicker.dispatchEvent(
                new ComboboxStateChangedEvent(itemPayload)
            );
            return Promise.resolve().then(() => {
                expect(baseResourcePicker.value).toEqual(itemPayload);
            });
        });
        it('updates the value to the display text if there is no item', () => {
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            baseResourcePicker.dispatchEvent(
                new ComboboxStateChangedEvent(undefined, displayText)
            );
            return Promise.resolve().then(() => {
                expect(baseResourcePicker.value).toEqual(displayText);
            });
        });
    });

    it('retrieves fer menu data on initial load when value is fer', () => {
        props.value = 'foo';
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                expectedElementConfig,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                false,
                false,
                Store.getStore(),
                true,
                undefined
            );
        });
    });

    it('fetches the fields when requesting field menu data without field data', () => {
        props.value = {
            value: 'accVar.Name',
            parent: parentRecordVar
        };
        getResourceByUniqueIdentifier.mockReturnValueOnce(parentRecordVar);
        mutateFieldToComboboxShape.mockReturnValueOnce(props.value);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                expectedElementConfig,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                false,
                false,
                Store.getStore(),
                true,
                parentRecordVar
            );
        });
    });

    it('passes in enableFieldDrilldown to populateMenudata', () => {
        const enableFieldDrilldown = (props.comboboxConfig.enableFieldDrilldown = true);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                expectedElementConfig,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                false,
                enableFieldDrilldown,
                Store.getStore(),
                true,
                undefined
            );
        });
    });

    it('uses rule service and expression utils to retrieve fer data', () => {
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                expectedElementConfig,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                false,
                false,
                Store.getStore(),
                true,
                undefined
            );
        });
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', () => {
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const populateParamTypesFn = getMenuData.mock.calls[0][2];
                populateParamTypesFn();
                expect(getRHSTypes).toHaveBeenCalledWith(
                    ELEMENT_TYPE.VARIABLE,
                    { elementType: ELEMENT_TYPE.VARIABLE },
                    RULE_OPERATOR.ASSIGN,
                    ['rule1']
                );
            });
        });
    });

    describe('normalize', () => {
        it('normalizes value when changing value', () => {
            const outputResourcePicker = setupComponentUnderTest(props);

            const newValue = 'foobar';
            outputResourcePicker.value = newValue;
            return Promise.resolve().then(() => {
                expect(getResourceByUniqueIdentifier).toHaveBeenCalledWith(
                    newValue
                );
                expect(outputResourcePicker.value).toEqual(newValue);
                expect(
                    mutateFlowResourceToComboboxShape
                ).not.toHaveBeenCalled();
                expect(mutateFieldToComboboxShape).not.toHaveBeenCalled();
            });
        });

        it('normalizes value when changing combobox config', () => {
            const outputResourcePicker = setupComponentUnderTest(props);

            props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;

            outputResourcePicker.comboboxConfig = props.comboboxConfig;
            return Promise.resolve().then(() => {
                expect(getResourceByUniqueIdentifier).toHaveBeenCalledWith(
                    props.value
                );
                expect(outputResourcePicker.value).toEqual(props.value);
                expect(
                    mutateFlowResourceToComboboxShape
                ).not.toHaveBeenCalled();
                expect(mutateFieldToComboboxShape).not.toHaveBeenCalled();
            });
        });

        it('does not normalize when no fields exist for entity', () => {
            props.value = {
                value: 'someSobject.Name'
            };
            getResourceByUniqueIdentifier.mockReturnValueOnce(parentRecordVar);
            retrieveResourceComplexTypeFields.mockReturnValueOnce({});

            setupComponentUnderTest(props);

            return Promise.resolve().then(() => {
                expect(
                    mutateFlowResourceToComboboxShape
                ).not.toHaveBeenCalled();
                expect(mutateFieldToComboboxShape).not.toHaveBeenCalled();
            });
        });

        it('does not normalize when the field does not exist for the entity', () => {
            props.value = {
                value: 'someSobject.Name'
            };
            getResourceByUniqueIdentifier.mockReturnValueOnce(parentRecordVar);
            retrieveResourceComplexTypeFields.mockReturnValueOnce({
                Description: 'some field value'
            });

            setupComponentUnderTest(props);

            return Promise.resolve().then(() => {
                expect(
                    mutateFlowResourceToComboboxShape
                ).not.toHaveBeenCalled();
                expect(mutateFieldToComboboxShape).not.toHaveBeenCalled();
            });
        });

        describe('normalizing valid fields', () => {
            const fieldName = 'Name';
            let guid;
            let storeElement;

            const configureForGuid = g => {
                guid = g;
                props.value = {
                    value: `${guid}.${fieldName}`
                };
                storeElement = store.elements[guid];
                getResourceByUniqueIdentifier.mockReturnValueOnce(storeElement);
            };
            it('does not overwrite apex field isCollection values', () => {
                configureForGuid(store.apexSampleVariableGuid);
                mutateFieldToComboboxShape.mockImplementationOnce(
                    ({ isCollection }) => {
                        return {
                            isCollection
                        };
                    }
                );
                retrieveResourceComplexTypeFields.mockReturnValueOnce({
                    [fieldName]: {
                        isCollection: true
                    }
                });
                const outputResourcePicker = setupComponentUnderTest(props);

                return Promise.resolve().then(() => {
                    expect(outputResourcePicker.value.isCollection).toEqual(
                        true
                    );
                });
            });
            it('fetches property data when normalizing property on apex class', () => {
                const output = 'result';
                configureForGuid(store.apexSampleVariableGuid);
                mutateFieldToComboboxShape.mockReturnValueOnce(output);
                retrieveResourceComplexTypeFields.mockImplementationOnce(
                    element => {
                        if (element.subtype === storeElement.subtype) {
                            return {
                                [fieldName]: {
                                    apiName: 'aName'
                                }
                            };
                        }
                        return undefined;
                    }
                );
                const outputResourcePicker = setupComponentUnderTest(props);

                return Promise.resolve().then(() => {
                    expect(outputResourcePicker.value).toEqual(output);
                });
            });
        });
    });
});
