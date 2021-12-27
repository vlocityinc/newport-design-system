import {
    getManuallyAssignVariablesCheckbox,
    getManuallyAssignVariablesCheckboxInputElement,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE, FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import UseAdvancedSettingsAccordion from '../useAdvancedSettingsAccordion';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const selectors = {
    divOutputs: '.outputs',
    outputHeader: '.outputHeader',
    parameterItem: 'builder_platform_interaction-parameter-item',
    advancedAccordion: 'builder_platform_interaction-use-advanced-settings-accordion',
    transactionControlPicker: 'builder_platform_interaction-transaction-control-picker',
    input: 'input',
    inputChecked: '.slds-form-element__control input:checked'
};

const defaultOutputHeader = 'Received from action';
const getOutputHeader = (advancedAccordion) => advancedAccordion.shadowRoot.querySelector(selectors.outputHeader);
const getTransactionControlPicker = (advancedAccordion) =>
    advancedAccordion.shadowRoot.querySelector(selectors.transactionControlPicker);

const getInputElements = (transactionControlPicker) =>
    transactionControlPicker.shadowRoot.querySelectorAll(selectors.input);
const getCheckedInputElement = (transactionControlPicker) =>
    transactionControlPicker.shadowRoot.querySelector(selectors.inputChecked);
const getOutputParameterItems = (advancedAccordion) => {
    return advancedAccordion.shadowRoot.querySelector(selectors.divOutputs).querySelectorAll(selectors.parameterItem);
};

const defaultOutputParameters = [
    {
        label: { value: 'Feed Id', error: null },
        name: { value: 'feedId', error: null },
        isInput: false,
        isRequired: false,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    },
    {
        label: { value: 'Account Id', error: null },
        name: { value: 'accountId', error: null },
        isInput: false,
        isRequired: false,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    }
];

const defaultParameterListConfig = {
    inputHeader: '',
    outputHeader: defaultOutputHeader,
    inputs: [],
    outputs: [],
    warnings: {},
    storeOutputAutomatically: false,
    automaticOutputHandlingSupported: false
};

const paramListWithStoreOutputAndAutomaticOutput = {
    inputHeader: '',
    outputHeader: defaultOutputHeader,
    inputs: [],
    outputs: defaultOutputParameters,
    warnings: {},
    storeOutputAutomatically: true,
    automaticOutputHandlingSupported: true,
    flowTransactionModel: FLOW_TRANSACTION_MODEL.AUTOMATIC
};
const paramListWithAutomaticOutputHandlingAndOutputs = {
    inputHeader: '',
    outputHeader: defaultOutputHeader,
    inputs: [],
    outputs: defaultOutputParameters,
    warnings: {},
    storeOutputAutomatically: false,
    automaticOutputHandlingSupported: true,
    flowTransactionModel: FLOW_TRANSACTION_MODEL.NEW_TRANSACTION
};

function createComponentForTest({
    elementType = ELEMENT_TYPE.ACTION_CALL,
    parameterListConfig = {},
    configurationEditor = null,
    showTransactionControlPicker = false
} = {}) {
    const el = createElement('builder_platform_interaction-use-advanced-settings-accordion', {
        is: UseAdvancedSettingsAccordion
    });
    Object.assign(el, {
        elementType,
        parameterListConfig,
        configurationEditor,
        showTransactionControlPicker
    });
    setDocumentBodyChildren(el);
    return el;
}

const advancedSettingsAttr = (parameterListConfig = {}, showTransactionControlPicker = false) => ({
    parameterListConfig,
    showTransactionControlPicker
});

describe('use-advanced-settings-accordion', () => {
    describe('Automatic output Handling and Transaction Control not supported', () => {
        let advancedSettings;
        beforeEach(() => {
            advancedSettings = createComponentForTest(advancedSettingsAttr(defaultParameterListConfig, false));
        });
        it('Should not display the Use Advanced Option checkbox', () => {
            const advancedOption = getManuallyAssignVariablesCheckbox(advancedSettings);
            expect(advancedOption).toBeNull();
        });
        it('should not contains output div header', () => {
            const outputHeader = getOutputHeader(advancedSettings);
            expect(outputHeader).toBeNull();
        });
        it('should not contain the transaction control picker', () => {
            const transactionControlPicker = getTransactionControlPicker(advancedSettings);
            expect(transactionControlPicker).toBeNull();
        });
    });
    describe('Automatic output Handling and Transaction Control supported', () => {
        let advancedSettings;
        beforeEach(() => {
            advancedSettings = createComponentForTest(
                advancedSettingsAttr(paramListWithStoreOutputAndAutomaticOutput, true)
            );
        });
        it('Display the Use Advanced Option checkbox', () => {
            const advancedOptionCheckbox = getManuallyAssignVariablesCheckboxInputElement(advancedSettings);
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(false);
        });
        it('should not contains output div header', () => {
            const outputHeader = getOutputHeader(advancedSettings);
            expect(outputHeader).toBeNull();
        });
        it('should contain the transaction control picker', () => {
            const transactionControlPicker = getTransactionControlPicker(advancedSettings);
            expect(transactionControlPicker).not.toBeNull();
            const inputs = getInputElements(transactionControlPicker);
            expect(inputs).toHaveLength(3);
            const checkedInput = getCheckedInputElement(transactionControlPicker);
            expect(checkedInput.value).toBe(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        });
    });
    describe('Is in Advanced Mode', () => {
        let advancedSettings;
        beforeEach(() => {
            advancedSettings = createComponentForTest(
                advancedSettingsAttr(paramListWithAutomaticOutputHandlingAndOutputs, true)
            );
        });
        it('Display the Use Advanced Option checkbox', () => {
            const advancedOptionCheckbox = getManuallyAssignVariablesCheckboxInputElement(advancedSettings);
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(true);
        });
        it('should contain output div header', () => {
            const outputHeader = getOutputHeader(advancedSettings);
            expect(outputHeader).not.toBeNull();
            expect(outputHeader.firstChild.nodeValue).toEqual(defaultOutputHeader);
        });
        it('sorts outputs parameters by label', () => {
            const parameterItems = getOutputParameterItems(advancedSettings);
            const expectedOutputs = [
                { name: 'feedId', label: 'Feed Id', isRequired: false },
                { name: 'accountId', label: 'Account Id', isRequired: false }
            ];
            const outputParameters = [...parameterItems].map((parameterItem) => {
                return {
                    name: getValueFromHydratedItem(parameterItem.item.name),
                    label: getValueFromHydratedItem(parameterItem.item.label),
                    isRequired: parameterItem.item.isRequired
                };
            });
            expect(outputParameters).toEqual(expectedOutputs);
        });
    });
});
