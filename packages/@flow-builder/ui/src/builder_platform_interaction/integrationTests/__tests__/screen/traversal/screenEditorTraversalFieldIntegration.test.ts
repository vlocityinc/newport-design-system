import { Store, StoreReducer } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, translateFlowToUIAndDispatch } from '../../integrationTestUtils';
import { initializeAuraFetch } from '../../serverDataTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { selectGroupedComboboxItemBy } from '../../groupedComboboxTestUtils';
import { initializeLoader, loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const getCombobox = (extensionPropertiesEditor) => {
    return deepQuerySelector(extensionPropertiesEditor, [
        SELECTORS.SCREEN_EXTENSION_ATTRIBUTE_EDITOR,
        SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR,
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    ]);
};

const getGroupedCombobox = (extensionPropertiesEditor) => {
    const combobox = getCombobox(extensionPropertiesEditor);
    return combobox.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};

describe('ScreenEditor', () => {
    let screenNode, store;
    let screenEditor: ScreenEditorTestComponent;
    describe('existing flow with a screen lightning component : Address or fileUpload, and an account variable', () => {
        beforeAll(async () => {
            store = Store.getStore(reducer as StoreReducer);
            initializeAuraFetch();
            initializeLoader(store);
        });
        afterAll(() => {
            resetState();
        });
        describe('Process type supports lookup traversal', () => {
            beforeEach(async () => {
                translateFlowToUIAndDispatch(flowWithAllElements, store);
                await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW).loadPeripheralMetadataPromise;

                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    })
                );
                await ticks(50);
                screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('Address')!.click();
                await ticks(50);
            });
            it('shows up chevrons on fields', async () => {
                const extensionPropertiesEditor = screenEditor
                    .getPropertiesEditorContainerElement()
                    .getExtensionPropertiesEditor();
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const combobox = getCombobox(extensionPropertiesEditor!.element);
                combobox.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getGroupedCombobox(extensionPropertiesEditor!.element);
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    ['{!accountSObjectVariable}', '{!accountSObjectVariable.CreatedBy}'],
                    { blur: false }
                );

                expect(accountCreatedByItem.rightIconName).toBe('utility:chevronright');
            });
        });
        describe('Process type does not support lookup traversal', () => {
            beforeEach(async () => {
                translateFlowToUIAndDispatch(fieldServiceMobileFlow, store);
                await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE).loadPeripheralMetadataPromise;

                const element = getElementByDevName('screenWithFileUpload');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        processType: FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE,
                        node: screenNode
                    })
                );
                await ticks(1000);
                screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('FileUpload')!.click();
                await ticks(70);
            });
            it('does not show up chevrons on fields', async () => {
                const extensionPropertiesEditor = screenEditor
                    .getPropertiesEditorContainerElement()
                    .getExtensionPropertiesEditor();
                const groupedCombobox = getGroupedCombobox(extensionPropertiesEditor!.element);
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    ['{!vMyTestAccount}', '{!vMyTestAccount.CreatedBy}'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    ['{!vMyTestAccount}', '{!vMyTestAccount.CreatedById}'],
                    { blur: false }
                );

                expect(accountCreatedByIdItem).not.toEqual(null);
                expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
            });
        });
    });
});
