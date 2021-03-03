import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { InputsOnNextNavToAssocScrnOption } from 'builder_platform_interaction/screenEditorUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

describe('ScreenEditor', () => {
    let screenNode;
    let screenEditor: ScreenEditorTestComponent;
    describe('Existing flow with a screen lightning component: "Address" in USE_STORED_VALUES mode', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        describe('Test component values', () => {
            beforeEach(async () => {
                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    })
                );
                await ticks(50);
                await screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('Address')!.click();
            });
            it('InputsOnNextNavToAssocScrn should be in USE_STORED_VALUES mode', () => {
                expect(
                    screenEditor
                        .getPropertiesEditorContainerElement()
                        .getExtensionPropertiesEditor()!
                        .getInputsOnNextNavToAssocScrnOption()
                ).toEqual(InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES);
            });
        });
        describe('Switch from USE_STORED_VALUES to RESET_VALUES', () => {
            beforeEach(async () => {
                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    })
                );
                await ticks(50);
                await screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('Address')!.click();
            });
            it('Should update the radio group', async () => {
                await screenEditor
                    .getPropertiesEditorContainerElement()
                    .getExtensionPropertiesEditor()!
                    .setInputsOnNextNavToAssocScrnOption(InputsOnNextNavToAssocScrnOption.RESET_VALUES);
                expect(
                    screenEditor
                        .getPropertiesEditorContainerElement()
                        .getExtensionPropertiesEditor()!
                        .getInputsOnNextNavToAssocScrnOption()
                ).toEqual(InputsOnNextNavToAssocScrnOption.RESET_VALUES);
            });
        });
    });
});
