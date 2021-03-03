/* eslint-disable @lwc/lwc/no-async-operation */
// @ts-nocheck
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { flowExtensionsForFlow as mockFlowExtensions } from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

/* This jest mock was added to create the actual scenario in screenEditor when extensions are delayed.
   We control the delay by using setTimeout and jest timers.
   The delay allows us to control when the function getExtensionFieldTypes returns the promise.
*/
jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/flowExtensionLib');
    return Object.assign({}, actual, {
        getExtensionFieldTypes: jest.fn(
            async () =>
                new Promise((resolve) =>
                    setTimeout(() => {
                        let mockFlowExtensionToReturn = JSON.parse(JSON.stringify(mockFlowExtensions));
                        mockFlowExtensionToReturn = mockFlowExtensionToReturn.filter(
                            (extension) => extension.qualifiedApiName === 'flowruntime:address'
                        );
                        return resolve(mockFlowExtensionToReturn);
                    }, 200)
                )
        )
    });
});

describe('ScreenEditor Flow Extension Integration', () => {
    let screenNode;
    let screenEditor: ScreenEditorTestComponent;
    afterAll(() => {
        resetState();
        jest.clearAllTimers();
    });
    it("When screen extension is selected on canvas before extensions are returned, extensions property editor shouldn't disappear when extensions are returned", async () => {
        jest.useFakeTimers();
        await setupStateForFlow(flowWithAllElements);
        const element = getElementByDevName('screenWithAddress');
        screenNode = getElementForPropertyEditor(element);
        screenEditor = new ScreenEditorTestComponent(
            createComponentUnderTest({
                processType: FLOW_PROCESS_TYPE.FLOW,
                node: screenNode
            })
        );
        await ticks(50);
        await screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('Address')!.click();
        jest.advanceTimersByTime(300);
        await ticks(1);
        const extensionPropertiesEditor = screenEditor
            .getPropertiesEditorContainerElement()
            .getExtensionPropertiesEditor();
        expect(extensionPropertiesEditor!.getApiNameScreenPropertyField()).not.toEqual(null);
    });
});
