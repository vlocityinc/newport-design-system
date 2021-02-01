// @ts-nocheck
import { createElement } from 'lwc';
import Editor from 'builder_platform_interaction/editor';
import { resetState, translateFlowToUIAndDispatch, loadFlow } from '../integrationTestUtils';
import {
    getChevronElement,
    getResourceDetail,
    getLeftPanel,
    clickOnViewDetailButton,
    clickDeleteButtonInResourceDetailsPanel,
    getElementByTitle,
    PALETTE_ELEMENTS_INDEX,
    PALETTE_RESOURCES_INDEX,
    getUsedByContentItem
} from '../leftPanelTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { initializeAuraFetch } from '../serverDataTestUtils';
import { loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';

jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));
jest.mock('builder_platform_interaction/flcBuilder', () => require('builder_platform_interaction_mocks/flcBuilder'));

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

jest.mock('builder_platform_interaction/screenFieldTypeLib', () => {
    return {
        setSupportedScreenFieldTypes: jest.fn()
    };
});

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
    setDocumentBodyChildren(el);
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
    describe('Automatic fields', () => {
        const getChildrenElementsGuidsRecursively = (elementGuid: UI.Guid): UI.Guid[] => {
            const element = getElementByGuid(elementGuid);
            if (!element.childReferences) {
                return [];
            }
            return element.childReferences.reduce<UI.Guid[]>(
                (acc, { childReference }) => [
                    ...acc,
                    childReference,
                    ...getChildrenElementsGuidsRecursively(childReference)
                ],
                []
            );
        };
        const getAutomaticFieldElement = (screenElementName, objectFieldReference) => {
            const objectFieldReferenceParts = objectFieldReference.split('.');
            const objectReferenceElement = getElementByDevName(objectFieldReferenceParts[0]);
            const objectFieldRefenceWithGuid = [
                objectReferenceElement.guid,
                ...objectFieldReferenceParts.slice(1)
            ].join('.');
            const screenElement = getElementByDevName(screenElementName);
            const childrenElementsGuids = getChildrenElementsGuidsRecursively(screenElement.guid);
            const automaticFieldGuid = childrenElementsGuids.find(
                (guid) => getElementByGuid(guid).objectFieldReference === objectFieldRefenceWithGuid
            );
            return getElementByGuid(automaticFieldGuid);
        };
        it('should not show up in the resource manager Screen Component section', () => {
            const automaticFieldElement = getAutomaticFieldElement(
                'screenWithAutomaticFieldsInSection',
                'accountSObjectVariable.Name'
            );
            let chevron = getChevronElement(leftPanel, automaticFieldElement.guid, PALETTE_RESOURCES_INDEX);
            expect(chevron).toBeNull();
            chevron = getChevronElement(leftPanel, automaticFieldElement.guid, PALETTE_ELEMENTS_INDEX);
            expect(chevron).toBeNull();
        });
        it('should appear in the resource detail of a variable if the automatic fields references a variable field', async () => {
            const accountVariableElement = getElementByDevName('accountSObjectVariable');
            const chevron = getChevronElement(leftPanel, accountVariableElement.guid);
            clickOnViewDetailButton(chevron);
            await ticks(100);
            const resourceDetails = getResourceDetail(leftPanel);
            expect(getUsedByContentItem(resourceDetails, 'screenWithAutomaticFieldsInSection')).toBeDefined();
            expect(getUsedByContentItem(resourceDetails, 'screenWithAutomaticFields')).toBeDefined();
        });
    });
});

// Check time trigger element is not in the left panel
describe('Record Triggered Flow resource tab', () => {
    let editor;
    let leftPanel;
    beforeEach(async () => {
        editor = createEditorForTest();
        const store = Store.getStore();
        initializeAuraFetch();
        await loadFlow(recordTriggeredFlow, store);
        leftPanel = getLeftPanel(editor);
    });
    afterEach(() => {
        resetState();
    });
    it('should not have time trigger element', async () => {
        const startElement = getElementByDevName('$Record');
        const timeTriggersNode = getElementForPropertyEditor(startElement);
        const chevron = getChevronElement(leftPanel, timeTriggersNode.timeTriggers[0].guid);
        expect(chevron).toBeNull();
    });
});
