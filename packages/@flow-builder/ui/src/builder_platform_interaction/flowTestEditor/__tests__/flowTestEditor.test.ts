// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    ListItemInteractionEvent,
    PropertyChangedEvent,
    UpdateTestAssertionEvent
} from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FlowTestMenuItems } from '../flowTestEditor';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
};

const DEFAULT_PROPS = {
    flowTestObject: {
        label: '',
        name: '',
        description: '',
        runPathValue: '',
        testTriggerType: '',
        testAssertions: [
            {
                expression: createListRowItem()
            }
        ]
    },
    triggerSaveType: ''
};

const createComponentUnderTest = async (overrideProps) => {
    return createComponent(SELECTORS.FLOW_TEST_EDITOR, DEFAULT_PROPS, overrideProps);
};

const navigateToTab = async (parent, menuItem: FlowTestMenuItems) => {
    const vertNavigator = parent.shadowRoot.querySelector(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION);
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
    describe('FlowTestDetails', () => {
        let flowTestEditorComponent;
        beforeEach(async () => {
            flowTestEditorComponent = await createComponentUnderTest();
        });
        it('creates a new menu item when Trigger type is changed to Updated', async () => {
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
        });
        it('deletes assertion row when DeleteListItemEvent is received', async () => {
            const flowTestEditorComponent = await createComponentUnderTest({
                flowTestObject: {
                    label: '',
                    name: '',
                    description: '',
                    runPathValue: '',
                    testTriggerType: '',
                    testAssertions: [
                        {
                            expression: createListRowItem()
                        },
                        {
                            expression: createListRowItem()
                        }
                    ]
                },
                triggerSaveType: ''
            });
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
            const flowTestEditorComponent = await createComponentUnderTest({
                flowTestObject: {
                    label: '',
                    name: '',
                    description: '',
                    runPathValue: '',
                    testTriggerType: '',
                    testAssertions: [
                        {
                            expression: createListRowItem(),
                            message: {
                                value: '',
                                error: null
                            }
                        }
                    ]
                },
                triggerSaveType: ''
            });
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
            const flowTestEditorComponent = await createComponentUnderTest();
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
});
