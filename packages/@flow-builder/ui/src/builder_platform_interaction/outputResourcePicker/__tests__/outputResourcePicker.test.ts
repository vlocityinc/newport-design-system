import { createElement } from 'lwc';
import OutputResourcePicker from '../outputResourcePicker';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getMenuData, getMenuItemForField, normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { updateInlineResourceProperties, removeLastCreatedInlineResource } from 'builder_platform_interaction/actions';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/inlineResourceUtils', () => {
    return {
        getInlineResource: jest.fn(() => {
            return { guid: 'test guid' };
        })
    };
});
jest.mock('builder_platform_interaction/actions', () => {
    return {
        updateInlineResourceProperties: jest.fn(() => 'test response')
    };
});

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-output-resource-picker', {
        is: OutputResourcePicker
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
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
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');
    return {
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        getOutputRules: jest.fn().mockReturnValue(['rule1']).mockName('getOutputRules'),
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
        normalizeFEROV: jest.fn().mockImplementation((identifier) => ({
            itemOrDisplayText: identifier
        })),
        getMenuData: jest
            .fn()
            .mockReturnValue(Promise.resolve(['ferovMenuData']))
            .mockName('getMenuData'),
        getResourceByUniqueIdentifier: jest.fn(),
        mutateFlowResourceToComboboxShape: jest.fn(),
        getMenuItemForField: jest.fn()
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
        it('exists', async () => {
            const outputResourcePicker = setupComponentUnderTest(props);
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            await ticks(1);
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker).toBeDefined();
        });

        it('has the combobox config object set', async () => {
            props.comboboxConfig = {
                label: 'test label',
                literalsAllowed: false,
                placeholder: 'FlowBuilderCombobox.outputPlaceholder'
            };
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            const outputResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
        });
        it('has the value set', async () => {
            props.value = 'testValue';
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            const outputResourcePicker = setupComponentUnderTest(props);
            await ticks(1);
            const baseResourcePicker = outputResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });
    it('retrieves fer menu data on initial load when value is fer', async () => {
        props.value = 'foo';
        setupComponentUnderTest(props);
        const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
        // @ts-ignore
        Store.setMockState({
            properties: {
                lastInlineResourceRowIndex: idx,
                lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
            }
        });
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            expectedElementConfig,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: false,
                showGlobalVariables: false,
                enableFieldDrilldown: false,
                includeNewResource: true,
                allowSObjectFieldsTraversal: false
            }
        );
    });

    it('fetches the fields when requesting field menu data without field data', async () => {
        props.value = {
            value: 'accVar.Name',
            parent: parentRecordVar
        };
        // @ts-ignore
        normalizeFEROV.mockReturnValueOnce({
            itemOrDisplayText: {
                value: 'accVar.Name',
                parent: parentRecordVar
            }
        });
        // @ts-ignore
        getMenuItemForField.mockReturnValueOnce(props.value);
        setupComponentUnderTest(props);
        const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
        // @ts-ignore
        Store.setMockState({
            properties: {
                lastInlineResourceRowIndex: idx,
                lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
            }
        });
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            expectedElementConfig,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            parentRecordVar,
            undefined,
            {
                allowGlobalConstants: false,
                showGlobalVariables: false,
                enableFieldDrilldown: false,
                includeNewResource: true,
                allowSObjectFieldsTraversal: false
            }
        );
    });

    it('passes in enableFieldDrilldown to populateMenudata', async () => {
        const enableFieldDrilldown = (props.comboboxConfig.enableFieldDrilldown = true);
        setupComponentUnderTest(props);
        const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
        // @ts-ignore
        Store.setMockState({
            properties: {
                lastInlineResourceRowIndex: idx,
                lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
            }
        });
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            expectedElementConfig,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: false,
                showGlobalVariables: false,
                enableFieldDrilldown,
                includeNewResource: true,
                allowSObjectFieldsTraversal: false
            }
        );
    });

    it('uses rule service and expression utils to retrieve fer data', async () => {
        setupComponentUnderTest(props);
        const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
        // @ts-ignore
        Store.setMockState({
            properties: {
                lastInlineResourceRowIndex: idx,
                lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
            }
        });
        await ticks(1);
        expect(getMenuData).toHaveBeenCalledWith(
            expectedElementConfig,
            ELEMENT_TYPE.VARIABLE,
            expect.any(Function),
            Store.getStore(),
            undefined,
            undefined,
            {
                allowGlobalConstants: false,
                showGlobalVariables: false,
                enableFieldDrilldown: false,
                includeNewResource: true,
                allowSObjectFieldsTraversal: false
            }
        );
    });

    describe('populateParamTypes function', () => {
        it('calls getRHSTypes with the right arguments', async () => {
            setupComponentUnderTest(props);
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            await ticks(1);
            // @ts-ignore
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

    describe('normalize', () => {
        it('normalizes value when changing value', async () => {
            const outputResourcePicker = setupComponentUnderTest(props);
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            const newValue = 'foobar';
            outputResourcePicker.value = newValue;
            await ticks(1);
            expect(normalizeFEROV).toHaveBeenCalledWith(newValue);
        });

        it('normalizes value when changing combobox config', async () => {
            const outputResourcePicker = setupComponentUnderTest(props);
            const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
            // @ts-ignore
            Store.setMockState({
                properties: {
                    lastInlineResourceRowIndex: idx,
                    lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                }
            });
            props.comboboxConfig.type = FLOW_DATA_TYPE.STRING;
            // @ts-ignore
            normalizeFEROV.mockClear();
            outputResourcePicker.comboboxConfig = props.comboboxConfig;

            await ticks(1);
            expect(normalizeFEROV).toHaveBeenCalledWith(props.value);
        });

        describe('inline resource ', () => {
            function fetchMenuData() {
                return new CustomEvent('fetchmenudata', {
                    detail: {
                        item: {
                            value: '6f346269-409c-422e-9e8c-3898d164298m'
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
                const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47crr';
                props.rowIndex = idx;
                const spy = Store.getStore().dispatch;
                // @ts-ignore
                Store.setMockState({
                    properties: {
                        lastInlineResourceRowIndex: idx,
                        lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298q'
                    }
                });
                const cmp = setupComponentUnderTest(props);
                const picker = cmp.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
                picker.dispatchEvent(fetchMenuData());

                await ticks(1);
                expect(spy).toHaveBeenCalledWith(removeLastCreatedInlineResource);
            });
            it('calls getMenuData when an inline resource is set and fetchMenuData is triggered', async () => {
                const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
                props.rowIndex = idx;
                const menuDataSpy = getMenuData;
                // @ts-ignore
                Store.setMockState({
                    properties: {
                        lastInlineResourceRowIndex: idx,
                        lastInlineResourceGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                    }
                });
                const cmp = setupComponentUnderTest(props);
                const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');
                picker.dispatchEvent(fetchMenuData());
                await ticks(1);
                expect(menuDataSpy).toHaveBeenCalled();
            });
            it('dispatches response from updateInlineResourceProperties when dispatching addnewresource', async () => {
                const updateInlineResourceSpy = updateInlineResourceProperties;
                const spy = Store.getStore().dispatch;

                const idx = 'kl214fea-9c9a-45cf-b804-76fc6df47fff';
                // @ts-ignore
                Store.setMockState({
                    properties: {
                        inlineResourceRowIndex: idx,
                        inlineGuid: '6f346269-409c-422e-9e8c-3898d164298m'
                    }
                });

                const cmp = setupComponentUnderTest(props);
                const picker = cmp.shadowRoot.querySelector('builder_platform_interaction-base-resource-picker');
                picker.dispatchEvent(handleAddInlineResource());
                await ticks(1);
                expect(spy).toHaveBeenCalledWith('test response');
                expect(updateInlineResourceSpy).toHaveBeenCalled();
            });
        });
    });
});
