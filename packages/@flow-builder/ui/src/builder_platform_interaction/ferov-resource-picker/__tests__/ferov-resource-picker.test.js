import { createElement } from 'engine';
import FerovResourcePicker from '../ferov-resource-picker';
import { getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

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

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        RULE_OPERATOR: require.requireActual('builder_platform_interaction-rule-lib').RULE_OPERATOR,
        RULE_PROPERTY_INFO: require.requireActual('builder_platform_interaction-rule-lib').RULE_PROPERTY_INFO,
        getRulesForContext: jest.fn().mockReturnValue([]).mockName('getRulesForContext'),
        getRHSTypes: jest.fn().mockReturnValue({paramType:'Data', dataType:'Currency', collection:false}).mockName('getRHSTypes')
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue(['ferovMenuData']).mockName('getElementsForMenuData')
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
            const baseResourcePicker = ferovResourcePicker.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker).toBeDefined();
        });
    });

    it('retrieves menu data on initial load', () => {
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getElementsForMenuData).toHaveBeenCalledWith({elementType: ELEMENT_TYPE.VARIABLE}, paramTypes, false);
        });
    });

    it('uses rule service and expression utils to retrieve ferov data', () => {
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getRulesForContext).toHaveBeenCalledTimes(1);
            expect(getRulesForContext).toHaveBeenLastCalledWith({elementType: ELEMENT_TYPE.VARIABLE});
            expect(getRHSTypes).toHaveBeenCalledTimes(1);
            expect(getRHSTypes).toHaveBeenLastCalledWith(ELEMENT_TYPE.VARIABLE, props.elementParam, RULE_OPERATOR.ASSIGN, expect.any(Array));
            expect(getElementsForMenuData).toHaveBeenCalledTimes(1);
            expect(getElementsForMenuData).toHaveBeenCalledWith({elementType: ELEMENT_TYPE.VARIABLE}, paramTypes, false);
        });
    });

    it('does not query rules and param types with elementConfig set', () => {
        const elementConfigProps = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementConfig: { element: ELEMENT_TYPE.VARIABLE, shouldBeWritable: false }
        };
        setupComponentUnderTest(elementConfigProps);
        return Promise.resolve().then(() => {
            expect(getRulesForContext).not.toHaveBeenCalled();
            expect(getRHSTypes).not.toHaveBeenCalled();
            expect(getElementsForMenuData).toHaveBeenCalledTimes(1);
            expect(getElementsForMenuData).toHaveBeenCalledWith(elementConfigProps.elementConfig, {}, false);
        });
    });

    it('sets the combobox config object of the base resource picker', () => {
        props.comboboxConfig = {
            label: 'test label'
        };
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = ferovResourcePicker.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
        });
    });

    it('sets the displayText of the base resource picker', () => {
        props.displayText = 'test display text';
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = ferovResourcePicker.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.displayText).toEqual(props.displayText);
        });
    });

    it('sets the value of the base resource picker', () => {
        props.value = { value: 'testValue', displayText: 'test display text'};
        const ferovResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = ferovResourcePicker.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });
});