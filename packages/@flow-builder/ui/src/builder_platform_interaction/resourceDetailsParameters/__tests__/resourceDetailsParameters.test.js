import { createElement } from 'lwc';
import { describeExtension } from 'builder_platform_interaction/screenEditorUtils';
import ResourceDetailsParameters from 'builder_platform_interaction/resourceDetailsParameters';
import { mockExtensionScreenfieldAutomaticOutputsModeResourceDetails } from 'mock/resourceDetailsData';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';

const createComponentUnderTest = resourceDetails => {
    const el = createElement(
        'builder_platform_interaction-resource-details-parameters',
        {
            is: ResourceDetailsParameters
        }
    );
    el.resourceDetails = resourceDetails;
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/screenEditorUtils', () => ({
    describeExtension: jest.fn(() =>
        Promise.resolve(mockFlowRuntimeEmailFlowExtensionDescription)
    )
}));

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const SELECTORS = { SPINNER: '.spinner' };

const EXPECTED_MOCK_ORDERED_PARAMETERS_FOR_LC_EMAIL_IN_AUTO_MODE = [
    {
        apiName: 'disabled',
        label: 'Disabled',
        description: 'Prevents the user from modifying or copying the value.',
        typeIconName: 'utility:crossfilter'
    },
    {
        apiName: 'label',
        label: 'Label',
        description: 'The label that appears above the email field.',
        typeIconName: 'utility:text'
    },
    {
        apiName: 'placeholder',
        label: 'Placeholder Text',
        description:
            "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
        typeIconName: 'utility:text'
    },
    {
        apiName: 'readonly',
        label: 'Read Only',
        description:
            'Prevents the user from modifying the value, but not from copying it.',
        typeIconName: 'utility:crossfilter'
    },
    {
        apiName: 'required',
        label: 'Required',
        description: 'Requires the user to enter a value.',
        typeIconName: 'utility:crossfilter'
    },
    {
        apiName: 'value',
        label: 'Value',
        description:
            "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        typeIconName: 'utility:text'
    }
];

describe('Resource Details parameters', () => {
    let resourceDetailsParametersComponent;
    describe('Extension (ie: ligthning component) screenfield in automatic outputs mode', () => {
        describe('No fetch exception', () => {
            beforeEach(() => {
                resourceDetailsParametersComponent = createComponentUnderTest(
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails
                );
            });
            describe('Parameters fetch server call OK and NO error', () => {
                test('check "Parameters" details (via API)', () => {
                    const parameters =
                        resourceDetailsParametersComponent.parameters;
                    expect(parameters).toEqual(
                        EXPECTED_MOCK_ORDERED_PARAMETERS_FOR_LC_EMAIL_IN_AUTO_MODE
                    );
                });
                test('check UI: icon names, tooltip, labels...(snapshot) parameters displayed', () => {
                    expect(
                        resourceDetailsParametersComponent
                    ).toMatchSnapshot();
                });
            });
            describe('Parameters fetch server call OK but error', () => {
                beforeAll(() => {
                    describeExtension.mockImplementation(() =>
                        Promise.reject(
                            new Error(
                                'An error occured during extension parameters fetching'
                            )
                        )
                    );
                });
                test('check "Parameters" details (via API)', () => {
                    const parameters =
                        resourceDetailsParametersComponent.parameters;
                    expect(parameters).toHaveLength(0);
                });
                test('check UI: icon names, tooltip, labels (snapshot) no parameters displayed', () => {
                    expect(
                        resourceDetailsParametersComponent
                    ).toMatchSnapshot();
                });
            });
        });
        describe('Fetch exception', () => {
            test('spinner should not be displayed)', () => {
                describeExtension.mockImplementation(() => {
                    throw new Error('Runtime exception this time');
                });
                resourceDetailsParametersComponent = createComponentUnderTest(
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails
                );
                const spinner = resourceDetailsParametersComponent.shadowRoot.querySelector(
                    SELECTORS.spinner
                );
                expect(spinner).toBeNull();
            });
        });
    });
});
