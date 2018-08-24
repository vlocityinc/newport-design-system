import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import FerovResourcePicker from '../ferov-resource-picker';
import { getElementsForMenuData, normalizeRHS, filterFieldsForChosenElement} from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { FLOW_DATA_TYPE } from "../../data-type-lib/data-type-lib";

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

const paramTypes = {
    paramType:'Data',
    dataType:'Currency',
    collection:false
};

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: jest.fn(),
    };
});

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        RULE_OPERATOR: require.requireActual('builder_platform_interaction-rule-lib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction-rule-lib').PARAM_PROPERTY,
        getRulesForContext: jest.fn().mockReturnValue([]).mockName('getRulesForContext'),
        getRHSTypes: jest.fn().mockReturnValue({paramType:'Data', dataType:'Currency', collection:false}).mockName('getRHSTypes')
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue(['ferovMenuData']).mockName('getElementsForMenuData'),
        normalizeRHS: jest.fn().mockReturnValue(Promise.resolve()),
        filterFieldsForChosenElement: jest.fn(),
    };
});

describe('ferov-resource-picker', () => {
    let props;

    beforeEach(() => {
        props = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementParam: { elementType: ELEMENT_TYPE.VARIABLE },
            comboboxConfig: { label: 'test label' },
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
            expect(getElementsForMenuData).toHaveBeenCalledWith({elementType: ELEMENT_TYPE.VARIABLE}, paramTypes,
                false, true, false
            );
        });
    });

    it('retrieves field menu data on initial load when value is sobject field', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: {
                    objectType: 'Account',
                },
            },
            fields: ['mockField'],
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(filterFieldsForChosenElement).toHaveBeenCalledWith(normalizedValue.itemOrDisplayText.parent, paramTypes,
                normalizedValue.fields, true, true
            );
        });
    });

    it('fetches the fields when requesting field menu data without field data', () => {
        props.value = 'accVar.Name';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
                parent: {
                    objectType: 'Account',
                },
            },
            fields: undefined,
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getFieldsForEntity).toHaveBeenCalledWith(normalizedValue.itemOrDisplayText.parent.objectType, expect.any(Function));
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
            expect(getRulesForContext).toHaveBeenLastCalledWith({elementType: ELEMENT_TYPE.VARIABLE});
            expect(getRHSTypes).toHaveBeenCalledTimes(1);
            expect(getRHSTypes).toHaveBeenLastCalledWith(ELEMENT_TYPE.VARIABLE, props.elementParam, RULE_OPERATOR.ASSIGN, expect.any(Array));
            expect(getElementsForMenuData).toHaveBeenCalledTimes(1);
            expect(getElementsForMenuData).toHaveBeenCalledWith({elementType: ELEMENT_TYPE.VARIABLE}, paramTypes, false, true, false);
        });
    });

    it('does not query rules and param types with elementConfig set', () => {
        const elementConfigProps = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementConfig: { element: ELEMENT_TYPE.VARIABLE, shouldBeWritable: false }
        };
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value,
            }
        };
        normalizeRHS.mockReturnValueOnce(Promise.resolve(normalizedValue));
        setupComponentUnderTest(elementConfigProps);
        return Promise.resolve().then(() => {
            expect(getRulesForContext).not.toHaveBeenCalled();
            expect(getRHSTypes).not.toHaveBeenCalled();
            expect(getElementsForMenuData).toHaveBeenCalledTimes(1);
            expect(getElementsForMenuData).toHaveBeenCalledWith(elementConfigProps.elementConfig, null, false, true, false);
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