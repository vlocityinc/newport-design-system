import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';
import { invokeModal, commonUtils } from 'builder_platform_interaction/sharedUtils';
import { Keys } from 'builder_platform_interaction/contextualMenuUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { text2, number2, section1 } from 'mock/storeData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const { format } = commonUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/sharedUtils');
    return Object.assign({}, actual, {
        invokeModal: jest.fn(),
        commonUtils: {
            format: jest.fn((formatString, ...args) => formatString + '(' + args.toString() + ')')
        }
    });
});

jest.mock(
    '@salesforce/label/FlowBuilderScreenEditor.deleteConsequence',
    () => ({ default: "Are you sure you want to delete this component? You can't undo this action." }),
    { virtual: true }
);

describe('ScreenEditor canvas', () => {
    let screenEditor: ScreenEditorTestComponent;

    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('Screen with section (no automatic fields)', () => {
        describe('Deletion', () => {
            beforeAll(async () => {
                const element = getElementByDevName('ScreenWithSection');
                const screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    })
                );
            });
            it('cannot delete a component that is referenced somewhere else in the same screen', async () => {
                // slider value is used for the component visibility for Accounts component
                const slider1 = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('slider_1');
                expect(slider1).toBeTruthy();
                slider1!.clickDelete();
                expect(invokeModal).toBeCalledWith(
                    expect.objectContaining({
                        bodyData: expect.objectContaining({
                            listSectionItems: expect.arrayContaining([expect.objectContaining({ name: 'accounts' })])
                        })
                    })
                );
            });
            it('can delete a component that is not referenced elsewhere in the flow', async () => {
                const accounts = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('accounts');
                expect(accounts).toBeTruthy();
                accounts!.clickDelete();
                expect(invokeModal).toBeCalledWith(
                    expect.objectContaining({
                        bodyData: expect.objectContaining({
                            bodyTextOne: "Are you sure you want to delete this component? You can't undo this action."
                        })
                    })
                );
            });
            it('cannot delete a component that is referenced in another element', async () => {
                const address = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('address_2');
                expect(address).toBeTruthy();
                address!.clickDelete();
                expect(invokeModal).toBeCalledWith(
                    expect.objectContaining({
                        bodyData: expect.objectContaining({
                            listSectionItems: expect.arrayContaining([
                                expect.objectContaining({ name: 'displayTextUsingResources' })
                            ])
                        })
                    })
                );
            });
        });
        describe('Highlight', () => {
            it('does not display the header badge (address screen field)', () => {
                const badge = screenEditor
                    .getCanvas()
                    .getScreenEditorHighlightForScreenFieldWithName('address_2')!
                    .getHeaderAutomaticFieldBadge();
                expect(badge).toBeNull();
            });
        });
        describe('screen canvas keyboard interactions', () => {
            beforeEach(async () => {
                const element = getElementByDevName('ScreenWithSection');
                const screenNode = getElementForPropertyEditor(element);
                screenEditor = new ScreenEditorTestComponent(
                    createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    })
                );
            });
            /* Layout of Screen Canvas
                - ScreenWithSection_Section1 (sectionComp)
                    - ScreenWithSection_Section1_Column1
                        - slider_1
                - number_2
                - ScreenWithSection_Section2
                    - ScreenWithSection_Section2_Column1
                        - text_2
                        - dateTimeInSection
                    - ScreenWithSection_Section2_Column2
                        - email_2
                        - accounts
                - address_2
            */
            describe('move a component', () => {
                describe('in main canvas', () => {
                    let comp;
                    beforeEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(section1.name);
                        expect(comp).toBeTruthy();
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                        comp!.pressKey(Keys.ArrowDown);
                        await ticks(1);
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(section1.name);
                        comp!.pressKey(Keys.ArrowDown);
                        await ticks(1);
                    });
                    afterEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(section1.name);
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                    });
                    it('screen node is updated and aria text is set correctly', () => {
                        // slider value is used for the component visibility for Accounts component
                        const updatedScreen = screenEditor.getScreenNode();
                        const compGuid = getElementByDevName(section1.name)!.guid;
                        const screenEditorCanvas = screenEditor.getScreenEditorCanvas();
                        let expectedString = format(LABELS.componentAriaLabel, section1.type.label, section1.name);
                        expectedString += format(LABELS.componentCurrentPosition, 3, 4);
                        expect(updatedScreen.getFieldIndexesByGUID(compGuid)).toEqual([2]);
                        expect(screenEditorCanvas.getAriaLiveText()).toEqual(expectedString);
                    });
                });
                describe('in section', () => {
                    let comp;
                    beforeEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(text2.name);
                        expect(comp).toBeTruthy();
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                        comp!.pressKey(Keys.ArrowRight);
                        await ticks(1);
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(text2.name);
                        comp!.pressKey(Keys.ArrowDown);
                        await ticks(1);
                    });
                    afterEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(text2.name);
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                    });
                    it('screen node is updated and aria text is set correctly', async () => {
                        // slider value is used for the component visibility for Accounts component
                        const updatedScreen = screenEditor.getScreenNode();
                        const compGuid = getElementByDevName(text2.name)!.guid;
                        const screenEditorCanvas = screenEditor.getScreenEditorCanvas();
                        let expectedString = format(LABELS.componentAriaLabel, text2.type.label, text2.name);
                        expectedString += format(LABELS.columnPosition, 2, 2);
                        expectedString += format(LABELS.componentCurrentPosition, 2, 3);
                        expect(updatedScreen.getFieldIndexesByGUID(compGuid)).toEqual([1, 1, 2]);
                        expect(screenEditorCanvas.getAriaLiveText()).toEqual(expectedString);
                    });
                });
            });
            describe('cancel moving a component', () => {
                describe('originally in main canvas', () => {
                    let comp;
                    beforeEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(number2.name);
                        expect(comp).toBeTruthy();
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                        comp!.pressKey(Keys.ArrowUp);
                        await ticks(1);
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(number2.name);
                        comp!.pressKey(Keys.Escape);
                        await ticks(1);
                    });
                    it('screen node is updated and aria text is set correctly', () => {
                        // slider value is used for the component visibility for Accounts component
                        const updatedScreen = screenEditor.getScreenNode();
                        const compGuid = getElementByDevName(number2.name)!.guid;
                        const screenEditorCanvas = screenEditor.getScreenEditorCanvas();
                        let expectedString = format(LABELS.componentDroppedMessage, number2.type.label, number2.name);
                        expectedString += format(LABELS.componentFinalPosition, 2, 4);
                        expect(updatedScreen.getFieldIndexesByGUID(compGuid)).toEqual([1]);
                        expect(screenEditorCanvas.getAriaLiveText()).toEqual(expectedString);
                    });
                });
                describe('originally in section', () => {
                    let comp;
                    beforeEach(async () => {
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(text2.name);
                        expect(comp).toBeTruthy();
                        comp!.pressKey(Keys.Space);
                        await ticks(1);
                        comp!.pressKey(Keys.ArrowUp);
                        await ticks(1);
                        comp = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName(text2.name);
                        comp!.pressKey(Keys.Escape);
                        await ticks(1);
                    });
                    it('screen node is updated and aria text is set correctly', async () => {
                        // slider value is used for the component visibility for Accounts component
                        const updatedScreen = screenEditor.getScreenNode();
                        const compGuid = getElementByDevName(text2.name)!.guid;
                        const screenEditorCanvas = screenEditor.getScreenEditorCanvas();
                        let expectedString = format(LABELS.componentDroppedMessage, text2.type.label, text2.name);
                        expectedString += format(LABELS.columnPosition, 1, 2);
                        expectedString += format(LABELS.componentFinalPosition, 1, 2);
                        expect(updatedScreen.getFieldIndexesByGUID(compGuid)).toEqual([0, 0, 2]);
                        expect(screenEditorCanvas.getAriaLiveText()).toEqual(expectedString);
                    });
                });
            });
        });
    });
    describe('Screen without section with automatic fields', () => {
        beforeAll(async () => {
            const element = getElementByDevName('screenWithAutomaticFields');
            const screenNode = getElementForPropertyEditor(element);
            screenEditor = new ScreenEditorTestComponent(
                createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                })
            );
        });
        describe('Highlight', () => {
            it('displays the header badge with the correct label and CSS class', () => {
                const badge = screenEditor
                    .getCanvas()
                    .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                    .getHeaderAutomaticFieldBadge();
                expect(badge).not.toBeNull();
                expect(badge!.label).toEqual('FlowBuilderScreenEditor.automaticFieldHighlightHeaderFieldLabel');
                expect(badge!.className).toEqual('slds-m-left_xx-small automatic-field-badge');
            });
        });
    });
});
