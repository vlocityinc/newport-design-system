import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks,
    lightningRadioGroupChangeEvent
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { InputsNextBehaviorOption } from 'builder_platform_interaction/screenEditorUtils';
import {
    createComponentUnderTest,
    getCanvasScreenFieldElement,
    getExtensionPropertiesEditorElement
} from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getInputsNextBehaviorRadioButtons = (screenEditor) => {
    return getExtensionPropertiesEditorElement(screenEditor).shadowRoot.querySelector(SELECTORS.LIGHTNING_RADIO_GROUP);
};

describe('ScreenEditor', () => {
    let screenNode;
    let screenEditor;
    describe('Existing flow with a screen lightning component: "Address" in REMEMBER mode', () => {
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
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(screenEditor, 'Address');
                addressElement.click();
                await ticks(50);
            });
            it('Inputs Next Behavior should be in REMEMBER mode', () => {
                expect(getInputsNextBehaviorRadioButtons(screenEditor)).toBeDefined();
                expect(getInputsNextBehaviorRadioButtons(screenEditor).value).toEqual(
                    InputsNextBehaviorOption.REMEMBER
                );
            });
        });
        describe('Switch from REMEMBER to RECALCULATE', () => {
            beforeEach(async () => {
                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(screenEditor, 'Address');
                addressElement.click();
                await ticks(50);
            });
            it('Should update the radio group', async () => {
                const inputsNextBehaviorRadioGroup = getInputsNextBehaviorRadioButtons(screenEditor);
                inputsNextBehaviorRadioGroup.dispatchEvent(
                    lightningRadioGroupChangeEvent(InputsNextBehaviorOption.RECALCULCATE)
                );
                await ticks(50);
                expect(getInputsNextBehaviorRadioButtons(screenEditor)).toBeDefined();
                expect(getInputsNextBehaviorRadioButtons(screenEditor).value).toEqual(
                    InputsNextBehaviorOption.RECALCULCATE
                );
            });
        });
    });
});
