import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { createChoice } from 'builder_platform_interaction/elementFactory';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import {
    createComponentUnderTest,
    ScreenCanvasTestComponent,
    ScreenEditorTestComponent,
    RowTestComponent,
    ChoicePropertiesEditorTestComponent
} from '../../screenEditorTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import {
    setNextInlineResource,
    addNewResourceEventListener,
    removeNewResourceEventListener,
    addEditResourceEventListener,
    removeEditResourceEventListener
} from '../../resourceTestUtils';
import { ComboboxTestComponent } from '../../comboboxTestUtils';

jest.mock('@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelChoice', () => ({ default: 'Choice' }), {
    virtual: true
});

jest.mock(
    '@salesforce/label/FlowBuilderExpressionUtils.newTypedResourceLabel',
    () => ({ default: 'New {0} Resource' }),
    {
        virtual: true
    }
);

jest.mock(
    '@salesforce/label/FlowBuilderExpressionUtils.quickCreateResourceLabel',
    () => ({ default: "Create '{0}' {1}" }),
    { virtual: true }
);

describe('ScreenEditor choice components', () => {
    let screenEditor: ScreenEditorTestComponent;
    const createScreenEditor = async (elementName) => {
        const element = getElementByDevName(elementName);
        const screenNode = getElementForPropertyEditor(element);
        const screenEditor = createComponentUnderTest({
            node: screenNode,
            processType: FLOW_PROCESS_TYPE.FLOW
        });
        const editor = new ScreenEditorTestComponent(screenEditor);
        await ticks(50);
        return editor;
    };
    describe('Existing flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        describe('Quick inline choice creation', () => {
            let canvas: ScreenCanvasTestComponent;
            let choicePropertyEditor: ChoicePropertiesEditorTestComponent | undefined;
            let choicePicker: ComboboxTestComponent | null | undefined;

            beforeAll(async () => {
                screenEditor = await createScreenEditor('ScreenWithSection');
                canvas = screenEditor.getCanvas();
                const accounts = canvas.getScreenEditorHighlightForScreenFieldWithName('accounts');
                await accounts!.click();
                choicePropertyEditor = screenEditor
                    .getPropertiesEditorContainer()
                    .getChoiceFieldPropertiesEditorElement();
                choicePicker = choicePropertyEditor?.getChoicePicker();
                addNewResourceEventListener();
            });
            afterAll(() => {
                removeNewResourceEventListener();
            });

            it('Create the choice automatically with the user specified name when the user selects the quick create option', async () => {
                const inlineChoice = createChoice({
                    name: 'newChoice',
                    dataType: FLOW_DATA_TYPE.STRING.value
                });
                setNextInlineResource(inlineChoice);
                choicePicker?.typeLiteralValue('mustard');
                await choicePicker?.selectItemBy('text', ['mustard'], { clearText: false });
                expect(choicePicker?.element.value).toMatchObject({
                    dataType: 'String',
                    displayText: '{!mustard}',
                    text: 'mustard'
                });
            });
            it('Create the choice automatically with the default name when the user selects the new resource option', async () => {
                const inlineChoice = createChoice({
                    name: 'newChoice',
                    dataType: FLOW_DATA_TYPE.STRING.value
                });
                setNextInlineResource(inlineChoice);
                await choicePicker?.selectItemBy('text', ['New Choice Resource']);
                expect(choicePicker?.element.value).toMatchObject({
                    dataType: 'String',
                    displayText: '{!newChoice}',
                    text: 'newChoice'
                });
            });
        });
        describe('Inline choice editing', () => {
            let canvas: ScreenCanvasTestComponent;
            let choicePropertyEditor: ChoicePropertiesEditorTestComponent | undefined;
            let choiceRowList: RowTestComponent[] | null | undefined;
            let choicePicker: ComboboxTestComponent | null | undefined;

            beforeAll(async () => {
                screenEditor = await createScreenEditor('ScreenWithSection');
                canvas = screenEditor.getCanvas();
                const accounts = canvas.getScreenEditorHighlightForScreenFieldWithName('accounts');
                await accounts!.click();
                choicePropertyEditor = screenEditor
                    .getPropertiesEditorContainer()
                    .getChoiceFieldPropertiesEditorElement();
                choicePicker = choicePropertyEditor?.getChoicePicker();
                choiceRowList = choicePropertyEditor?.getChoiceRows();
            });
            afterAll(() => {});
            it('Fires a editelement event when a choice edit button is clicked', async () => {
                expect(choiceRowList).not.toBeNull();
                expect(choiceRowList!.length).toBeGreaterThan(0);
                const editButton = choiceRowList![0].getEditButton();
                expect(editButton).not.toBeNull();
                const callback = jest.fn(() => {});
                window.addEventListener('editelement', callback);
                editButton!.click();
                expect(callback).toHaveBeenCalled();
            });
            it('Screen editor gets updated correctly when we inline edit a choice ', async () => {
                addEditResourceEventListener();
                const staticChoice = getElementByDevName('other');
                expect(staticChoice).not.toBeNull();
                if (staticChoice) {
                    staticChoice.name = 'editedChoice';
                }
                setNextInlineResource(staticChoice);
                const editButton = choiceRowList![1].getEditButton();
                expect(editButton).not.toBeNull();
                editButton!.click();
                await ticks(1);
                expect(choicePicker?.element.value).toMatchObject({
                    dataType: 'String',
                    displayText: '{!editedChoice}',
                    text: 'editedChoice'
                });
                removeEditResourceEventListener();
            });
        });
    });
});
