import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import FerovResourcePicker from "../ferovResourcePicker";
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { normalizeRHS, getMenuData } from "builder_platform_interaction/expressionUtils";
import { getRHSTypes, RULE_OPERATOR } from "builder_platform_interaction/ruleLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "../../dataTypeLib/dataTypeLib";
import { Store } from 'builder_platform_interaction/storeLib';

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-ferov-resource-picker', {
        is: FerovResourcePicker,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const parentItem = {
    objectType: 'Account',
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        RULE_OPERATOR: require.requireActual('builder_platform_interaction/ruleLib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
        getRHSTypes: jest.fn().mockReturnValue({paramType:'Data', dataType:'Currency', collection:false}).mockName('getRHSTypes')
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getMenuData: jest.fn().mockReturnValue(['ferovMenuData']).mockName('getMenuData'),
        normalizeRHS: jest.fn().mockReturnValue(Promise.resolve()),
    };
});

describe('ferov-resource-picker', () => {
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
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
                expect(baseResourcePicker).toBeDefined();
            });
        });

        it('has the combobox config object set', () => {
            props.comboboxConfig = {
                label: 'test label'
            };
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
                expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
            });
        });

        it('has the value set as a string', () => {
            props.value = 'test display text';
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
                expect(baseResourcePicker.value).toEqual(props.value);
            });
        });

        it('has the value set as an item', () => {
            props.value = { value: 'testValue', displayText: 'test display text'};
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
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
                value: props.value,
            }
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(undefined, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                true, false, Store.getStore(), true, undefined, undefined);
        });
    });

    it('retrieves field menu data on initial load when value is sobject field', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: parentItem,
            },
            fields: ['mockField'],
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(undefined, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                true, false, Store.getStore(), true, parentItem, ["mockField"]);
        });
    });

    it('fetches the fields when requesting field menu data without field data', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: parentItem,
            },
            fields: undefined,
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(undefined, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                true, false, Store.getStore(), true, parentItem, undefined);
        });
    });

    it('uses rule service and expression utils to retrieve ferov data', () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
            }
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(undefined, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                true, false, Store.getStore(), true, undefined, undefined);
        });
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', () => {
            const normalizedValue = {
                itemOrDisplayText: {
                    value: props.value,
                }
            };
            normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
            const mockRules = ['rule1'];
            props.rules = mockRules;
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const populateParamTypesFn = getMenuData.mock.calls[0][2];
                populateParamTypesFn();
                expect(getRHSTypes).toHaveBeenCalledWith(ELEMENT_TYPE.VARIABLE, { elementType: ELEMENT_TYPE.VARIABLE },
                    RULE_OPERATOR.ASSIGN, mockRules);
            });
        });
    });

    it('does not set param types with elementConfig set', () => {
        const elementConfigProps = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementConfig: { elementType: ELEMENT_TYPE.VARIABLE, shouldBeWritable: false }
        };
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
            }
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(elementConfigProps);
        return Promise.resolve().then(() => {
            expect(getRHSTypes).not.toHaveBeenCalled();
            expect(getMenuData).toHaveBeenCalledWith(elementConfigProps.elementConfig, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                true, false, Store.getStore(), false, undefined, undefined);
        });
    });

    it('does not send param types to the base picker when disableFieldDrilldown is true', () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
            }
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        const mockRules = ['rule1'];
        props.rules = mockRules;
        props.disableFieldDrilldown = true;
        const ferovPicker = setupComponentUnderTest(props);
        const basePicker = getShadowRoot(ferovPicker).querySelector(BaseResourcePicker.SELECTOR);

        return Promise.resolve().then(() => {
            const populateParamTypesFn = getMenuData.mock.calls[0][2];
            populateParamTypesFn();
            expect(getRHSTypes).toHaveBeenCalled();
            expect(getRHSTypes.mock.results[0]).toEqual(expect.any(Object));
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
            expect(normalizeRHS).toHaveBeenCalledWith(props.value);
        });
    });

    it('normalizes value when changing combobox config', () => {
        const ferovResourcePicker = setupComponentUnderTest(props);

        props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;
        props.value = 'foobar';

        ferovResourcePicker.comboboxConfig = props.comboboxConfig;
        ferovResourcePicker.value = props.value;
        return Promise.resolve().then(() => {
            expect(normalizeRHS).toHaveBeenCalledWith(props.value);
        });
    });
});