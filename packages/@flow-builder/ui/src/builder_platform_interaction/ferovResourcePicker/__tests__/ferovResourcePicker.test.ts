// @ts-nocheck
import { createElement } from 'lwc';
import FerovResourcePicker from '../ferovResourcePicker';
import { ComboboxStateChangedEvent, TextChangedEvent } from 'builder_platform_interaction/events';
import { normalizeFEROV, getMenuData } from 'builder_platform_interaction/expressionUtils';
import * as mockRuleLib from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { removeLastCreatedInlineResource, updateInlineResourceProperties } from 'builder_platform_interaction/actions';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/processTypeLib');
jest.mock('builder_platform_interaction/storeUtils');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/sharedUtils');
jest.mock('builder_platform_interaction/inlineResourceUtils', () => {
    return {
        getInlineResource: jest.fn(() => {
            return { guid: 'test guid' };
        })
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        removeLastCreatedInlineResource: jest.fn(),
        updateInlineResourceProperties: jest.fn(() => 'test response')
    };
});

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-ferov-resource-picker', {
        is: FerovResourcePicker
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
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
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');
    return {
        mockParam,
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        getRHSTypes: jest.fn().mockReturnValue(mockParam).mockName('getRHSTypes')
    };
});
jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getMenuData: jest
            .fn()
            .mockReturnValue(
                Promise.resolve([
                    {
                        displayText: 'New Resource',
                        text: 'New Resource',
                        value: '1234'
                    },
                    {
                        displayText: 'variable1',
                        text: 'variable1',
                        value: '5678'
                    }
                ])
            )
            .mockName('getMenuData'),
        normalizeFEROV: jest.fn().mockImplementation((rhsId) => {
            return jest.requireActual('builder_platform_interaction/expressionUtils').normalizeFEROV(rhsId);
        })
    };
});
const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

describe('ferov-resource-picker', () => {
    let props;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        isLookupTraversalSupported.mockImplementation(() => true);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        props = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementParam: { elementType: ELEMENT_TYPE.VARIABLE },
            comboboxConfig: { label: 'test label' }
        };
    });

    describe('base resource picker', () => {
        it('exists', async () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            expect(baseResourcePicker).toBeDefined();
        });

        it('has the combobox config object set', async () => {
            props.comboboxConfig = {
                label: 'test label'
            };
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
        });

        it('has the value set as a string', async () => {
            props.value = 'test display text';
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            expect(baseResourcePicker.value).toEqual(props.value);
        });

        it('has the value set as an item', async () => {
            props.value = {
                value: '{!testValue}',
                displayText: 'test display text'
            };
            normalizeFEROV.mockImplementationOnce(() => ({
                itemOrDisplayText: props.value
            }));
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });

    it('gets rules through an api property', async () => {
        const mockRules = ['foo'];
        props.rules = mockRules;
        const ferovResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        expect(ferovResourcePicker.rules).toEqual(mockRules);
    });

    it('sets the rules to an empty array when not given an array', async () => {
        props.rules = undefined;
        const ferovResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        expect(ferovResourcePicker.rules).toEqual([]);
    });

    it('retrieves ferov menu data on initial load when value is ferov', async () => {
        props.value = 'foo';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            undefined,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: true,
                enableFieldDrilldown: false,
                includeNewResource: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                forFormula: false,
                allowSObjectFieldsTraversal: true
            }
        );
    });

    it('retrieves field menu data on initial load when value is sobject field', async () => {
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
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            undefined,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            parentItem,
            ['mockField'],
            {
                allowGlobalConstants: true,
                enableFieldDrilldown: false,
                includeNewResource: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                forFormula: false,
                allowSObjectFieldsTraversal: true
            }
        );
    });

    it('fetches the fields when requesting field menu data without field data', async () => {
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
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            undefined,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            parentItem,
            undefined,
            {
                allowGlobalConstants: true,
                enableFieldDrilldown: false,
                includeNewResource: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                forFormula: false,
                allowSObjectFieldsTraversal: true
            }
        );
    });

    it('uses rule service and expression utils to retrieve ferov data', async () => {
        const normalizedValue = {
            itemOrDisplayText: {
                value: 'value123'
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        setupComponentUnderTest(props);
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            undefined,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: true,
                enableFieldDrilldown: false,
                includeNewResource: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                forFormula: false,
                allowSObjectFieldsTraversal: true
            }
        );
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', async () => {
            props.value = 'test';
            const normalizedValue = {
                itemOrDisplayText: {
                    value: props.value
                }
            };
            normalizeFEROV.mockReturnValueOnce(normalizedValue);
            const mockRules = ['rule1'];
            props.rules = mockRules;
            setupComponentUnderTest(props);
            await ticks(1);
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

    it('does not set param types with elementConfig set', async () => {
        props.value = 'test';
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
        await ticks(1);
        expect(mockRuleLib.getRHSTypes).not.toHaveBeenCalled();
        expect(getMenuData).toHaveBeenCalledWith(
            elementConfigProps.elementConfig,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: true,
                enableFieldDrilldown: false,
                includeNewResource: true,
                showSystemVariables: true,
                showGlobalVariables: true,
                forFormula: false,
                allowSObjectFieldsTraversal: true
            }
        );
    });
    it('sets param types if elementConfig has allowedParamTypes', async () => {
        const allowedParamTypes = {
            SObject: [
                {
                    paramType: 'Data',
                    dataType: 'SObject',
                    canBeSobjectField: 'CannotBe',
                    canBeSystemVariable: 'CannotBe',
                    canBeApexProperty: 'CanBe'
                }
            ]
        };
        const elementConfigProps = {
            propertyEditorElementType: ELEMENT_TYPE.VARIABLE,
            elementConfig: {
                allowedParamTypes,
                elementType: ELEMENT_TYPE.VARIABLE,
                shouldBeWritable: false
            }
        };

        setupComponentUnderTest(elementConfigProps);

        await ticks(1);
        const populateParamTypesFn = getMenuData.mock.calls[0][2];
        expect(populateParamTypesFn()).toStrictEqual(allowedParamTypes);
    });
    it('sends param types to the base picker when enableFieldDrilldown is true', async () => {
        props.value = 'test';
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
        const basePicker = ferovPicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER);

        await ticks(2);
        const populateParamTypesFn = getMenuData.mock.calls[0][2];
        populateParamTypesFn();
        await ticks(1);
        expect(mockRuleLib.getRHSTypes).toHaveBeenCalled();
        expect(mockRuleLib.getRHSTypes.mock.results[0]).toEqual(expect.any(Object));
        expect(basePicker.allowedParamTypes).toEqual(mockRuleLib.mockParam);
    });

    it('does not send param types to the base picker when enableFieldDrilldown is not set', async () => {
        props.value = 'test';
        const normalizedValue = {
            itemOrDisplayText: {
                value: props.value
            }
        };
        normalizeFEROV.mockReturnValueOnce(normalizedValue);
        const mockRules = ['rule1'];
        props.rules = mockRules;
        const ferovPicker = setupComponentUnderTest(props);
        const basePicker = ferovPicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER);

        await ticks(1);
        const populateParamTypesFn = getMenuData.mock.calls[0][2];
        populateParamTypesFn();
        expect(mockRuleLib.getRHSTypes).toHaveBeenCalled();
        expect(mockRuleLib.getRHSTypes.mock.results[0]).toEqual(expect.any(Object));
        expect(basePicker.allowedParamTypes).toEqual(null);
    });

    it('normalizes value when changing element config', async () => {
        const ferovResourcePicker = setupComponentUnderTest(props);

        props.elementConfig = { elementType: 'foo' };
        props.value = 'foobar';

        ferovResourcePicker.comboboxConfig = props.elementConfig;
        ferovResourcePicker.value = props.value;
        await ticks(1);
        expect(normalizeFEROV).toHaveBeenCalledWith('foobar', {
            allowSObjectFieldsTraversal: true
        });
    });

    it('normalizes value when changing combobox config', async () => {
        const ferovResourcePicker = setupComponentUnderTest(props);

        props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;
        props.value = 'foobar';

        ferovResourcePicker.comboboxConfig = props.comboboxConfig;
        ferovResourcePicker.value = props.value;
        await ticks(1);
        expect(normalizeFEROV).toHaveBeenCalledWith('foobar', {
            allowSObjectFieldsTraversal: true
        });
    });
    describe('event handling', () => {
        const comboboxValue = {
            value: 'value'
        };
        const displayText = 'displayText';
        it('when combobox changes to valid item, item is stored', async () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(2);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(comboboxValue, displayText));
            await ticks(1);
            expect(ferovResourcePicker.value).toMatchObject(comboboxValue);
        });
        it('when combobox changes to valid literal, literal is stored', async () => {
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(2);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(null, displayText));
            await ticks(1);
            expect(ferovResourcePicker.value).toEqual(displayText);
        });
        it('when resource picker is in an invalid state, displayText is stored even if combobox fires an item', async () => {
            props.errorMessage = 'error';
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(2);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(comboboxValue, displayText));
            await ticks(1);
            expect(ferovResourcePicker.value).toEqual(displayText);
        });
        it('when combobox changes to picklist value item, displayText from combobox item is stored and added to event', async () => {
            const pick1 = 'pick1';
            const pick2 = 'pick2';
            const ferovResourcePicker = setupComponentUnderTest(props);
            ferovResourcePicker.activePicklistValues = [
                { value: pick1, label: pick1 },
                { value: pick2, label: pick2 }
            ];
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );
            const event = new ComboboxStateChangedEvent({ value: pick2 + '-' + pick2, displayText: pick2 });
            baseResourcePicker.dispatchEvent(event);
            await ticks(1);
            expect(ferovResourcePicker.value).toEqual(pick2);
            expect(event.detail.displayText).toEqual(pick2);
            expect(event.detail.item).toBeNull();
        });
        it('when include quick create option is true and resource picker dispatches text changed event, new resource option is updated correctly', async () => {
            props.hideNewResource = false;
            props.newResourceTypeLabel = 'Choice';
            props.includeQuickCreateResourceOption = true;
            const ferovResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
            );

            // Verify that when text is entered, the New Resource option is updated to reflect the quick create option
            let event = new TextChangedEvent('Mustard');
            baseResourcePicker.dispatchEvent(event);
            await ticks(1);
            const combobox = baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX);
            expect(combobox.menuData).toHaveLength(2);
            expect(combobox.menuData[0].text).toEqual(
                'FlowBuilderExpressionUtils.quickCreateResourceLabel(Mustard,Choice)'
            );
            expect(combobox.menuData[1].text).toEqual('variable1');

            // Verify that when there is no text entered, the default New Resource option is present
            event = new TextChangedEvent('');
            baseResourcePicker.dispatchEvent(event);
            await ticks(1);
            expect(combobox.menuData[0].text).toEqual('FlowBuilderExpressionUtils.newTypedResourceLabel(Choice)');
        });
    });
    describe('handles system & global variables', () => {
        beforeEach(() => {
            // if RHS doesn't exist, menu data isn't set
            normalizeFEROV.mockReturnValueOnce({ itemOrDisplayText: 'foo' });
        });
        it('defaults hideSystemVariables to false', async () => {
            setupComponentUnderTest(props);
            await ticks(1);
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                Store.getStore(),
                undefined,
                undefined,
                {
                    allowGlobalConstants: true,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    showSystemVariables: true,
                    showGlobalVariables: true,
                    forFormula: false,
                    allowSObjectFieldsTraversal: true
                }
            );
        });
        it('defaults showGlobalVariables to true', async () => {
            setupComponentUnderTest(props);
            await ticks(1);
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                Store.getStore(),
                undefined,
                undefined,
                {
                    allowGlobalConstants: true,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    showSystemVariables: true,
                    showGlobalVariables: true,
                    forFormula: false,
                    allowSObjectFieldsTraversal: true
                }
            );
        });
        it('passes along showSystemVariables setting', async () => {
            props.hideSystemVariables = true;
            setupComponentUnderTest(props);
            await ticks(1);
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                Store.getStore(),
                undefined,
                undefined,
                {
                    allowGlobalConstants: true,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    showSystemVariables: false,
                    showGlobalVariables: true,
                    forFormula: false,
                    allowSObjectFieldsTraversal: true
                }
            );
        });
        it('passes along hideGlobalVariables setting', async () => {
            props.hideGlobalVariables = true;
            setupComponentUnderTest(props);
            await ticks(1);
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                Store.getStore(),
                undefined,
                undefined,
                {
                    allowGlobalConstants: true,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    showSystemVariables: true,
                    showGlobalVariables: false,
                    forFormula: false,
                    allowSObjectFieldsTraversal: true
                }
            );
        });
        it('passes along forFormula setting', async () => {
            props.forFormula = true;
            setupComponentUnderTest(props);
            await ticks(1);
            expect(getMenuData).toHaveBeenCalledWith(
                undefined,
                ELEMENT_TYPE.VARIABLE,
                expect.any(Function),
                Store.getStore(),
                undefined,
                undefined,
                {
                    allowGlobalConstants: true,
                    enableFieldDrilldown: false,
                    includeNewResource: true,
                    showSystemVariables: true,
                    showGlobalVariables: true,
                    forFormula: true,
                    allowSObjectFieldsTraversal: true
                }
            );
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
        it('dispatches removeLastCreatedInlineResource when there is an inline resource and fetchMenuData is triggered', async () => {
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47c2v';
            props.rowIndex = idx;
            const spy = Store.getStore().dispatch;

            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d16429tt'
                }
            });
            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');
            picker.dispatchEvent(fetchMenuData());

            await ticks(1);
            expect(spy).toHaveBeenCalledWith(removeLastCreatedInlineResource);
        });
        it('calls getMenuData when an inline resource is set and fetchMenuData is triggered', async () => {
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47c23';
            props.rowIndex = idx;
            const menuDataSpy = getMenuData;
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d16429gg'
                }
            });
            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');
            picker.dispatchEvent(fetchMenuData());
            await ticks(1);
            expect(menuDataSpy).toHaveBeenCalled();
        });
        it('dispaches response from updateInlineResourceProperties when dispatching addnewresource', async () => {
            const updateInlineResourceSpy = updateInlineResourceProperties;
            const spy = Store.getStore().dispatch;

            const cmp = setupComponentUnderTest(props);
            const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');

            picker.dispatchEvent(handleAddInlineResource());
            await ticks(1);
            expect(spy).toHaveBeenCalledWith('test response');
            expect(updateInlineResourceSpy).toHaveBeenCalled();
        });
        it('addnewresource event includes user provided text when quick create option is true and text has been entered', async () => {
            props.hideNewResource = false;
            props.newResourceTypeLabel = 'Choice';
            props.includeQuickCreateResourceOption = true;
            const cmp = setupComponentUnderTest(props);

            const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');
            picker.dispatchEvent(new TextChangedEvent('Mustard'));
            const addInlineResourceEvent = handleAddInlineResource();
            picker.dispatchEvent(addInlineResourceEvent);
            expect(addInlineResourceEvent.detail.newResourceInfo.userProvidedText).toEqual('Mustard');
        });
    });
    describe('pills', () => {
        it('does not support pills by default', () => {
            const baseResourcePicker = setupComponentUnderTest();
            expect(baseResourcePicker.isPillSupported).toBe(false);
        });
    });
});
