import { createElement } from 'lwc';
import StageEditor from "../stageEditor";
import { createStage } from "builder_platform_interaction/elementFactory";
import { hydrateWithErrors } from "builder_platform_interaction/dataMutationLib";
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { stageReducer } from "../../stageEditor/stageReducer";
import { PropertyChangedEvent } from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual('../../actions/actions.js').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../stageReducer', () => {
    return {
        stageReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))),
    };
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-stage-editor', { is: StageEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    STAGE_ORDER_INPUT: '.test-order',
    STAGE_ACTIVE_BY_DEFAULT_CHECKBOX: '.test-active-by-default'
};

const getLabelDescription = (stageEditor) => {
    return stageEditor.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION);
};

const getStageOrder = (stageEditor) => {
    return stageEditor.shadowRoot.querySelector(selectors.STAGE_ORDER_INPUT);
};

const getStageActiveByDefaultCheckBox = (stageEditor) => {
    return stageEditor.shadowRoot.querySelector(selectors.STAGE_ACTIVE_BY_DEFAULT_CHECKBOX);
};

describe('Stage-Editor', () => {
    let stageResource;
    describe('Creating a New Stage', () => {
        let stageEditor;
        beforeEach(() => {
            stageResource = createStage();
            stageResource = hydrateWithErrors(stageResource);
            stageEditor = createComponentUnderTest(stageResource);
        });
        it('Label Description Component', () => {
            const labelDescription = getLabelDescription(stageEditor);
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label.value).toBe('');
            expect(labelDescription.label.error).toBeNull();
            expect(labelDescription.devName.value).toBe('');
            expect(labelDescription.devName.error).toBeNull();
            expect(labelDescription.description.value).toBe('');
            expect(labelDescription.description.error).toBeNull();
        });
        it('Stage Order Input should be Empty (NULL)', () => {
            const stageOrderInputField = getStageOrder(stageEditor);
            expect(stageOrderInputField).toBeDefined();
            expect(stageOrderInputField.value).toBeNull();
        });
        it('Active By Default Checkbox should be unchecked by default.', () => {
            const stageActiveByDefaultCheckBox = getStageActiveByDefaultCheckBox(stageEditor);
            expect(stageActiveByDefaultCheckBox).toBeDefined();
            expect(stageActiveByDefaultCheckBox.checked).toBe(false);
        });
    });
    describe('Edit an Existing Stage', () => {
        let stageEditor;
        beforeEach(() => {
            stageResource = {
                "name": {
                    "value": "myStage",
                    "error": null
                },
                "label": {
                    "value": "myStage",
                    "error": null
                },
                "description": {
                    "value": "myStage",
                    "error": null
                },
                "processMetadataValues": [],
                "stageOrder": {
                    "value": "2",
                    "error": null
                },
                "elementType": "STAGE",
                "guid": "STAGE_11",
                "isCanvasElement": false,
                "isActive": true
            };
            stageEditor = createComponentUnderTest(stageResource);
        });
        it('Label Description Component', () => {
            const labelDescription = getLabelDescription(stageEditor);
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label.value).toBe(stageResource.label.value);
            expect(labelDescription.label.error).toBeNull();
            expect(labelDescription.devName.value).toBe(stageResource.name.value);
            expect(labelDescription.devName.error).toBeNull();
            expect(labelDescription.description.value).toBe(stageResource.description.value);
            expect(labelDescription.description.error).toBeNull();
        });
        it('Stage Order Input should be Empty (NULL)', () => {
            const stageOrderInputField = getStageOrder(stageEditor);
            expect(stageOrderInputField).toBeDefined();
            expect(stageOrderInputField.value).toBe(stageResource.stageOrder.value);
        });
        it('Active By Default Checkbox should be unchecked by default.', () => {
            const stageActiveByDefaultCheckBox = getStageActiveByDefaultCheckBox(stageEditor);
            expect(stageActiveByDefaultCheckBox).toBeDefined();
            expect(stageActiveByDefaultCheckBox.checked).toBe(true);
        });
    });
    describe('Handle Property Changed Events', () => {
        it('handles the property changed event and updates to Description.', () => {
            const stageEditor = createComponentUnderTest(stageResource);
            return Promise.resolve().then(() => {
                const event = new PropertyChangedEvent('description', 'new desc', null);
                getLabelDescription(stageEditor).dispatchEvent(event);
                expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
                expect(stageReducer.mock.calls[0][0]).toEqual(stageEditor.node);
            });
        });
    });
});