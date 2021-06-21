import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/sharedUtils');
    return Object.assign({}, actual, {
        invokeModal: jest.fn()
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
