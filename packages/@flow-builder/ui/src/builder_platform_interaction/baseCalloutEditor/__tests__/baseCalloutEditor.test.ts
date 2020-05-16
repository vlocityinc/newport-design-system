// @ts-nocheck
import { createElement } from 'lwc';
import BaseCalloutEditor from '../baseCalloutEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ComboboxStateChangedEvent, DynamicTypeMappingChangeEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/entityResourcePicker', () =>
    require('builder_platform_interaction_mocks/entityResourcePicker')
);

const defaultTitle = 'Configure Post to Chatter';

const defaultLabelDescriptionConfig = {
    label: { value: 'Post to Chatter', error: null },
    name: { value: 'Post_to_Chatter', error: null },
    description: { value: 'Post to chatter action call', error: null },
    guid: generateGuid()
};

const defaultEntityPickerConfig = {
    label: 'generic type 1',
    errorMessage: null,
    required: true,
    disabled: false,
    type: 'SObject',
    allowSObjectFields: false,
    fieldLevelHelp: null
};

const defaultTypeMappings = [
    {
        typeName: { value: 'T', error: null },
        typeValue: { value: 'Account', error: null },
        rowIndex: 'index1',
        comboboxConfig: defaultEntityPickerConfig
    },
    {
        typeName: { value: 'U', error: null },
        typeValue: { value: 'Contact', error: null },
        rowIndex: 'index2',
        comboboxConfig: defaultEntityPickerConfig
    }
];

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
    typeMappings: defaultTypeMappings,
    parameterListConfig: defaultParameterListConfig
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description',
    parameterList: 'builder_platform_interaction-parameter-list',
    typeMapping: 'builder_platform_interaction-entity-resource-picker'
};

const getLabelDescription = baseCalloutEditor => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.labelDescription);
};

const getParameterList = baseCalloutEditor => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.parameterList);
};

const getTypeMappings = baseCalloutEditor => {
    return baseCalloutEditor.shadowRoot.querySelectorAll(selectors.typeMapping);
};

function createComponentForTest({
    labelDescriptionConfig = {},
    subtitle = '',
    elementType = ELEMENT_TYPE.ACTION_CALL,
    typeMappings = [],
    parameterListConfig = {}
} = {}) {
    const el = createElement('builder_platform_interaction-base-callout-editor', { is: BaseCalloutEditor });
    Object.assign(el, {
        elementType,
        subtitle,
        labelDescriptionConfig,
        typeMappings,
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
    describe('without type mappings', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest();
        });
        it('does not contain type mappings list component', () => {
            const typeMappings = getTypeMappings(baseCalloutEditor);
            expect(typeMappings).toHaveLength(0);
        });
    });
    describe('with default values', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(baseCalloutEditor);
            const { label, devName, description, guid } = labelDescription;
            expect({ label, name: devName, description, guid }).toEqual(defaultLabelDescriptionConfig);
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
    describe('with type mappings', () => {
        let baseCalloutEditor;
        beforeEach(() => {
            baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
        });
        it('contains type mappings list component', () => {
            const typeMappings = getTypeMappings(baseCalloutEditor);
            expect(typeMappings).toHaveLength(2);
            const { value, rowIndex, comboboxConfig } = typeMappings[0];
            expect({
                typeName: { value: 'T', error: null },
                typeValue: { value, error: null },
                rowIndex,
                comboboxConfig
            }).toEqual(defaultTypeMappings[0]);
        });
    });
    it('handles the combobox state changed event and fires the dynamic type mapping changed event', async () => {
        const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
        const event = new ComboboxStateChangedEvent(
            {
                value: 'lead',
                rowIndex: 'index1'
            },
            'Lead',
            null
        );
        const handler = jest.fn();
        baseCalloutEditor.addEventListener(DynamicTypeMappingChangeEvent.EVENT_NAME, handler);
        baseCalloutEditor.shadowRoot.querySelectorAll(selectors.typeMapping)[0].dispatchEvent(event);
        await Promise.resolve();
        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail).toMatchObject({
            typeName: 'T',
            typeValue: 'lead',
            error: null,
            rowIndex: 'index1'
        });
    });
});
