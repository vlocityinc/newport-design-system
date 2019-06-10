import { createElement } from 'lwc';
import ParameterList from '../parameterList';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);

const defaultInputTabHeader = 'Send to action';
const defaultOutputTabHeader = 'Received from action';
const defaultEmptyInputsTitle = 'No inputs';
const defaultEmptyInputsBody = 'No variables to define';
const defaultEmptyOutputsTitle = 'No outputs';
const defaultEmptyOutputsBody = 'This action doesn’t return any data';

const defaultInputParameters = [
    {
        label: { value: 'Community ID', error: null },
        name: { value: 'communityId', error: null },
        isInput: true,
        isRequired: false,
        dataType: 'String',
        value: { value: '"3824e478-141e-48e5-b1cd-5dbfd5868435"', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    },
    {
        label: { value: 'Subject Name or Id', error: null },
        name: { value: 'subjectNameOrId', error: null },
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    },
    {
        label: { value: 'Message', error: null },
        name: { value: 'text', error: null },
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: { value: 'This is a message', error: null },
        valueDataType: 'String',
        rowIndex: generateGuid()
    }
];

const defaultOutputParameters = [
    {
        label: { value: 'Feed ID', error: null },
        name: { value: 'feedId', error: null },
        isInput: false,
        isRequired: false,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    },
    {
        label: { value: 'Account ID', error: null },
        name: { value: 'accountId', error: null },
        isInput: false,
        isRequired: false,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueDataType: 'reference',
        rowIndex: generateGuid()
    }
];

const defaultParameterList = {
    inputs: defaultInputParameters,
    outputs: defaultOutputParameters
};

const selectors = {
    lightningTab: 'lightning-tab',
    inputTab: '.tabitem-inputs',
    outputTab: '.tabitem-outputs',
    emptyInputs: '.emptyInputsMessage',
    emptyOutputs: '.emptyOutputsMessage',
    goneCamping: '.goneCamping',
    parameterItem: 'builder_platform_interaction-parameter-item'
};

const getLightningTabs = parameterList => {
    return parameterList.shadowRoot.querySelectorAll(selectors.lightningTab);
};

const getInputParameterItems = parameterList => {
    return parameterList.shadowRoot
        .querySelector(selectors.inputTab)
        .querySelectorAll(selectors.parameterItem);
};

const getOutputParameterItems = parameterList => {
    return parameterList.shadowRoot
        .querySelector(selectors.outputTab)
        .querySelectorAll(selectors.parameterItem);
};

const getEmptyInputs = parameterList => {
    return parameterList.shadowRoot
        .querySelector(selectors.emptyInputs)
        .querySelector(selectors.goneCamping);
};

const getEmptyOutputs = parameterList => {
    return parameterList.shadowRoot
        .querySelector(selectors.emptyOutputs)
        .querySelector(selectors.goneCamping);
};

function createComponentForTest({
    elementType = ELEMENT_TYPE.ACTION_CALL,
    inputTabHeader = defaultInputTabHeader,
    outputTabHeader = defaultOutputTabHeader,
    emptyInputsTitle = defaultEmptyInputsTitle,
    emptyOutputsTitle = defaultEmptyOutputsTitle,
    emptyInputsBody = defaultEmptyInputsBody,
    emptyOutputsBody = defaultEmptyOutputsBody,
    inputs = [],
    outputs = [],
    sortInputs = true,
    sortOutputs = true
} = {}) {
    const el = createElement('builder_platform_interaction-parameter-list', {
        is: ParameterList
    });
    Object.assign(el, {
        elementType,
        inputTabHeader,
        outputTabHeader,
        inputs,
        outputs,
        emptyInputsTitle,
        emptyOutputsTitle,
        emptyInputsBody,
        emptyOutputsBody,
        sortInputs,
        sortOutputs
    });
    document.body.appendChild(el);
    return el;
}

describe('parameter-list', () => {
    describe('without values', () => {
        let parameterList;
        beforeEach(() => {
            parameterList = createComponentForTest();
        });
        it('contains 2 tabs', () => {
            const lightningTabs = getLightningTabs(parameterList);
            expect(lightningTabs).toHaveLength(2);
        });
        it('should contain empty inputs message in input tab', () => {
            const nothing = getEmptyInputs(parameterList);
            expect(nothing.title).toEqual(defaultEmptyInputsTitle);
            expect(nothing.body).toEqual(defaultEmptyInputsBody);
        });
        it('should not contain any input parameters in input tab', () => {
            const parameterItems = getInputParameterItems(parameterList);
            expect(parameterItems).toHaveLength(0);
        });
        it('should contain empty outputs message in output tab', () => {
            const nothing = getEmptyOutputs(parameterList);
            expect(nothing.title).toEqual(defaultEmptyOutputsTitle);
            expect(nothing.body).toEqual(defaultEmptyOutputsBody);
        });
        it('should not contain any output parameters in output tab', () => {
            const parameterItems = getOutputParameterItems(parameterList);
            expect(parameterItems).toHaveLength(0);
        });
    });
    describe('with default values', () => {
        let parameterList;
        beforeEach(() => {
            parameterList = createComponentForTest(defaultParameterList);
        });
        it('contains 2 tabs: "Send to action" and "Received from action"', () => {
            const lightningTabs = getLightningTabs(parameterList);
            expect(lightningTabs).toHaveLength(2);
            expect(lightningTabs[0].label).toEqual(defaultInputTabHeader);
            expect(lightningTabs[1].label).toEqual(defaultOutputTabHeader);
        });
        it('contains input parameters in input tab', () => {
            const parameterItems = getInputParameterItems(parameterList);
            expect(parameterItems).toHaveLength(defaultInputParameters.length);
        });
        it('sorts input parameters by isRequired and label', () => {
            const parameterItems = getInputParameterItems(parameterList);
            const expectedInputs = [
                { name: 'text', label: 'Message', isRequired: true },
                {
                    name: 'subjectNameOrId',
                    label: 'Subject Name or Id',
                    isRequired: true
                },
                {
                    name: 'communityId',
                    label: 'Community ID',
                    isRequired: false
                }
            ];
            const inputParameters = [...parameterItems].map(parameterItem => {
                return {
                    name: getValueFromHydratedItem(parameterItem.item.name),
                    label: getValueFromHydratedItem(parameterItem.item.label),
                    isRequired: parameterItem.item.isRequired
                };
            });
            expect(inputParameters).toEqual(expectedInputs);
        });
        it('contains output parameters in output tab', () => {
            const parameterItems = getOutputParameterItems(parameterList);
            expect(parameterItems).toHaveLength(defaultOutputParameters.length);
        });
        it('sorts outputs parameters by label', () => {
            const parameterItems = getOutputParameterItems(parameterList);
            const expectedOutputs = [
                { name: 'accountId', label: 'Account ID', isRequired: false },
                { name: 'feedId', label: 'Feed ID', isRequired: false }
            ];
            const outputParameters = [...parameterItems].map(parameterItem => {
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
