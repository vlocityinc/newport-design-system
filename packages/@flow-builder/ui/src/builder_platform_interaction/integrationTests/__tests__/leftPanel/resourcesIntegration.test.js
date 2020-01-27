import { createElement } from 'lwc';
import Editor from 'builder_platform_interaction/editor';
import { resetState } from '../integrationTestUtils';
import {
    getChevronElement,
    getResourceDetail,
    getLeftPanel,
    clickOnViewDetailButton,
    clickDeleteButtonInResourceDetailsPanel,
    getElementByTitle
} from '../leftPanelTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    stringConstant,
    decision1,
    decision1Outcome1,
    screenWithAddress,
    screenWithAddressAddress,
    flowWithAllElementsUIModel
} from 'mock/storeData';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { initializeAuraFetch } from '../serverDataTestUtils';
import { loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';

jest.mock('builder_platform_interaction/drawingLib', () =>
    require('builder_platform_interaction_mocks/drawingLib')
);

jest.mock('builder_platform_interaction/keyboardInteractionUtils', () =>
    require('builder_platform_interaction_mocks/keyboardInteractionUtils')
);

const PALETTE_RESOURCES_INDEX = 0;
const PALETTE_ELEMENTS_INDEX = 1;

const createEditorForTest = () => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
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
        await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW);
        store.dispatch(updateFlow(flowWithAllElementsUIModel));
        leftPanel = getLeftPanel(editor);
    });
    afterEach(() => {
        resetState();
    });
    it('Click on the chevron should display the resource details', async () => {
        const chevron = getChevronElement(
            leftPanel,
            PALETTE_RESOURCES_INDEX,
            stringConstant.guid
        );
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(100);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        const apiNameSpan = getElementByTitle(
            resourceDetails,
            stringConstant.name
        );
        expect(apiNameSpan).not.toBeNull();
        expect(apiNameSpan.textContent).toBe(stringConstant.name);
        const descriptionSpan = getElementByTitle(
            resourceDetails,
            stringConstant.description
        );
        expect(descriptionSpan).not.toBeNull();
        expect(descriptionSpan.textContent).toBe(stringConstant.description);
    });
    it('Delete a resource should remove it from the left panel', async () => {
        let chevron = getChevronElement(
            leftPanel,
            PALETTE_RESOURCES_INDEX,
            stringConstant.guid
        );
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(100);
        const resourceDetails = getResourceDetail(leftPanel);
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(
            leftPanel,
            PALETTE_RESOURCES_INDEX,
            stringConstant.guid
        );
        // Check the element has been deleted
        expect(chevron).toBeNull();
    });
    it('Delete a decision with outcomes should delete the outcome', async () => {
        let chevron = getChevronElement(
            leftPanel,
            PALETTE_ELEMENTS_INDEX,
            decision1.guid
        );
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(200);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(
            leftPanel,
            PALETTE_ELEMENTS_INDEX,
            decision1.guid
        );
        // Check the element has been deleted
        expect(chevron).toBeNull();

        chevron = getChevronElement(
            leftPanel,
            PALETTE_RESOURCES_INDEX,
            decision1Outcome1.guid
        );
        // Check the child element has also been deleted
        expect(chevron).toBeNull();
    });
    it('Delete a screen with a component should delete the component', async () => {
        let chevron = getChevronElement(
            leftPanel,
            PALETTE_ELEMENTS_INDEX,
            screenWithAddress.guid
        );
        expect(chevron).toBeDefined();
        clickOnViewDetailButton(chevron);
        await ticks(200);
        const resourceDetails = getResourceDetail(leftPanel);
        expect(resourceDetails).not.toBeNull();
        clickDeleteButtonInResourceDetailsPanel(resourceDetails);
        await ticks(100);
        chevron = getChevronElement(
            leftPanel,
            PALETTE_ELEMENTS_INDEX,
            screenWithAddress.guid
        );
        // Check the screen has been deleted
        expect(chevron).toBeNull();

        chevron = getChevronElement(
            leftPanel,
            PALETTE_RESOURCES_INDEX,
            screenWithAddressAddress.guid
        );
        // Check the component has also been deleted
        expect(chevron).toBeNull();
    });
});
