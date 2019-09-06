import { createElement } from 'lwc';
import BaseCalloutEditor from '../baseCalloutEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);

const defaultTitle = 'Configure Post to Chatter';

const defaultLabelDescriptionConfig = {
    label: { value: 'Post to Chatter', error: null },
    name: { value: 'Post_to_Chatter', error: null },
    description: { value: 'Post to chatter action call', error: null },
    guid: generateGuid()
};

const defaultInputParameters = [
    {
        label: { value: 'Message', error: null },
        name: { value: 'text', error: null },
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: { value: 'This is a message', error: null },
        valueDataType: 'String',
        rowIndex: generateGuid()
    },
    {
        label: { value: 'Subject Name or Id', error: null },
        name: { value: 'subjectNameOrId', error: null },
        isInput: true,
        isRequired: true,
        dataType: 'String',
        value: { value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f', error: null },
        valueGuid: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
        rowIndex: generateGuid()
    }
];

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
    }
];

const defaultParameterListConfig = {
    inputHeader: 'input header',
    outputHeader: 'output header',
    inputs: defaultInputParameters,
    outputs: defaultOutputParameters,
    warnings: {},
    storeOutputAutomatically: false,
    automaticOutputHandlingSupported: false
};

const defaultBaseCalloutElement = {
    subtitle: defaultTitle,
    labelDescriptionConfig: defaultLabelDescriptionConfig,
    parameterListConfig: defaultParameterListConfig
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description',
    parameterList: 'builder_platform_interaction-parameter-list'
};

const getLabelDescription = baseCalloutEditor => {
    return baseCalloutEditor.shadowRoot.querySelector(
        selectors.labelDescription
    );
};

const getParameterList = baseCalloutEditor => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.parameterList);
};

function createComponentForTest({
    labelDescriptionConfig = {},
    subtitle = '',
    elementType = ELEMENT_TYPE.ACTION_CALL,
    parameterListConfig = {}
} = {}) {
    const el = createElement(
        'builder_platform_interaction-base-callout-editor',
        { is: BaseCalloutEditor }
    );
    Object.assign(el, {
        elementType,
        subtitle,
        labelDescriptionConfig,
        parameterListConfig
    });
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
        it('contains parameter list component', () => {
            const parameterList = getParameterList(baseCalloutEditor);
            expect(parameterList).not.toBeNull();
        });
    });
    describe('with default values', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest(
                defaultBaseCalloutElement
            );
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(baseCalloutEditor);
            const { label, devName, description, guid } = labelDescription;
            expect({ label, name: devName, description, guid }).toEqual(
                defaultLabelDescriptionConfig
            );
        });
        it('contains parameter list component', () => {
            const parameterListCmp = getParameterList(baseCalloutEditor);
            const {
                inputHeader,
                outputHeader,
                inputs,
                outputs,
                warnings,
                storeOutputAutomatically,
                automaticOutputHandlingSupported
            } = parameterListCmp;
            expect({
                inputHeader,
                outputHeader,
                inputs,
                outputs,
                warnings,
                storeOutputAutomatically,
                automaticOutputHandlingSupported
            }).toEqual(defaultParameterListConfig);
        });
    });
});
