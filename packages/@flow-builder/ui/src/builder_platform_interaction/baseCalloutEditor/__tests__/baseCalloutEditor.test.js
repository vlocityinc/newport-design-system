import { createElement } from 'lwc';
import BaseCalloutEditor from "../baseCalloutEditor";
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getShadowRoot } from 'lwc-test-utils';
import { generateGuid } from "builder_platform_interaction/storeLib";

const defaultInputTabHeader = 'Send to Input';
const defaultOutputTabHeader = 'Received from Output';
const defaultTitle = 'Configure Post to Chatter';

const defaultLabelDescriptionConfig = {
    label: {value: 'Post to Chatter', error: null},
    name: {value: 'Post_to_Chatter', error: null},
    description: {value: 'Post to chatter action call', error: null},
    guid: generateGuid(),
};

const defaultInputParameters = [
    {
        label: {value: 'Message', error: null},
        name: {value: 'text', error: null},
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: {value: 'This is a message', error: null},
        valueGuid: 'This is a message',
        valueDataType: 'String',
        rowIndex: generateGuid()
    },
    {
        label: {value: 'Subject Name or Id', error: null},
        name: {value: 'subjectNameOrId', error: null},
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: {value: 'var_text', error: null},
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
        valueDataType: 'String',
        rowIndex: generateGuid()
        },
];

const defaultOutputParameters = [
    {
        label: {value: 'Feed Id', error: null},
        name: {value: 'feedId', error: null},
        isInput: false,
        isRequired: false,
        dataType: 'String',
        value: {value: 'var_text', error: null},
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
        valueDataType: 'reference',
        rowIndex: generateGuid()
    }
];

const defaultBaseCalloutElement = {
    subtitle: defaultTitle,
    labelDescriptionConfig: defaultLabelDescriptionConfig,
    inputs: defaultInputParameters,
    outputs: defaultOutputParameters,
    inputTabHeader: defaultInputTabHeader,
    outputTabHeader: defaultOutputTabHeader,
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description',
    lightningTab: 'lightning-tab',
    inputParameterItems: '#tabitem-inputs builder_platform_interaction-parameter-item',
    outputParameterItems: '#tabitem-outputs builder_platform_interaction-parameter-item',
};

const getLabelDescription = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelector(selectors.labelDescription);
};

const getLightningTabs = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.lightningTab);
};

const getInputParameterItems = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.inputParameterItems);
};

const getOutputParameterItems = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.outputParameterItems);
};

function createComponentForTest({ labelDescriptionConfig = {}, subtitle = '', elementType = ELEMENT_TYPE.ACTION_CALL, inputTabHeader = '', outputTabHeader = '', inputs = [], outputs = []} = {}) {
    const el = createElement('builder_platform_interaction-base-callout-editor', { is: BaseCalloutEditor });
    Object.assign(el, {elementType, subtitle, inputTabHeader, outputTabHeader, inputs, outputs, labelDescriptionConfig});
    document.body.appendChild(el);
    return el;
}

describe('base-callout-editor', () => {
    describe('without values', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest();
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(baseCalloutEditor);
            expect(labelDescription.label.value).toEqual('');
            expect(labelDescription.devName.value).toEqual('');
            expect(labelDescription.description.value).toEqual('');
        });
        it('contains 2 tabs', () => {
            const lightningTabs = getLightningTabs(baseCalloutEditor);
            expect(lightningTabs).toHaveLength(2);
        });
        it('should not contain any input parameters in input tab', () => {
            const parameterItems = getInputParameterItems(baseCalloutEditor);
            expect(parameterItems).toHaveLength(0);
        });
        it('should not contain any output parameters in output tab', () => {
            const parameterItems = getOutputParameterItems(baseCalloutEditor);
            expect(parameterItems).toHaveLength(0);
        });
    });
    describe('with default values', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(baseCalloutEditor);
            expect(labelDescription.label).toEqual(defaultLabelDescriptionConfig.label);
            expect(labelDescription.devName).toEqual(defaultLabelDescriptionConfig.name);
            expect(labelDescription.description).toEqual(defaultLabelDescriptionConfig.description);
        });
        it('contains 2 tabs: "Send to Input" and "Received from Output"', () => {
            const lightningTabs = getLightningTabs(baseCalloutEditor);
            expect(lightningTabs).toHaveLength(2);
            expect(lightningTabs[0].label).toEqual(defaultInputTabHeader);
            expect(lightningTabs[1].label).toEqual(defaultOutputTabHeader);
        });
        it('contains input parameters in input tab', () => {
            const parameterItems = getInputParameterItems(baseCalloutEditor);
            expect(parameterItems).toHaveLength(defaultInputParameters.length);
            expect(parameterItems[0].item).toEqual(defaultInputParameters[0]);
            expect(parameterItems[1].item).toEqual(defaultInputParameters[1]);
        });
        it('contains output parameters in output tab', () => {
            const parameterItems = getOutputParameterItems(baseCalloutEditor);
            expect(parameterItems).toHaveLength(defaultOutputParameters.length);
            expect(parameterItems[0].item).toEqual(defaultOutputParameters[0]);
        });
    });
});