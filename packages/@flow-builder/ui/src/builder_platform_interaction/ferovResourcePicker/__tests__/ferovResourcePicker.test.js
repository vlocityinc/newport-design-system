import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import FerovResourcePicker from "../ferovResourcePicker";
import { normalizeRHS, getMenuData } from "builder_platform_interaction/expressionUtils";
import { getRulesForContext, getRHSTypes, RULE_OPERATOR } from "builder_platform_interaction/ruleLib";
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
        getRulesForContext: jest.fn().mockReturnValue(['rule1']).mockName('getRulesForContext'),
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

    it('contains a base resource picker', () => {
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker).toBeDefined();
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
            expect(getMenuData).toHaveBeenCalledWith(expect.any(Object), Store.getStore(), true, undefined, undefined);
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
            expect(getMenuData).toHaveBeenCalledWith(expect.any(Object), Store.getStore(), true,
                parentItem, ["mockField"]);
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
            expect(getMenuData).toHaveBeenCalledWith(expect.any(Object), Store.getStore(), true,
                parentItem, undefined);
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
            expect(getRulesForContext).toHaveBeenCalledTimes(1);
            expect(getRulesForContext).toHaveBeenLastCalledWith({ elementType: ELEMENT_TYPE.VARIABLE });
            expect(getMenuData).toHaveBeenCalledWith(expect.any(Object), Store.getStore(), true,
                undefined, undefined);
        });
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                ferovResourcePicker.populateParamTypes();
                expect(getRHSTypes).toHaveBeenCalledWith(ELEMENT_TYPE.VARIABLE, { elementType: ELEMENT_TYPE.VARIABLE },
                    RULE_OPERATOR.ASSIGN, ["rule1"]);
            });
        });
    });

    it('does not query rules and param types with elementConfig set', () => {
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
            expect(getRulesForContext).toHaveBeenCalledWith({ elementType: ELEMENT_TYPE.VARIABLE });
            expect(getRHSTypes).not.toHaveBeenCalled();
            expect(getMenuData).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), false,
                undefined, undefined);
        });
    });

    it('sets the combobox config object of the base resource picker', () => {
        props.comboboxConfig = {
            label: 'test label'
        };
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
        });
    });

    it('sets the value of the base resource picker as a string', () => {
        props.value = 'test display text';
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });

    it('sets the value of the base resource picker as an item', () => {
        props.value = { value: 'testValue', displayText: 'test display text'};
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.value).toEqual(props.value);
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