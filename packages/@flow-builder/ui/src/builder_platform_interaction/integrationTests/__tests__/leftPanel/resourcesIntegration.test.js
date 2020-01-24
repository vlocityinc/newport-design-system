import { createElement } from 'lwc';
import Editor from 'builder_platform_interaction/editor';
import { resetState } from '../integrationTestUtils';
import {
    getChevronElement,
    clickOnChevron,
    clickDeleteButtonInResourceDetailsPanel
} from '../leftPanelTestUtils';
import { deepQuerySelector } from 'builder_platform_interaction/builderTestUtils';
import { stringConstant, flowWithAllElementsUIModel } from 'mock/storeData';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { updateFlow } from 'builder_platform_interaction/actions';
import { resolveRenderCycles } from '../resolveRenderCycles';
import { Store } from 'builder_platform_interaction/storeLib';
import { initializeAuraFetch } from '../serverDataTestUtils';
import { loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';
import { resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';

jest.mock('builder_platform_interaction/drawingLib', () =>
    require('builder_platform_interaction_mocks/drawingLib')
);

jest.mock('builder_platform_interaction/keyboardInteractionUtils', () =>
    require('builder_platform_interaction_mocks/keyboardInteractionUtils')
);

const createEditorForTest = () => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    document.body.appendChild(el);
    return el;
};

const getResourceDetail = leftPanel => {
    return deepQuerySelector(leftPanel, [
        'builder_platform_interaction-resource-details'
    ]);
};

const getLeftPanel = editorCmp => {
    return editorCmp.shadowRoot.querySelector(
        'builder_platform_interaction-left-panel'
    );
};
let editor;
beforeAll(async () => {
    editor = createEditorForTest();
});

describe('Left Panel', () => {
    let store;
    beforeAll(async () => {
        store = Store.getStore();
        initializeAuraFetch();
        await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW);
    });
    afterAll(() => {
        resetState();
    });
    describe('Resource tab', () => {
        let leftPanel;
        beforeAll(async () => {
            store.dispatch(updateFlow(flowWithAllElementsUIModel));
            leftPanel = getLeftPanel(editor);
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
            resetFetchOnceCache();
        });
        it('Delete a resource', () => {
            let chevron = getChevronElement(leftPanel, stringConstant.guid);
            expect(chevron).toHaveLength(1);
            clickOnChevron(chevron[0]);
            return resolveRenderCycles(() => {
                const resourceDetails = getResourceDetail(leftPanel);
                clickDeleteButtonInResourceDetailsPanel(resourceDetails);
                return resolveRenderCycles(() => {
                    chevron = getChevronElement(leftPanel, stringConstant.guid);
                    expect(chevron).toHaveLength(0);
                });
            });
        });
    });
});
