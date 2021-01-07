import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createComponentUnderTest,
    getComponentsPaletteInFirstTab,
    getAutomaticFieldsPaletteInSecondTab
} from '../../screenEditorTestUtils';

describe('ScreenEditor automatic fields', () => {
    let screenNode;
    let screenEditor;
    describe('Existing flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
            const element = getElementByDevName('screenWithAddress');
            screenNode = getElementForPropertyEditor(element);
            screenEditor = createComponentUnderTest({
                node: screenNode,
                processType: FLOW_PROCESS_TYPE.FLOW
            });
        });
        afterAll(() => {
            resetState();
        });
        describe('Test screen editor tabs', () => {
            it('should contain in first tab the components palette', () => {
                expect(getComponentsPaletteInFirstTab(screenEditor)).not.toBeNull();
            });
            it('should contain in second tab the automatic field palette', () => {
                expect(getAutomaticFieldsPaletteInSecondTab(screenEditor)).not.toBeNull();
            });
        });
    });
});
