// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { hydrateWithErrors, isItemHydratedWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    FlowTestClearRecordFormEvent,
    ListItemInteractionEvent,
    PropertyChangedEvent,
    UpdateTestAssertionEvent,
    UpdateTestRecordDataEvent
} from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { DUPLICATE_FLOW_API_NAME_ERROR_CODE, FlowTestMenuItems } from '../flowTestEditor';
import { LABELS } from '../flowTestEditorLabels';
const { format } = commonUtils;

jest.mock('builder_platform_interaction/translatorLib', () => {
    return Object.assign({}, jest.requireActual('builder_platform_interaction/translatorLib'), {
        translateUIModelToFlowTest: jest.fn().mockImplementation(() => {
            return {};
        })
    });
});

let mockServerResponse;
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return Object.assign({}, jest.requireActual('builder_platform_interaction/serverDataLib'), {
        fetchPromise: jest.fn().mockImplementation(() => {
            return Promise.resolve(mockServerResponse);
        })
    });
});

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS
};

const DEFAULT_PROPS = {
    flowTestObject: {
        label: { value: '', error: null },
        name: { value: '', error: null },
        description: { value: '', error: null },
        runPathValue: { value: '', error: null },
        testTriggerType: { value: '', error: null },
        testInitialRecordData: { value: {}, error: null },
        testUpdatedRecordData: { value: {}, error: null },
        testAssertions: [
            {
                expression: hydrateWithErrors(createListRowItem())
            }
        ]
    },
    triggerSaveType: { value: '', error: null },
    objectApiName: 'Account',
    footer: {
        disableFlowTestButtonOne: jest.fn()
    }
};

const createComponentUnderTest = async (overrideProps) => {
    return createComponent(SELECTORS.FLOW_TEST_EDITOR, DEFAULT_PROPS, overrideProps);
};

const getNavigator = (parent) => {
    return parent.shadowRoot.querySelector(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION);
};

const navigateToTab = async (parent, menuItem: FlowTestMenuItems) => {
    const vertNavigator = getNavigator(parent);
    vertNavigator.dispatchEvent(new ListItemInteractionEvent(menuItem, ListItemInteractionEvent.Type.Click));
};

describe('FlowTestEditor', () => {
    it('changes the displayed tab when menu item is clicked', async () => {
        const flowTestEditorComponent = await createComponentUnderTest();
        navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
        await ticks(1);
        const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
            SELECTORS.FLOW_TEST_ASSERTION_EDITOR
        );
        expect(flowTestAssertionEditor).toBeTruthy();
    });
    it('creates error icon when there are errors', async () => {
        const overriddenProps = { ...DEFAULT_PROPS };
        overriddenProps.flowTestObject.label = { value: '', error: 'error message' };
        const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
        const vertNav = getNavigator(flowTestEditorComponent);
        const menuItems = vertNav.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
        expect(menuItems[0].firstChild).toBeTruthy();
        expect(menuItems[1].firstChild).toBeNull();
        expect(menuItems[2].firstChild).toBeNull();
    });
    it('fires toast event when save results in error', async () => {
        mockServerResponse = {
            isSuccess: false,
            errors: [{ fields: [], messages: 'Test', statusCode: 'CODE' }]
        };
        const flowTestEditorComponent = await createComponentUnderTest();
        const handleToast = jest.fn();
        flowTestEditorComponent.addEventListener(ShowToastEventName, handleToast);
        flowTestEditorComponent.save();
        await ticks(1);
        expect(handleToast).toBeCalled();
    });
    it('show field error when there is a duplicate test api name', async () => {
        mockServerResponse = {
            isSuccess: false,
            errors: [{ fields: [], messages: 'duplicate', statusCode: DUPLICATE_FLOW_API_NAME_ERROR_CODE }]
        };
        const flowTestEditorComponent = await createComponentUnderTest();
        flowTestEditorComponent.save();
        await ticks(1);
        const expectedErrorMessage = format(LABELS.errorMessageDuplicateFlowTest, DEFAULT_PROPS.flowTestObject.name);
        expect(flowTestEditorComponent.flowTestObject.name.error).toEqual(expectedErrorMessage);
    });
    describe('FlowTestDetails', () => {
        it('creates a new menu item when Trigger type is changed to Updated', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            const vertNavigator = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            let menuItems = vertNavigator.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
            expect(menuItems.length).toEqual(3);
            const flowTestDetailsComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_DETAILS
            );
            flowTestDetailsComponent.dispatchEvent(
                new PropertyChangedEvent('testTriggerType', FLOW_TRIGGER_SAVE_TYPE.UPDATE, null)
            );
            await ticks(1);
            menuItems = vertNavigator.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
            expect(menuItems.length).toEqual(4);
        });
        it('updates property when PropertyChangedEvent is received', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            const flowTestDetailsComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_DETAILS
            );
            const expectedProperty = 'label';
            const expectedValue = 'Test';
            flowTestDetailsComponent.dispatchEvent(new PropertyChangedEvent(expectedProperty, expectedValue, null));
            await ticks(1);
            expect(flowTestEditorComponent.flowTestObject[expectedProperty].value).toEqual(expectedValue);
        });
    });
    describe('FlowTestAssertionEditor', () => {
        it('adds assertion row when AddListItemEvent is received', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
            await ticks(1);
            const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_ASSERTION_EDITOR
            );
            flowTestAssertionEditor.dispatchEvent(new AddListItemEvent());
            await ticks(1);
            expect(flowTestEditorComponent.flowTestObject.testAssertions.length).toEqual(2);
            expect(
                isItemHydratedWithErrors(
                    flowTestEditorComponent.flowTestObject.testAssertions[0].expression.leftHandSide
                )
            ).toEqual(true);
        });
        it('deletes assertion row when DeleteListItemEvent is received', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testAssertions = [
                { expression: createListRowItem() },
                { expression: createListRowItem() }
            ];
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
            await ticks(1);
            const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_ASSERTION_EDITOR
            );
            flowTestAssertionEditor.dispatchEvent(new DeleteListItemEvent(0));
            await ticks(1);
            expect(flowTestEditorComponent.flowTestObject.testAssertions.length).toEqual(1);
        });
        it('only updates message when UpdateTestAssertionEvent is received', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            const expectedExpression = flowTestEditorComponent.flowTestObject.testAssertions[0].expression;
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
            await ticks(1);
            const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_ASSERTION_EDITOR
            );
            const expectedMessage = 'hello';
            flowTestAssertionEditor.dispatchEvent(
                new UpdateTestAssertionEvent(0, false, true, undefined, expectedMessage)
            );
            await ticks(1);
            const actualMessage = flowTestEditorComponent.flowTestObject.testAssertions[0].message.value;
            expect(actualMessage).toEqual(expectedMessage);
            expect(flowTestEditorComponent.flowTestObject.testAssertions[0].expression).toEqual(expectedExpression);
        });
        it('only hides custom message input when UpdateTestAssertionEvent is received and message is undefined', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testAssertions = [
                {
                    expression: createListRowItem(),
                    message: { value: '', error: null }
                }
            ];
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
            await ticks(1);
            const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_ASSERTION_EDITOR
            );
            flowTestAssertionEditor.dispatchEvent(new UpdateTestAssertionEvent(0, false, true, undefined, undefined));
            await ticks(1);
            const assertionRow = flowTestAssertionEditor.shadowRoot.querySelector(SELECTORS.FLOW_TEST_ASSERTION_ROW);
            const messageInput = assertionRow.shadowRoot.querySelector(SELECTORS.LIGHTNING_INPUT);
            expect(messageInput).toBeNull();
        });
        it('only updates expression when UpdateTestAssertionEvent is received and ', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testAssertions = [
                {
                    expression: createListRowItem(),
                    message: undefined
                }
            ];
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.Assertions);
            await ticks(1);
            const flowTestAssertionEditor = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_ASSERTION_EDITOR
            );
            const expectedExpression = createListRowItem();
            expectedExpression.rightHandSide = 'hello';
            flowTestAssertionEditor.dispatchEvent(
                new UpdateTestAssertionEvent(0, true, false, expectedExpression, undefined)
            );
            await ticks(1);
            expect(flowTestEditorComponent.flowTestObject.testAssertions[0].message).toEqual(undefined);
            expect(flowTestEditorComponent.flowTestObject.testAssertions[0].expression).toEqual(expectedExpression);
        });
    });
    describe('FlowTestInitialRecord', () => {
        it('updates test initial record data correctly', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.InitialRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestInitialRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, false, false));
            await ticks(1);
            const flowTestRecordObject = flowTestEditorComponent.flowTestObject.testInitialRecordData;
            expect(flowTestRecordObject.value).toEqual(expectedValue);
        });
        it('updates test initial record data correctly even with error', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.InitialRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestInitialRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, true, false));
            await ticks(1);
            const flowTestRecordObject = flowTestEditorComponent.flowTestObject.testInitialRecordData;
            expect(flowTestRecordObject.value).toEqual(expectedValue);
            expect(flowTestRecordObject.error).not.toBeNull();
        });
        it('updates test updated record data if it is empty and intial record data is not', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testTriggerType = { value: FLOW_TRIGGER_SAVE_TYPE.UPDATE, error: null };
            overriddenProps.mode = FlowTestMode.Create;
            overriddenProps.flowTestObject.testUpdatedRecordData = {};
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.InitialRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestInitialRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, true, false));
            await ticks(1);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.UpdatedRecord);
            await ticks(1);
            const flowTestUpdatedRecordObject = flowTestEditorComponent.flowTestObject.testUpdatedRecordData;
            expect(flowTestUpdatedRecordObject.value).toEqual(expectedValue);
            expect(flowTestUpdatedRecordObject.error).not.toBeNull();
        });
        it('does not update updated record if it is already populated and navigating from initial record data', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testTriggerType = { value: FLOW_TRIGGER_SAVE_TYPE.UPDATE, error: null };
            overriddenProps.mode = FlowTestMode.Create;
            overriddenProps.flowTestObject.testInitialRecordData = {};
            overriddenProps.flowTestObject.testUpdatedRecordData = {};
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.UpdatedRecord);
            await ticks(1);
            const flowTestUpdatedRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestUpdatedRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, false, true));
            flowTestUpdatedRecordComponent.dispatchEvent(
                new UpdateTestRecordDataEvent(
                    {
                        field1: { value: 'value3', error: null },
                        field2: { value: 'value4', error: null }
                    },
                    false,
                    false
                )
            );
            await ticks(1);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.InitialRecord);
            await ticks(1);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.UpdatedRecord);
            const flowTestUpdatedRecordObject = flowTestEditorComponent.flowTestObject.testUpdatedRecordData;
            expect(flowTestUpdatedRecordObject.value).toEqual(expectedValue);
        });
        it('clears the initial record data if selected record event contains null id', async () => {
            const flowTestEditorComponent = await createComponentUnderTest();
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.InitialRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            flowTestInitialRecordComponent.dispatchEvent(new FlowTestClearRecordFormEvent(false));
            expect(flowTestEditorComponent.flowTestObject.testInitialRecordData).toEqual({});
        });
    });
    describe('FlowTestUpdatedRecord', () => {
        it('updates test updated record data correctly', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testTriggerType = { value: FLOW_TRIGGER_SAVE_TYPE.UPDATE, error: null };
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.UpdatedRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestInitialRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, false, true));
            await ticks(1);
            const flowTestRecordObject = flowTestEditorComponent.flowTestObject.testUpdatedRecordData;
            expect(flowTestRecordObject.value).toEqual(expectedValue);
        });
        it('updates test updated record data correctly even with error', async () => {
            const overriddenProps = { ...DEFAULT_PROPS };
            overriddenProps.flowTestObject.testTriggerType = { value: FLOW_TRIGGER_SAVE_TYPE.UPDATE, error: null };
            const flowTestEditorComponent = await createComponentUnderTest(overriddenProps);
            navigateToTab(flowTestEditorComponent, FlowTestMenuItems.UpdatedRecord);
            await ticks(1);
            const flowTestInitialRecordComponent = flowTestEditorComponent.shadowRoot.querySelector(
                SELECTORS.FLOW_TEST_TRIGGER_EDIT_FORM
            );
            const expectedValue = {
                field1: { value: 'value1', error: null },
                field2: { value: 'value2', error: null }
            };
            flowTestInitialRecordComponent.dispatchEvent(new UpdateTestRecordDataEvent(expectedValue, true, true));
            await ticks(1);
            const flowTestRecordObject = flowTestEditorComponent.flowTestObject.testUpdatedRecordData;
            expect(flowTestRecordObject.value).toEqual(expectedValue);
            expect(flowTestRecordObject.error).not.toBeNull();
        });
    });
});
