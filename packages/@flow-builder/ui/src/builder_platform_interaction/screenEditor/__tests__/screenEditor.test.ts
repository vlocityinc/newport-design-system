// @ts-nocheck
/**
 * Screen-editor tests for the following handlers:
 *      handleAddScreenField
 *      handleDeleteScreenElement
 *      handlePropertyChanged
 *      handleSelectScreenElement
 *      handleDeselectScreenElement
 *      handleReorder
 */
import ScreenEditor from '../screenEditor';
import { createElement } from 'lwc';
import { createTestScreen, createTestScreenField } from 'builder_platform_interaction/builderTestUtils';
import {
    PropertyChangedEvent,
    createScreenElementMovedEvent,
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    createScreenNodeSelectedEvent,
    createScreenElementDeselectedEvent,
    DynamicTypeMappingChangeEvent,
    createColumnWidthChangedEvent
} from 'builder_platform_interaction/events';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';
import { setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import { supportedFeaturesListForFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForFlow.json';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
jest.mock('builder_platform_interaction/contextLib', () => {
    const contextLib = jest.requireActual('builder_platform_interaction/contextLib');
    return Object.assign({}, contextLib, {
        orgHasFlowScreenSections: jest.fn().mockReturnValue(true)
    });
});
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    }
    function getStore() {
        return {
            getCurrentState
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

const CANVAS_ELEMENT_NAME = 'builder_platform_interaction-screen-editor-canvas';
const EDITOR_CONTAINER_ELEMENT_NAME = 'builder_platform_interaction-screen-properties-editor-container';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            const values = guid.split('--');
            if (values.length === 2) {
                const type = values[0];
                const name = values[1];
                return {
                    dataType: type,
                    elementType: 'VARIABLE',
                    guid,
                    isCanvasElement: false,
                    isCollection: false,
                    name
                };
            }
            // getElementByGuid returns undefined if no element can be found, this is by design
            return undefined;
        },
        getElementByDevName: jest.fn(),
        getDuplicateDevNameElements: jest.fn(),
        isDevNameInStore: jest.fn(),
        getProcessType: jest.fn(),
        getTriggerType: jest.fn(),
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokeModal: jest.fn(),
        hidePopover: jest.fn()
    };
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

const actual = jest.requireActual('../screenReducer');
let mockScreenReducer;

jest.mock('../screenReducer', () => {
    return {
        screenReducer: (state, event, node) => mockScreenReducer(state, event, node)
    };
});
describe('Event handling on editor', () => {
    let screenEditorElement;
    beforeEach(() => {
        mockScreenReducer = jest.fn((state, event, node) => {
            return actual.screenReducer(state, event, node);
        });

        setProcessTypeFeature('flow', supportedFeaturesListForFlow);
        const screen = createTestScreen('Screen1', null);
        screen.showHeader = true;
        screen.elementType = ELEMENT_TYPE.SCREEN;
        const sectionField = createTestScreenField('Section', 'Section');
        const columnField = createTestScreenField('Column', 'Column');
        columnField.inputParameters.push({ name: 'width', value: 12 });
        sectionField.fields.push(columnField);
        screen.fields.push(sectionField);
        screenEditorElement = createComponentUnderTest({ node: screen });

        expect(screen.fields).toHaveLength(9);
    });

    describe('add screen field', () => {
        it('event adds a field to the end by default', async () => {
            // handleAddScreenField (onaddscreenfield)
            await ticks(1);

            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency'));
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[length].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
        it('event can add a field to a specific position', async () => {
            await ticks(1);
            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency', 0));
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[0].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
        it('field calls the provided callback ', async () => {
            await ticks(1);

            const callback = jest.fn();

            const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            editor.dispatchEvent(
                createAddScreenFieldEvent('Column', 0, screenEditorElement.node.fields[0].guid, callback)
            );

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('delete screen field event', () => {
        it('invokes the delete confirmation modal with the right data', async () => {
            // handleDeleteScreenElement - Field (onscreenelementdeleted)
            await ticks(1);
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[1]));
            const callParams = invokeModal.mock.calls[0][0];
            expect(callParams.headerData.headerTitle).toBe(LABELS.deleteConfirmation);
            expect(callParams.bodyData.bodyTextOne).toBe(LABELS.deleteConsequence);
            expect(callParams.footerData.buttonOne.buttonLabel).toBe(LABELS.cancel);
            expect(callParams.footerData.buttonTwo.buttonLabel).toBe(LABELS.deleteAlternativeText);
            expect(callParams.footerData.buttonTwo.buttonVariant).toBe('destructive');
        });
        it('calls the provided callback post confirmation modal', async () => {
            // handleDeleteScreenElement - Field (onscreenelementdeleted)
            await ticks(1);
            const callback = jest.fn();
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(
                createScreenElementDeletedEvent(screenEditorElement.node.fields[1], null, null, callback)
            );
            invokeModal.mock.calls[0][0].footerData.buttonTwo.buttonCallback();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('property change changes screen property', async () => {
        // handlePropertyChanged(onpropertychanged)
        await ticks(1);
        const newPausedText = {
            value: 'screen-editor-test.js property change paused text',
            error: null
        };
        const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
        editor.dispatchEvent(
            new PropertyChangedEvent('pausedText', newPausedText, null, null, screenEditorElement.node.pausedText)
        );
        expect(screenEditorElement.node.pausedText.value).toBe(newPausedText.value);
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('select screen element sets the current node to the selected element', async () => {
        // handleSelectScreenElement (onscreenelementselected)
        await ticks(1);
        const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);
    });

    it('deselect screen element sets the screen as the selected node', async () => {
        // handleDeselectScreenElement - Canvas (onscreenelementdeselected)
        await ticks(1);
        const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);

        // Select field
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

        // Clear selection
        canvas.dispatchEvent(createScreenElementDeselectedEvent(field));
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('selecting the screen in the properties editor container breadcrumbs header screen as the selected node', async () => {
        // handleDeselectScreenElement - Property Editor Container (onscreennodeselected)
        await ticks(1);
        const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);

        // Select field
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

        // Select screen element in the editor container breadcrumbs
        const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
        editor.dispatchEvent(createScreenNodeSelectedEvent(field));
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('rearranges fields', async () => {
        // handleReorder (onreorderlist)
        await ticks(1);
        const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
        const field1 = screenEditorElement.node.fields[3];
        const field2 = screenEditorElement.node.fields[5];
        canvas.dispatchEvent(createScreenElementMovedEvent(field1.guid, screenEditorElement.node.guid, 6));
        expect(screenEditorElement.node.fields[4].guid).toBe(field2.guid);
        expect(screenEditorElement.node.fields[5].guid).toBe(field1.guid);
    });

    it('width of column changed', async () => {
        await ticks(1);
        const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
        editor.dispatchEvent(
            createColumnWidthChangedEvent(
                screenEditorElement.node.fields[8].fields[0].guid,
                7,
                screenEditorElement.node.fields[8].guid
            )
        );
        expect(screenEditorElement.node.fields[8].fields[0].inputParameters[0].value).toBe('7');
    });
});

describe('Extension events', () => {
    let screenEditorElement;
    let screen;
    const SCREEN_NAME = 'Screen1';
    const SCREEN_FIELD_NAME = 'Screenfield1';
    const origDisplayText = 'Display This Please';
    const newDisplayText = { value: 'New Display Text', error: null };
    const newFieldName = { value: 'my new screen field name', error: null };
    let screenField;
    beforeEach(() => {
        mockScreenReducer = jest.fn((state, event, node) => {
            return actual.screenReducer(state, event, node);
        });

        screen = createTestScreen(SCREEN_NAME, null);
        screen.showHeader = true;
        screen.elementType = ELEMENT_TYPE.SCREEN;
        screen.fields = [];
        screenField = createTestScreenField(SCREEN_FIELD_NAME, 'DisplayText', origDisplayText);
        screen.fields.push(screenField);
        screenEditorElement = createComponentUnderTest({ node: screen });

        // Make sure screen is created with the expected fields.
        expect(screen.fields).toHaveLength(1);
    });
    describe('Screen field property editor events', () => {
        it('Value of DisplayText field changed', async () => {
            await ticks(1);
            const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);

            // Select the field to be changed.
            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));

            // Change the field
            editor.dispatchEvent(
                new PropertyChangedEvent(
                    'fieldText',
                    newDisplayText,
                    null,
                    screenEditorElement.node.fields[0].guid,
                    field.fieldText
                )
            );
            expect(screenEditorElement.node.fields[0].fieldText.value).toBe(newDisplayText.value);
        });
        it('Name of DisplayText field changed', async () => {
            await ticks(1);
            const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);

            // Select the field to be changed.
            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));

            // Change the field
            editor.dispatchEvent(
                new PropertyChangedEvent(
                    'name',
                    newFieldName,
                    null,
                    screenEditorElement.node.fields[0].guid,
                    field.fieldText
                )
            );
            expect(screenEditorElement.node.fields[0].name.value).toBe(newFieldName.value);
        });

        describe('addscreenfield from property editor container', () => {
            const CONTAINER_INDEX = 100;
            let getFieldIndexMock;
            let newState;
            let parent;

            beforeEach(() => {
                getFieldIndexMock = jest.fn().mockReturnValueOnce(CONTAINER_INDEX);

                newState = {
                    getFieldIndex: getFieldIndexMock,
                    getFieldByGUID: jest.fn(guid => {
                        return guid === parent.guid ? parent : null;
                    }),
                    fields: []
                };
            });

            it('updates screen based on screenReducer call', async () => {
                mockScreenReducer = jest.fn(() => {
                    return newState;
                });

                await ticks(1);
                parent = {
                    guid: 123,
                    fields: [],
                    type: {
                        label: 'test label'
                    }
                };

                const originalNode = screenEditorElement.node;

                const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
                const event = createAddScreenFieldEvent('pausedText', 0, parent.guid);

                editor.dispatchEvent(event);

                const reducerParams = mockScreenReducer.mock.calls[0];
                expect(reducerParams[0]).toEqual(originalNode);
                expect(reducerParams[1]).toMatchObject(event);

                expect(screenEditorElement.node).toEqual(newState);
            });
            it('sets the parent as selected', async () => {
                mockScreenReducer = jest.fn(() => {
                    return newState;
                });

                await ticks(1);
                parent = {
                    guid: 123,
                    fields: [],
                    type: {
                        label: 'test label'
                    }
                };

                const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
                const event = createAddScreenFieldEvent('pausedText', 0, parent.guid);

                editor.dispatchEvent(event);
                expect(screenEditorElement.getSelectedItemGuid()).toEqual(parent.guid);
            });
        });
    });

    describe('Use advanced options checkbox events', () => {
        afterAll(() => {
            mockScreenReducer = jest.fn((state, event, node) => {
                return actual.screenReducer(state, event, node);
            });
        });
        it('calls the reducer on advanced options checkbox event', () => {
            const expectedEvent = new UseAdvancedOptionsSelectionChangedEvent(true);

            return Promise.resolve().then(async () => {
                const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
                mockScreenReducer = jest.fn(state => {
                    return state;
                });
                const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
                canvas.dispatchEvent(createScreenElementSelectedEvent(screenField));

                editor.dispatchEvent(expectedEvent);

                await Promise.resolve();
                expect(mockScreenReducer).toHaveBeenCalled();
                expect(mockScreenReducer.mock.calls[0][0]).toMatchObject({
                    name: { value: SCREEN_NAME }
                });
                expect(mockScreenReducer.mock.calls[0][1].detail).toMatchObject({
                    useAdvancedOptions: true
                });
                expect(mockScreenReducer.mock.calls[0][2]).toMatchObject({
                    name: { value: SCREEN_FIELD_NAME }
                });
            });
        });
        const SCREEN_FIELD_NAME_UPDATED_BY_REDUCER = 'ScreenField1Updated';
        const mockedReducerThatUpdatesScreenFieldName = state => {
            state.fields[0].guid = SCREEN_FIELD_NAME_UPDATED_BY_REDUCER;
            return state;
        };
        // const checkNodeReset = () =>
        it('reset the selected node on advanced options checkbox event', () => {
            const expectedEvent = new UseAdvancedOptionsSelectionChangedEvent(true);

            return Promise.resolve().then(async () => {
                const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
                mockScreenReducer = jest.fn((state, event, node) =>
                    mockedReducerThatUpdatesScreenFieldName(state, event, node)
                );
                const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
                canvas.dispatchEvent(createScreenElementSelectedEvent(screenField));

                editor.dispatchEvent(expectedEvent);

                await Promise.resolve();

                expect(screenEditorElement.getSelectedItemGuid()).toEqual(SCREEN_FIELD_NAME_UPDATED_BY_REDUCER);
            });
        });
    });

    it('handles dynamictypemappingchange event', async () => {
        const editor = screenEditorElement.shadowRoot.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);

        mockScreenReducer = jest.fn(state => state);

        // Select the field to be changed.
        const canvas = screenEditorElement.shadowRoot.querySelector(CANVAS_ELEMENT_NAME);
        const field = screenEditorElement.node.fields[0];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));

        // Change the field
        editor.dispatchEvent(
            new DynamicTypeMappingChangeEvent({
                typeName: 'T',
                typeValue: 'Asset',
                error: null,
                rowIndex: 'abc'
            })
        );

        await Promise.resolve();

        expect(mockScreenReducer).toHaveBeenCalled();
        expect(mockScreenReducer.mock.calls[0][0]).toMatchObject({
            name: { value: SCREEN_NAME }
        });
        expect(mockScreenReducer.mock.calls[0][1].detail).toMatchObject({
            typeName: 'T',
            typeValue: 'Asset',
            error: null,
            rowIndex: 'abc'
        });
        expect(mockScreenReducer.mock.calls[0][2]).toMatchObject({
            name: { value: SCREEN_FIELD_NAME }
        });
    });
});
