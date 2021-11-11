// @ts-nocheck
import { createElement } from 'lwc';
import BaseCalloutEditor from '../baseCalloutEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ComboboxStateChangedEvent, DynamicTypeMappingChangeEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from '../baseCalloutEditorLabels';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/entityResourcePicker', () =>
    require('builder_platform_interaction_mocks/entityResourcePicker')
);
jest.mock('builder_platform_interaction/editor', () => {
    return Object.assign({}, { launchSubflow: jest.fn() });
});

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
    parameterListConfig: defaultParameterListConfig,
    viewableSubflowInfo: {
        masterLabel: 'Subflow Label',
        activeVersionId: 'av1',
        latestVersionId: 'av1'
    },
    editorParams: { isAutoLayoutCanvas: true }
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description',
    parameterList: 'builder_platform_interaction-parameter-list',
    typeMapping: 'builder_platform_interaction-entity-resource-picker',
    referencedFlowSection: '.test-referenced-flow',
    referencedFlowSectionHeader: '.test-referenced-flow .slds-text-heading_small',
    referencedFlowSectionCard: '.test-referenced-flow lightning-card',
    referencedFlowSectionCardButton: '.test-referenced-flow lightning-card lightning-button'
};

const getLabelDescription = (baseCalloutEditor) => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.labelDescription);
};

const getParameterList = (baseCalloutEditor) => {
    return baseCalloutEditor.shadowRoot.querySelector(selectors.parameterList);
};

const getTypeMappings = (baseCalloutEditor) => {
    return baseCalloutEditor.shadowRoot.querySelectorAll(selectors.typeMapping);
};

function createComponentForTest({
    labelDescriptionConfig = {},
    subtitle = '',
    elementType = ELEMENT_TYPE.ACTION_CALL,
    typeMappings = [],
    parameterListConfig = {},
    viewableSubflowInfo = null,
    editorParams = { isAutoLayoutCanvas: true }
} = {}) {
    const el = createElement('builder_platform_interaction-base-callout-editor', { is: BaseCalloutEditor });
    Object.assign(el, {
        elementType,
        subtitle,
        labelDescriptionConfig,
        typeMappings,
        parameterListConfig,
        viewableSubflowInfo,
        editorParams
    });
    setDocumentBodyChildren(el);
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

    describe('Referenced Flow Card', () => {
        it('Should not display the referenced flow section when viewableSubflowInfo is null', () => {
            const baseCalloutEditor = createComponentForTest();
            const referencedFlowSection = baseCalloutEditor.shadowRoot.querySelector(selectors.referencedFlowSection);
            expect(referencedFlowSection).toBeNull();
        });

        it('Should not display the referenced flow section when isAutolayoutCanvas is false', () => {
            const baseCalloutEditor = createComponentForTest(
                Object.assign({}, defaultBaseCalloutElement, { editorParams: { isAutolayoutCanvas: false } })
            );
            const referencedFlowSection = baseCalloutEditor.shadowRoot.querySelector(selectors.referencedFlowSection);
            expect(referencedFlowSection).toBeNull();
        });

        it('Should display the referenced flow section when viewableSubflowInfo is not null and isAutolayoutCanvas is true', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSection = baseCalloutEditor.shadowRoot.querySelector(selectors.referencedFlowSection);
            expect(referencedFlowSection).not.toBeNull();
        });

        it('Referenced flow section should have a heading', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSectionHeader = baseCalloutEditor.shadowRoot.querySelector(
                selectors.referencedFlowSectionHeader
            );
            expect(referencedFlowSectionHeader.textContent).toBe(LABELS.referencedFlowHeading);
        });

        it('Referenced flow section should have a lightning-card', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSectionCard = baseCalloutEditor.shadowRoot.querySelector(
                selectors.referencedFlowSectionCard
            );
            expect(referencedFlowSectionCard).not.toBeNull();
        });

        it('lightning-card should have the right title', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSectionCard = baseCalloutEditor.shadowRoot.querySelector(
                selectors.referencedFlowSectionCard
            );
            expect(referencedFlowSectionCard.title).toBe(defaultBaseCalloutElement.viewableSubflowInfo.masterLabel);
        });

        it('lightning-card should have the right icon name', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSectionCard = baseCalloutEditor.shadowRoot.querySelector(
                selectors.referencedFlowSectionCard
            );
            expect(referencedFlowSectionCard.iconName).toBe('standard:flow');
        });

        it('lightning-card should have a button with right label, title, icon name and icon position', () => {
            const baseCalloutEditor = createComponentForTest(defaultBaseCalloutElement);
            const referencedFlowSectionCardButton = baseCalloutEditor.shadowRoot.querySelector(
                selectors.referencedFlowSectionCardButton
            );
            expect(referencedFlowSectionCardButton.label).toBe(LABELS.openFlowButtonLabel);
            expect(referencedFlowSectionCardButton.title).toBe(LABELS.openFlowButtonTitle);
            expect(referencedFlowSectionCardButton.iconName).toBe('utility:new_window');
            expect(referencedFlowSectionCardButton.iconPosition).toBe('right');
        });
    });
});
