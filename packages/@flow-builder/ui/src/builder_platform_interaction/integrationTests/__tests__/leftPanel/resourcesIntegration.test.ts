// @ts-nocheck
import { createElement } from 'lwc';
import Editor from 'builder_platform_interaction/editor';
import { resetState, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import {
    getChevronElement,
    getResourceDetail,
    getLeftPanel,
    clickOnViewDetailButton,
    clickDeleteButtonInResourceDetailsPanel,
    getElementByTitle,
    PALETTE_ELEMENTS_INDEX
} from '../leftPanelTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { initializeAuraFetch } from '../serverDataTestUtils';
import { loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';

jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));
jest.mock('builder_platform_interaction/flcBuilder', () => require('builder_platform_interaction_mocks/flcBuilder'));

jest.mock('builder_platform_interaction/keyboardInteractionUtils', () =>
    require('builder_platform_interaction_mocks/keyboardInteractionUtils')
);

const createEditorForTest = () => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    el.builderMode = 'editMode';
    el.builderConfig = {
        componentConfigs: {
            editMode: {
                leftPanelConfig: {
                    showLeftPanel: true
                }
            }
        }
    };
    document.body.appendChild(el);
    return el;
};

describe('Resource tab - resource', () => {
    let editor, store;
    let leftPanel;
    beforeEach(async () => {
        editor = createEditorForTest();
        store = Store.getStore();
        initializeAuraFetch();
        await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW).loadPeripheralMetadataPromise;
        translateFlowToUIAndDispatch(flowWithAllElements, store);
        leftPanel = getLeftPanel(editor);
    });
    afterEach(() => {
        resetState();
    });
    it('Click on the chevron should display the resource details', async () => {
        const stringConstant = getElementByDevName('stringConstant');
        const chevron = getChevronElement(leftPanel, stringConstant.guid);
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(100);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        const apiNameSpan = getElementByTitle(resourceDetails, stringConstant.name);
        expect(apiNameSpan).not.toBeNull();
        expect(apiNameSpan.textContent).toBe(stringConstant.name);
        const descriptionSpan = getElementByTitle(resourceDetails, stringConstant.description);
        expect(descriptionSpan).not.toBeNull();
        expect(descriptionSpan.textContent).toBe(stringConstant.description);
    });
    it('Delete a resource should remove it from the left panel', async () => {
        const stringConstant = getElementByDevName('stringConstant');
        let chevron = getChevronElement(leftPanel, stringConstant.guid);
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(100);
        const resourceDetails = getResourceDetail(leftPanel);
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(leftPanel, stringConstant.guid);
        // Check the element has been deleted
        expect(chevron).toBeNull();
    });
    it('Delete a decision with one outcome should delete the outcome', async () => {
        const decision1 = getElementByDevName('decision1');
        const decision1Outcome1 = getElementByDevName('outcome1');
        let chevron = getChevronElement(leftPanel, decision1.guid, PALETTE_ELEMENTS_INDEX);
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(200);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(leftPanel, decision1.guid, PALETTE_ELEMENTS_INDEX);
        // Check the element has been deleted
        expect(chevron).toBeNull();

        chevron = getChevronElement(leftPanel, decision1Outcome1.guid);
        // Check the child element has also been deleted
        expect(chevron).toBeNull();
    });
    it('Delete a screen with a component should delete the component', async () => {
        const screenWithAddress = getElementByDevName('screenWithAddress');
        const addressComponentField = getElementByDevName('Address');
        let chevron = getChevronElement(leftPanel, screenWithAddress.guid, PALETTE_ELEMENTS_INDEX);
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(200);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(leftPanel, screenWithAddress.guid, PALETTE_ELEMENTS_INDEX);
        // Check the screen has been deleted
        expect(chevron).toBeNull();

        chevron = getChevronElement(leftPanel, addressComponentField.guid);
        // Check the component has also been deleted
        expect(chevron).toBeNull();
    });
});
