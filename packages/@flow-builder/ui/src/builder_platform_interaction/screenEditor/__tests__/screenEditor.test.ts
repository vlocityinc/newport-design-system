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
import {
    createTestScreen,
    createTestScreenField,
    INTERACTION_COMPONENTS_SELECTORS,
    SCREEN_NO_DEF_VALUE,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { createAutomaticField } from 'builder_platform_interaction/elementFactory';
import {
    createAddAutomaticScreenFieldEvent,
    createAddScreenFieldEvent,
    createColumnWidthChangedEvent,
    createScreenElementDeletedEvent,
    createScreenElementDeselectedEvent,
    createScreenElementMovedEvent,
    createScreenElementSelectedEvent,
    createScreenNodeSelectedEvent,
    createSingleOrMultiChoiceTypeChangedEvent,
    DynamicTypeMappingChangeEvent,
    ManuallyAssignVariablesChangedEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ChoiceDisplayOptions, ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';
import { setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import * as usebyMock from 'builder_platform_interaction/usedByLib';
import { createElement } from 'lwc';
import { accountSObjectVariable, flowWithAllElementsUIModel as mockFlowWithAllElementsUIModel } from 'mock/storeData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { supportedFeaturesListForFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForFlow.json';
import ScreenEditor from '../screenEditor';

jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: mockFlowWithAllElementsUIModel.elements
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

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/sharedUtils');
    return Object.assign({}, actual, {
        invokeModal: jest.fn()
    });
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedByStoreAndElementState: jest.fn(),
        invokeUsedByAlertModal: jest.fn()
    };
});

const getScreenEditorCanvas = (screen) =>
    screen.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_EDITOR_CANVAS);

const getScreenPropertyEditorContainer = (screen) =>
    screen.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER);

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const mockedSobjectLib = require('builder_platform_interaction_mocks/sobjectLib');
    mockedSobjectLib.getFieldsForEntity = jest.fn().mockImplementation(() => mockAccountFields);
    mockedSobjectLib.fetchFieldsForEntity = jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields));
    return mockedSobjectLib;
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    const storeUtils = jest.requireActual('builder_platform_interaction/storeUtils');
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
            return storeUtils.getElementByGuid(guid);
        },
        getElementByDevName: jest.fn(),
        getDuplicateDevNameElements: jest.fn(),
        isDevNameInStore: jest.fn(),
        getProcessType: jest.fn(),
        getTriggerType: jest.fn(),
        getStartElementFromState: jest.fn(),
        getElementByGuidFromState: storeUtils.getElementByGuidFromState,
        getElementByDevNameFromState: storeUtils.getElementByDevNameFromState
    };
});

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

jest.mock('builder_platform_interaction/builderUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/builderUtils');
    return Object.assign({}, actual, {
        hidePopover: jest.fn()
    });
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

const actual = jest.requireActual('../screenReducer');
let mockScreenReducer;

jest.mock('../screenReducer', () => {
    return {
        screenReducer: (state, event, node) => mockScreenReducer(state, event, node)
    };
});

const NB_SCREEN_FIELDS = 10;

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
        const automaticScreenField = createAutomaticField(
            ScreenFieldName.TextBox,
            `${accountSObjectVariable.name}.Name`
        );
        columnField.inputParameters.push({ name: 'width', value: 12 });
        sectionField.fields.push(columnField);
        screen.fields.push(sectionField);
        screen.fields.push(automaticScreenField);
        screenEditorElement = createComponentUnderTest({ node: screen });

        expect(screen.fields).toHaveLength(NB_SCREEN_FIELDS);
    });

    describe('add screen field', () => {
        test('event adds a field to the end by default', async () => {
            // handleAddScreenField (onaddscreenfield)
            const length = screenEditorElement.node.fields.length;
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency'));
            await ticks(1);
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[length].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
        test('event can add a field to a specific position', async () => {
            const length = screenEditorElement.node.fields.length;
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency', 0));
            await ticks(1);
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[0].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
    });
    describe('add automatic screen field', () => {
        test('event adds a field to the end by default', async () => {
            const objectFieldReference = accountSObjectVariable.guid + '.Name';
            const length = screenEditorElement.node.fields.length;
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createAddAutomaticScreenFieldEvent(ScreenFieldName.TextBox, objectFieldReference));
            await ticks(1);
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[length].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
        test('event can add a field to a specific position', async () => {
            const objectFieldReference = accountSObjectVariable.guid + '.Name';
            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCREEN_EDITOR_CANVAS
            );
            canvas.dispatchEvent(createAddAutomaticScreenFieldEvent(ScreenFieldName.TextBox, objectFieldReference, 0));
            await ticks(1);
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[0].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
    });

    describe('delete screen field event', () => {
        const getFieldWithObjectFieldReference = (objectFieldReference: string): UI.ScreenField => {
            return screenEditorElement.node.fields.find((field) => field.objectFieldReference === objectFieldReference);
        };
        const expectInvokeModalCalledForDeleteConfirmation = (
            expectedDeleteConfirmationLabel: string,
            expectedDeleteConsequenceLabel: string
        ) => {
            const callParams = invokeModal.mock.calls[0][0];
            expect(callParams.headerData.headerTitle).toBe(expectedDeleteConfirmationLabel);
            expect(callParams.bodyData.bodyTextOne).toBe(expectedDeleteConsequenceLabel);
            expect(callParams.footerData.buttonOne.buttonLabel).toBe(LABELS.cancel);
            expect(callParams.footerData.buttonTwo.buttonLabel).toBe(LABELS.deleteAlternativeText);
            expect(callParams.footerData.buttonTwo.buttonVariant).toBe('destructive');
        };
        it('invokes the delete confirmation modal with the right data', async () => {
            // handleDeleteScreenElement - Field (onscreenelementdeleted)
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[1]));
            await ticks(1);
            expectInvokeModalCalledForDeleteConfirmation(LABELS.deleteConfirmation, LABELS.deleteConsequence);
        });
        it('invokes the delete confirmation modal when the target is a section', async () => {
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[8]));
            await ticks(1);
            expectInvokeModalCalledForDeleteConfirmation(LABELS.deleteConfirmation, LABELS.deleteSectionConsequence);
        });
        it('invokes the delete confirmation modal when the target is a column of a section', async () => {
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[8].fields[0]));
            await ticks(1);
            expectInvokeModalCalledForDeleteConfirmation(
                LABELS.deleteColumnConfirmation,
                LABELS.deleteColumnConsequence
            );
        });
        it('calls the provided callback post confirmation modal', async () => {
            // handleDeleteScreenElement - Field (onscreenelementdeleted)
            const callback = jest.fn();
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(
                createScreenElementDeletedEvent(screenEditorElement.node.fields[1], null, null, callback)
            );
            await ticks(1);
            invokeModal.mock.calls[0][0].footerData.buttonTwo.buttonCallback();
            expect(callback).toHaveBeenCalled();
        });
        it('invokes the delete confirmation with accurate labels on automatic field', () => {
            const canvas = getScreenEditorCanvas(screenEditorElement);
            canvas.dispatchEvent(
                createScreenElementDeletedEvent(getFieldWithObjectFieldReference(`${accountSObjectVariable.name}.Name`))
            );
            expectInvokeModalCalledForDeleteConfirmation(
                LABELS.automaticFieldDeleteConfirmation,
                LABELS.automaticFieldDeleteConsequence
            );
        });
    });

    it('property change changes screen property', async () => {
        // handlePropertyChanged(onpropertychanged)
        const newPausedText = {
            value: 'screen-editor-test.js property change paused text',
            error: null
        };
        const editor = getScreenPropertyEditorContainer(screenEditorElement);
        editor.dispatchEvent(
            new PropertyChangedEvent('pausedText', newPausedText, null, null, screenEditorElement.node.pausedText)
        );
        await ticks(1);
        expect(screenEditorElement.node.pausedText.value).toBe(newPausedText.value);
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('select screen element sets the current node to the selected element', async () => {
        // handleSelectScreenElement (onscreenelementselected)
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        await ticks(1);
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);
    });

    it('select screen element with enter focuses screen editor container back button', async () => {
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const field = screenEditorElement.node.fields[3];
        const screenPropertiesEditor = getScreenPropertyEditorContainer(screenEditorElement);
        screenPropertiesEditor.focus = jest.fn();
        canvas.dispatchEvent(createScreenElementSelectedEvent(field, null, true));
        await ticks(1);
        expect(screenPropertiesEditor.focus).toHaveBeenCalled();
    });
    it('on shift+F6 it returns focus to the screen element from the properties editor', async () => {
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const field = screenEditorElement.node.fields[3];
        const screenPropertiesEditor = getScreenPropertyEditorContainer(screenEditorElement);
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        await ticks(1);
        canvas.focusHighlight = jest.fn();
        screenPropertiesEditor.dispatchEvent(new CustomEvent('focusscreenelement'));
        await ticks(1);
        expect(canvas.focusHighlight).toHaveBeenCalled();
    });

    it('deselect screen element sets the screen as the selected node', async () => {
        // handleDeselectScreenElement - Canvas (onscreenelementdeselected)
        const canvas = getScreenEditorCanvas(screenEditorElement);

        // Select field
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        await ticks(1);
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

        // Clear selection
        canvas.dispatchEvent(createScreenElementDeselectedEvent(field));
        await ticks(1);
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('selecting the screen in the properties editor container breadcrumbs header screen as the selected node', async () => {
        // handleDeselectScreenElement - Property Editor Container (onscreennodeselected)
        const canvas = getScreenEditorCanvas(screenEditorElement);

        // Select field
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field));
        await ticks(1);
        expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

        // Select screen element in the editor container breadcrumbs
        const editor = getScreenPropertyEditorContainer(screenEditorElement);
        editor.dispatchEvent(createScreenNodeSelectedEvent(field));
        await ticks(1);
        expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
    });

    it('Selecting screen element with keyboard runs correct focus function in screenPropertiesEditorContainer', async () => {
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const editor = getScreenPropertyEditorContainer(screenEditorElement);
        editor.focus = jest.fn();
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(field, null, true));
        await ticks(1);
        expect(editor.focus).toHaveBeenCalled();
    });

    it('Selecting screen element with keyboard runs correct focus function when selecting footer and no component is selected', async () => {
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const editor = getScreenPropertyEditorContainer(screenEditorElement);
        editor.focusExpandButton = jest.fn();
        const field = screenEditorElement.node.fields[3];
        canvas.dispatchEvent(createScreenElementSelectedEvent(screenEditorElement.node, null, true));
        await ticks(1);
        expect(editor.focusExpandButton).toHaveBeenCalled();
    });

    it('rearranges fields', async () => {
        // handleReorder (onreorderlist)
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const field1 = screenEditorElement.node.fields[3];
        const field2 = screenEditorElement.node.fields[5];
        canvas.dispatchEvent(createScreenElementMovedEvent(field1.guid, screenEditorElement.node.guid, 6));
        await ticks(1);
        expect(screenEditorElement.node.fields[4].guid).toBe(field2.guid);
        expect(screenEditorElement.node.fields[5].guid).toBe(field1.guid);
    });

    it('drag a field into selected section', async () => {
        const canvas = getScreenEditorCanvas(screenEditorElement);
        const field1 = screenEditorElement.node.fields[7];
        let section = screenEditorElement.node.fields[8];
        // Select section
        canvas.dispatchEvent(createScreenElementSelectedEvent(section));
        await ticks(1);
        // drag field1 into section
        canvas.dispatchEvent(createScreenElementMovedEvent(field1.guid, section.fields[0].guid, 0));
        await ticks(1);
        section = screenEditorElement.getSelectedNode();
        expect(section.fields[0].fields[0].guid).toBe(field1.guid);
    });

    it('width of column changed', async () => {
        const editor = getScreenPropertyEditorContainer(screenEditorElement);
        editor.dispatchEvent(
            createColumnWidthChangedEvent(
                screenEditorElement.node.fields[8].fields[0].guid,
                7,
                screenEditorElement.node.fields[8].guid
            )
        );
        await ticks(1);
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
            const editor = getScreenPropertyEditorContainer(screenEditorElement);
            const canvas = getScreenEditorCanvas(screenEditorElement);

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
            const editor = getScreenPropertyEditorContainer(screenEditorElement);
            const canvas = getScreenEditorCanvas(screenEditorElement);

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
                    getFieldByGUID: jest.fn((guid) => {
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

                const editor = getScreenPropertyEditorContainer(screenEditorElement);
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

                const editor = getScreenPropertyEditorContainer(screenEditorElement);
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
            const expectedEvent = new ManuallyAssignVariablesChangedEvent(true);

            return Promise.resolve().then(async () => {
                const editor = getScreenPropertyEditorContainer(screenEditorElement);
                mockScreenReducer = jest.fn((state) => {
                    return state;
                });
                const canvas = getScreenEditorCanvas(screenEditorElement);
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
        const mockedReducerThatUpdatesScreenFieldName = (state) => {
            state.fields[0].guid = SCREEN_FIELD_NAME_UPDATED_BY_REDUCER;
            return state;
        };
        // const checkNodeReset = () =>
        it('reset the selected node on advanced options checkbox event', () => {
            const expectedEvent = new ManuallyAssignVariablesChangedEvent(true);

            return Promise.resolve().then(async () => {
                const editor = getScreenPropertyEditorContainer(screenEditorElement);
                mockScreenReducer = jest.fn((state, event, node) =>
                    mockedReducerThatUpdatesScreenFieldName(state, event, node)
                );
                const canvas = getScreenEditorCanvas(screenEditorElement);
                canvas.dispatchEvent(createScreenElementSelectedEvent(screenField));

                editor.dispatchEvent(expectedEvent);

                await Promise.resolve();

                expect(screenEditorElement.getSelectedItemGuid()).toEqual(SCREEN_FIELD_NAME_UPDATED_BY_REDUCER);
            });
        });
    });

    it('handles dynamictypemappingchange event', async () => {
        const editor = getScreenPropertyEditorContainer(screenEditorElement);

        mockScreenReducer = jest.fn((state) => state);

        // Select the field to be changed.
        const canvas = getScreenEditorCanvas(screenEditorElement);
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
    describe('Switching type of choice of Screen Choice field with dataType IS NOT String', () => {
        let screenEditorElement;
        let screen;
        beforeEach(() => {
            mockScreenReducer = jest.fn((state, event, node) => {
                return actual.screenReducer(state, event, node);
            });

            screen = createTestScreen(SCREEN_NAME, ['Checkbox']);
            screen.showHeader = true;
            screen.elementType = ELEMENT_TYPE.SCREEN;
            screen.fields = [];
            screenField = createTestScreenField(SCREEN_FIELD_NAME, ScreenFieldName.Checkbox, SCREEN_NO_DEF_VALUE, {
                dataType: 'Number',
                validation: false,
                helpText: false
            });
            screenField.singleOrMultiSelect = ChoiceDisplayOptions.SINGLE_SELECT;
            screenField.fieldType = FlowScreenFieldType.DropdownBox;
            screen.fields.push(screenField);
            screenEditorElement = createComponentUnderTest({ node: screen });

            // Make sure screen is created with the expected fields.
            expect(screen.fields).toHaveLength(1);
        });
        it('Should invoke a modal when switching to MultiSelect', async () => {
            // The field is used somewhere
            usebyMock.usedByStoreAndElementState.mockReturnValueOnce(['someGuid']);
            // Select the field to be changed.
            const canvas = getScreenEditorCanvas(screenEditorElement);
            const editorContainer = getScreenPropertyEditorContainer(screenEditorElement);

            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            await ticks(1);

            // Dispatch Single Or Multi Choice Type changed
            editorContainer.dispatchEvent(
                createSingleOrMultiChoiceTypeChangedEvent(field, ChoiceDisplayOptions.MULTI_SELECT)
            );
            await ticks(1);
            expect(usebyMock.invokeUsedByAlertModal).toBeCalledWith(['someGuid'], [field.guid], 'Choice');
        });
    });
    describe('Switching type of choice os Screen Choice field with dataType IS String', () => {
        let screenEditorElement;
        let screen;
        beforeEach(() => {
            mockScreenReducer = jest.fn((state, event, node) => {
                return actual.screenReducer(state, event, node);
            });

            screen = createTestScreen(SCREEN_NAME, ['Checkbox']);
            screen.showHeader = true;
            screen.elementType = ELEMENT_TYPE.SCREEN;
            screen.fields = [];
            screenField = createTestScreenField(SCREEN_FIELD_NAME, ScreenFieldName.Checkbox, SCREEN_NO_DEF_VALUE, {
                dataType: 'String',
                validation: false,
                helpText: false
            });
            screenField.singleOrMultiSelect = ChoiceDisplayOptions.SINGLE_SELECT;
            screenField.fieldType = FlowScreenFieldType.DropdownBox;
            screen.fields.push(screenField);
            screenEditorElement = createComponentUnderTest({ node: screen });

            // Make sure screen is created with the expected fields.
            expect(screen.fields).toHaveLength(1);
            // The field is used somewhere
            usebyMock.usedByStoreAndElementState.mockReturnValueOnce(['someGuid']);
        });
        it('Should NOT invoke a modal when switching to MultiSelect', async () => {
            // Select the field to be changed.
            const canvas = getScreenEditorCanvas(screenEditorElement);
            const editorContainer = getScreenPropertyEditorContainer(screenEditorElement);

            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            await ticks(1);

            // Dispatch Single Or Multi Choice Type changed
            editorContainer.dispatchEvent(
                createSingleOrMultiChoiceTypeChangedEvent(field, ChoiceDisplayOptions.MULTI_SELECT)
            );
            await ticks(1);
            expect(usebyMock.invokeUsedByAlertModal).not.toBeCalled();
        });
        it('Should set display type to MultiSelectCheckboxes by default when swithing from singleSelect to multiSelect', async () => {
            // Select the field to be changed.
            const canvas = getScreenEditorCanvas(screenEditorElement);
            const editorContainer = getScreenPropertyEditorContainer(screenEditorElement);

            let field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            await ticks(1);

            // Dispatch Single Or Multi Choice Type changed
            editorContainer.dispatchEvent(
                createSingleOrMultiChoiceTypeChangedEvent(field, ChoiceDisplayOptions.MULTI_SELECT)
            );
            await ticks(1);
            field = screenEditorElement.node.fields[0];
            expect(field.fieldType).toBe(ScreenFieldName.MultiSelectCheckboxes);
        });
        it('Should set display type to DropdownBox by default when swithing from multiSelect to singleSelect', async () => {
            // Select the field to be changed.
            const canvas = getScreenEditorCanvas(screenEditorElement);
            const editorContainer = getScreenPropertyEditorContainer(screenEditorElement);

            let field = screenEditorElement.node.fields[0];
            screenField.singleOrMultiSelect = ChoiceDisplayOptions.MULTI_SELECT;
            screenField.fieldType = FlowScreenFieldType.MultiSelectCheckboxes;
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            await ticks(1);

            // Dispatch Single Or Multi Choice Type changed
            editorContainer.dispatchEvent(
                createSingleOrMultiChoiceTypeChangedEvent(field, ChoiceDisplayOptions.SINGLE_SELECT)
            );
            await ticks(1);
            field = screenEditorElement.node.fields[0];
            expect(field.fieldType).toBe(ScreenFieldName.DropdownBox);
        });
    });
});
