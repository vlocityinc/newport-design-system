import { createElement } from 'lwc';
import FerovResourcePicker from '../ferovResourcePicker';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import {
    normalizeFEROV,
    getMenuData
} from 'builder_platform_interaction/expressionUtils';
import * as mockRuleLib from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from '../../dataTypeLib/dataTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    removeLastCreatedInlineResource,
    updateInlineResourceProperties
} from 'builder_platform_interaction/actions';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/loggingUtils', () => ({
    logInteraction: jest.fn()
}));

jest.mock('builder_platform_interaction/inlineResourceUtils', () => {
    return {
        getInlineResource: jest.fn(() => 'test resource')
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        removeLastCreatedInlineResource: jest.fn(),
        updateInlineResourceProperties: jest.fn(() => 'test response')
    };
});

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker'
};

const setupComponentUnderTest = props => {
    const element = createElement(
        'builder_platform_interaction-ferov-resource-picker',
        {
            is: FerovResourcePicker
        }
    );
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const parentItem = {
    objectType: 'Account'
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn()
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const mockParam = {
        paramType: 'Data',
        dataType: 'Currency',
        collection: false
    };
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        mockParam,
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        getRHSTypes: jest
            .fn()
            .mockReturnValue(mockParam)
            .mockName('getRHSTypes')
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getMenuData: jest
            .fn()
            .mockReturnValue([
                {
                    items: [
                        {
                            value: '1234'
                        }
                    ]
                }
            ])
            .mockName('getMenuData'),
        normalizeFEROV: jest.fn().mockImplementation(rhsId => {
            return require
                .requireActual('../../expressionUtils/expressionUtils.js')
                .normalizeFEROV(rhsId);
        })
    };
});

describe('ferov-resource-picker', () => {
    let props;

    beforeEach(() => {
        props = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementParam: { elementType: ELEMENT_TYPE.VARIABLE },
            comboboxConfig: { label: 'test label' }
        };
    });

    describe('base resource picker', () => {
        it('exists', () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                expect(baseResourcePicker).toBeDefined();
            });
        });

        it('has the combobox config object set', () => {
            props.comboboxConfig = {
                label: 'test label'
            };
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                expect(baseResourcePicker.comboboxConfig).toEqual(
                    props.comboboxConfig
                );
            });
        });

        it('has the value set as a string', () => {
            props.value = 'test display text';
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                expect(baseResourcePicker.value).toEqual(props.value);
            });
        });

        it('has the value set as an item', () => {
            props.value = {
                value: '{!testValue}',
                displayText: 'test display text'
            };
            normalizeFEROV.mockImplementationOnce(() => ({
                itemOrDisplayText: props.value
            }));
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                expect(baseResourcePicker.value).toEqual(props.value);
            });
        });
    });

    it('gets rules through an api property', () => {
        const mockRules = ['foo'];
        props.rules = mockRules;
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(ferovResourcePicker.rules).toEqual(mockRules);
        });
    });

    it('sets the rules to an empty array when not given an array', () => {
        props.rules = undefined;
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(ferovResourcePicker.rules).toEqual([]);
        });
    });

    it('retrieves ferov menu data on initial load when value is ferov', () => {
        props.value = 'foo';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                true,
                false,
                Store.getStore(),
                true,
                undefined,
                undefined,
                true,
                false
            );
        });
    });

    it('retrieves field menu data on initial load when value is sobject field', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: parentItem
            },
            fields: ['mockField']
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                true,
                false,
                Store.getStore(),
                true,
                parentItem,
                ['mockField'],
                true,
                false
            );
        });
    });

    it('fetches the fields when requesting field menu data without field data', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: parentItem
            },
            fields: undefined
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                true,
                false,
                Store.getStore(),
                true,
                parentItem,
                undefined,
                true,
                false
            );
        });
    });

    it('uses rule service and expression utils to retrieve ferov data', () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                true,
                false,
                Store.getStore(),
                true,
                undefined,
                undefined,
                true,
                false
            );
        });
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', () => {
            const normalizedValue = {
                itemOrDisplayText: {
                    value: props.value
                }
            };
            normalizeFEROV.mockReturnValueOnce(normalizedValue);
            const mockRules = ['rule1'];
            props.rules = mockRules;
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const populateParamTypesFn = getMenuData.mock.calls[0][2];
                populateParamTypesFn();
                expect(mockRuleLib.getRHSTypes).toHaveBeenCalledWith(
                    ELEMENT_TYPE.VARIABLE,
                    { elementType: ELEMENT_TYPE.VARIABLE },
                    mockRuleLib.RULE_OPERATOR.ASSIGN,
                    mockRules
                );
            });
        });
    });

    it('does not set param types with elementConfig set', () => {
        const elementConfigProps = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementConfig: {
                elementType: ELEMENT_TYPE.VARIABLE,
                shouldBeWritable: false
            }
        };
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(elementConfigProps);
        return Promise.resolve().then(() => {
            expect(mockRuleLib.getRHSTypes).not.toHaveBeenCalled();
            expect(getMenuData).toHaveBeenCalledWith(
                elementConfigProps.elementConfig,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                true,
                false,
                Store.getStore(),
                true,
                undefined,
                undefined,
                true,
                false
            );
        });
    });

    it('sends param types to the base picker when enableFieldDrilldown is true', () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        const mockRules = ['rule1'];
        props.rules = mockRules;
        props.comboboxConfig.enableFieldDrilldown = true;
        const ferovPicker = setupComponentUnderTest(props);
        const basePicker = ferovPicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );

        return Promise.resolve().then(() => {
            const populateParamTypesFn = getMenuData.mock.calls[0][2];
            populateParamTypesFn();
            return Promise.resolve().then(() => {
                expect(mockRuleLib.getRHSTypes).toHaveBeenCalled();
                expect(mockRuleLib.getRHSTypes.mock.results[0]).toEqual(
                    expect.any(Object)
                );
                expect(basePicker.allowedParamTypes).toEqual(
                    mockRuleLib.mockParam
                );
            });
        });
    });

    it('does not send param types to the base picker when enableFieldDrilldown is not set', () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        const mockRules = ['rule1'];
        props.rules = mockRules;
        const ferovPicker = setupComponentUnderTest(props);
        const basePicker = ferovPicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );

        return Promise.resolve().then(() => {
            const populateParamTypesFn = getMenuData.mock.calls[0][2];
            populateParamTypesFn();
            expect(mockRuleLib.getRHSTypes).toHaveBeenCalled();
            expect(mockRuleLib.getRHSTypes.mock.results[0]).toEqual(
                expect.any(Object)
            );
            expect(basePicker.allowedParamTypes).toEqual(null);
        });
    });

    it('normalizes value when changing element config', () => {
        const ferovResourcePicker = setupComponentUnderTest(props);

        props.elementConfig = { elementType: 'foo' };
        props.value = 'foobar';

        ferovResourcePicker.comboboxConfig = props.elementConfig;
        ferovResourcePicker.value = props.value;
        return Promise.resolve().then(() => {
            expect(normalizeFEROV).toHaveBeenCalledWith(props.value);
        });
    });

    it('normalizes value when changing combobox config', () => {
        const ferovResourcePicker = setupComponentUnderTest(props);

        props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;
        props.value = 'foobar';

        ferovResourcePicker.comboboxConfig = props.comboboxConfig;
        ferovResourcePicker.value = props.value;
        return Promise.resolve().then(() => {
            expect(normalizeFEROV).toHaveBeenCalledWith(props.value);
        });
    });
    describe('event handling', () => {
        const comboboxValue = {
            value: 'value'
        };
        const displayText = 'displayText';
        it('when combobox changes to valid item, item is stored', () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                baseResourcePicker.dispatchEvent(
                    new ComboboxStateChangedEvent(comboboxValue, displayText)
                );
                return Promise.resolve().then(() => {
                    expect(ferovResourcePicker.value).toMatchObject(
                        comboboxValue
                    );
                });
            });
        });
        it('when combobox changes to valid literal, literal is stored', () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                baseResourcePicker.dispatchEvent(
                    new ComboboxStateChangedEvent(null, displayText)
                );
                return Promise.resolve().then(() => {
                    expect(ferovResourcePicker.value).toEqual(displayText);
                });
            });
        });
        it('when resource picker is in an invalid state, displayText is stored even if combobox fires an item', () => {
            props.errorMessage = 'error';
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                    SELECTORS.BASE_RESOURCE_PICKER
                );
                baseResourcePicker.dispatchEvent(
                    new ComboboxStateChangedEvent(comboboxValue, displayText)
                );
                return Promise.resolve().then(() => {
                    expect(ferovResourcePicker.value).toEqual(displayText);
                });
            });
        });
    });
    describe('handles system & global variables', () => {
        beforeEach(() => {
            // if RHS doesn't exist, menu data isn't set
            normalizeFEROV.mockReturnValueOnce({ itemOrDisplayText: 'foo' });
        });
        it('defaults hideSystemVariables to false', () => {
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                expect(getMenuData).toHaveBeenCalledWith(
                    undefined,
                    ELEMENT_TYPE.VARIABLE,
                    expect.any(Function),
                    true,
                    false,
                    Store.getStore(),
                    true,
                    undefined,
                    undefined,
                    true,
                    false
                );
            });
        });
        it('defaults showGlobalVariables to false', () => {
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                expect(getMenuData).toHaveBeenCalledWith(
                    undefined,
                    ELEMENT_TYPE.VARIABLE,
                    expect.any(Function),
                    true,
                    false,
                    Store.getStore(),
                    true,
                    undefined,
                    undefined,
                    true,
                    false
                );
            });
        });
        it('passes along showSystemVariables setting', () => {
            props.hideSystemVariables = true;
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                expect(getMenuData).toHaveBeenCalledWith(
                    undefined,
                    ELEMENT_TYPE.VARIABLE,
                    expect.any(Function),
                    true,
                    false,
                    Store.getStore(),
                    true,
                    undefined,
                    undefined,
                    false,
                    false
                );
            });
        });
        it('passes along showGlobalVariables setting', () => {
            props.showGlobalVariables = true;
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                expect(getMenuData).toHaveBeenCalledWith(
                    undefined,
                    ELEMENT_TYPE.VARIABLE,
                    expect.any(Function),
                    true,
                    false,
                    Store.getStore(),
                    true,
                    undefined,
                    undefined,
                    true,
                    true
                );
            });
        });
    });
    describe('inline resource ', () => {
        function fetchMenuData() {
            return new CustomEvent('fetchmenudata', {
                detail: {
                    item: {
                        value: 'kl214fea-9c9a-45cf-b804-76fc6df47c23'
                    }
                }
            });
        }
        function handleAddInlineResource() {
            return new CustomEvent('addnewresource', {
                detail: {
                    position: 'left'
                }
            });
        }
        it('dispatches removeLastCreatedInlineResource when there is an inline resource and fetchMenuData is triggered', () => {
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47c2v';
            props.rowIndex = idx;
            const spy = Store.getStore().dispatch;

            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid:
                        '6f346269-409c-422e-9e8c-3898d16429tt'
                }
            });
            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector(
                'builder_platform_interaction-base-resource-picker'
            );
            picker.dispatchEvent(fetchMenuData());

            return Promise.resolve().then(() => {
                expect(spy).toHaveBeenCalledWith(
                    removeLastCreatedInlineResource
                );
            });
        });
        it('calls getMenuData when an inline resource is set and fetchMenuData is triggered', () => {
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47c23';
            props.rowIndex = idx;
            const menuDataSpy = getMenuData;
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid:
                        '6f346269-409c-422e-9e8c-3898d16429gg'
                }
            });
            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector(
                'builder_platform_interaction-base-resource-picker'
            );
            picker.dispatchEvent(fetchMenuData());
            return Promise.resolve().then(() => {
                expect(menuDataSpy).toHaveBeenCalled();
            });
        });
        it('dispaches response from updateInlineResourceProperties when dispatching addnewresource', () => {
            const updateInlineResourceSpy = updateInlineResourceProperties;
            const spy = Store.getStore().dispatch;

            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector(
                'builder_platform_interaction-base-resource-picker'
            );

            picker.dispatchEvent(handleAddInlineResource());
            return Promise.resolve().then(() => {
                expect(spy).toHaveBeenCalledWith('test response');
                expect(updateInlineResourceSpy).toHaveBeenCalled();
            });
        });
    });
});
