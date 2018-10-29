import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import OutputResourcePicker from '../outputResourcePicker';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getMenuData, getResourceByUniqueIdentifier, mutateFieldToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import { Store } from 'builder_platform_interaction/storeLib';

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-output-resource-picker', {
        is: OutputResourcePicker,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const expectedElementConfig = {
    elementType: ELEMENT_TYPE.VARIABLE,
    shouldBeWritable: true
};

const parentItem = {
    objectType: 'Account',
};

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        RULE_OPERATOR: require.requireActual('builder_platform_interaction/ruleLib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
        getOutputRules: jest.fn().mockReturnValue(['rule1']).mockName('getOutputRules'),
        getRHSTypes: jest.fn().mockReturnValue({paramType:'Data', dataType:'Currency', collection:false}).mockName('getRHSTypes'),
        elementToParam: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getMenuData: jest.fn().mockReturnValue(['ferovMenuData']).mockName('getMenuData'),
        getResourceByUniqueIdentifier: jest.fn(),
        mutateFlowResourceToComboboxShape: jest.fn(),
        mutateFieldToComboboxShape: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName, callback) => {
            callback(require.requireActual('mock/serverEntityData').mockAccountFields);
        }),
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
                const baseResourcePicker = getShadowRoot(outputResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
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
                const baseResourcePicker = getShadowRoot(outputResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
                expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
            });
        });
        it('has the value set', () => {
            props.value = 'testValue';
            const outputResourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const baseResourcePicker = getShadowRoot(outputResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
                expect(baseResourcePicker.value).toEqual(props.value);
            });
        });
    });

    it('retrieves fer menu data on initial load when value is fer', () => {
        props.value = 'foo';
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(expectedElementConfig, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                false, false, Store.getStore(), true, undefined, undefined, false);
        });
    });

    it('fetches the fields when requesting field menu data without field data', () => {
        props.value = {
            value: 'accVar.Name',
            parent: parentItem
        };
        getResourceByUniqueIdentifier.mockReturnValueOnce(parentItem);
        mutateFieldToComboboxShape.mockReturnValueOnce(props.value);
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(expectedElementConfig, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                false, false, Store.getStore(), true, parentItem, undefined, false);
        });
    });

    it('passes in enableFieldDrilldown to populateMenudata', () => {
        const enableFieldDrilldown = props.enableFieldDrilldown = true;
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(expectedElementConfig, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                false, enableFieldDrilldown, Store.getStore(), true, undefined, undefined, false);
        });
    });

    // TODO W-5528544: Update tests to not use normalizeLHS
    /* it('uses rule service and expression utils to retrieve fer data', () => {
        normalizeLHS.mockReturnValueOnce(getMockNormalizedValue(props));
        setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(getMenuData).toHaveBeenCalledWith(expectedElementConfig, ELEMENT_TYPE.VARIABLE, expect.any(Function),
                false, false, Store.getStore(), true, undefined, undefined);
        });
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', () => {
            normalizeLHS.mockReturnValueOnce(getMockNormalizedValue(props));
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const populateParamTypesFn = getMenuData.mock.calls[0][2];
                populateParamTypesFn();
                expect(getRHSTypes).toHaveBeenCalledWith(ELEMENT_TYPE.VARIABLE, { elementType: ELEMENT_TYPE.VARIABLE },
                    RULE_OPERATOR.ASSIGN, ['rule1']);
            });
        });
    });

    it('normalizes value when changing element config', () => {
        const outputResourcePicker = setupComponentUnderTest(props);

        props.elementConfig = { elementType: 'foo' };
        props.value = 'foobar';

        outputResourcePicker.comboboxConfig = props.elementConfig;
        outputResourcePicker.value = props.value;
        return Promise.resolve().then(() => {
            expect(normalizeLHS).toHaveBeenCalledWith(props.value);
        });
    });

    it('normalizes value when changing combobox config', () => {
        const outputResourcePicker = setupComponentUnderTest(props);

        props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;
        props.value = 'foobar';

        outputResourcePicker.comboboxConfig = props.comboboxConfig;
        outputResourcePicker.value = props.value;
        return Promise.resolve().then(() => {
            expect(normalizeLHS).toHaveBeenCalledWith(props.value);
        });
    });*/
});