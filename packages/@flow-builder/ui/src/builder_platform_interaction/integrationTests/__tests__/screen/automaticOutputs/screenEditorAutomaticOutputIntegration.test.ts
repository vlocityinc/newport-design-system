import { Store, StoreReducer } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { flowWithScreenAndLightningComponentAddress } from 'mock/flows/flowWithScreenAndLightningComponentAddress';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { clearExtensionsCache } from 'builder_platform_interaction/flowExtensionLib';
import { initializeAuraFetch, createGetterByProcessType } from '../../serverDataTestUtils';
import { flowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { flowExtensionsForFlow as mockFlowExtensions } from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { translateFlowToUIAndDispatch } from '../../integrationTestUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = FLOW_PROCESS_TYPE.FLOW;

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        isLookupTraversalSupported: jest.fn(() => {
            return true;
        }),
        isGlobalVariablesSupported: jest.fn(() => {
            return true;
        }),
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn((processType) => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
    };
});

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

const getTitleFromExtensionPropertiesEditorElement = (screenEditor: ScreenEditorTestComponent) => {
    return screenEditor
        .getPropertiesEditorContainerElement()
        .getExtensionPropertiesEditor()!
        .element.shadowRoot!.querySelector('h3');
};

describe('ScreenEditor', () => {
    let screenNode, store;
    let screenEditor: ScreenEditorTestComponent;
    beforeEach(() => {
        clearExtensionsCache();
    });
    afterEach(() => {
        clearExtensionsCache();
    });
    describe('existing flow with a screen lightning component : Address and automatic value output', () => {
        beforeAll(() => {
            initializeAuraFetch({
                'c.getFlowExtensionDetails': (params) => ({
                    data: params.names.reduce((obj, name) => {
                        obj[name] = flowExtensionDetails[name];
                        return obj;
                    }, {})
                }),
                'c.getFlowExtensions': createGetterByProcessType({
                    [FLOW_PROCESS_TYPE.FLOW]: mockFlowExtensions
                })
            });
            store = Store.getStore(reducer as StoreReducer);
            translateFlowToUIAndDispatch(flowWithScreenAndLightningComponentAddress, store);
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        describe('Test component values', () => {
            beforeEach(async () => {
                const element = getElementByDevName('ScreenFlowAskAdress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE,
                        node: screenNode
                    })
                );
                await ticks(50);
                await screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('askAddress')!.click();
            });
            it('Advanced Option checkbox should be unchecked', async () => {
                expect(
                    screenEditor
                        .getPropertiesEditorContainerElement()
                        .getExtensionPropertiesEditor()!
                        .getAdvancedOptionsCheckbox()
                ).not.toEqual(null);
                expect(
                    screenEditor
                        .getPropertiesEditorContainerElement()
                        .getExtensionPropertiesEditor()!
                        .isAdvancedOptionsChecked()
                ).toBe(false);
            });
            it('Output value should not be visible', async () => {
                expect(getTitleFromExtensionPropertiesEditorElement(screenEditor)).toBeNull();
            });
        });
        describe('modify from automatic to advanced', () => {
            beforeEach(async () => {
                const element = getElementByDevName('ScreenFlowAskAdress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                    })
                );
                await ticks(50);
                screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('askAddress')!.click();
                await ticks(50);
            });
            it('should display the outputs', async () => {
                await screenEditor
                    .getPropertiesEditorContainerElement()
                    .getExtensionPropertiesEditor()!
                    .setAdvancedOptions(true);
                expect(
                    screenEditor
                        .getPropertiesEditorContainerElement()
                        .getExtensionPropertiesEditor()!
                        .isAdvancedOptionsChecked()
                ).toBe(true);
                expect(getTitleFromExtensionPropertiesEditorElement(screenEditor)!.textContent).toBe(
                    'FlowBuilderScreenEditor.extensionOutputsHeader'
                );
            });
        });
    });
});
