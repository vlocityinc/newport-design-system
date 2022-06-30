// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import StartNodeContextButton from 'builder_platform_interaction/startNodeContextButton';
import { createElement } from 'lwc';
import { startElementWithAccountAndNoCondition } from 'mock/storeDataScheduleTriggered';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/commonUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/commonUtils');
    return {
        isUndefinedOrNull: actual.isUndefinedOrNull
    };
});
jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getEntitiesMenuData: actual.getEntitiesMenuData
    };
});

jest.mock(
    '@salesforce/label/FlowBuilderCanvasElement.startElementRecordConditions',
    () => ({ default: 'Record Conditions: ' }),
    {
        virtual: true
    }
);

const setupComponentUnderTest = (startElementObject, flowTriggerType) => {
    const element = createElement('builder_platform_interaction-start-node-context-button', {
        is: StartNodeContextButton
    });
    if (startElementObject) {
        element.node = startElementObject;
    } else if (flowTriggerType) {
        element.node = { triggerType: flowTriggerType };
    }

    setDocumentBodyChildren(element);
    return element;
};

const selectors = {
    startContext: '.start-context',
    contextButtonText: '.start-context span',
    contextButtonOptionlText: '.start-context .optional',
    objectLabel: '.test-object-label',
    selectedObject: '.test-selected-object',
    editLabel: '.edit',
    recordConditions: '.test-conditions'
};
const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

describe('When flow trigger Type is SCHEDULED', () => {
    let startNodeContextButtonEditor;
    describe(' non configured scheduled context', () => {
        beforeEach(() => {
            startNodeContextButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.SCHEDULED);
        });
        it('Checks if non configured scheduled context button rendered text correctly', () => {
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonText).textContent).toBe(
                'FlowBuilderCanvasElement.startElementChooseObject'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText).textContent).toBe(
                'FlowBuilderCanvasElement.startElementOptional'
            );
        });
    });
    describe('with configured scheduled context', () => {
        beforeEach(() => {
            startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
        });
        it('Checks if configured Scheduled context button rendered correctly with no filters', () => {
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.objectLabel).textContent).toBe(
                ' FlowBuilderCanvasElement.startElementObject '
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.selectedObject).textContent).toBe(
                'Account'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.editLabel).textContent).toBe(
                'FlowBuilderCanvasElement.startElementEdit'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.recordConditions)).toBeNull();
        });
        describe('With Filter', () => {
            beforeAll(() => {
                startElementWithAccountAndNoCondition.filters[0].leftHandSide = 'Account.BillingCity';
                startElementWithAccountAndNoCondition.filterLogic = CONDITION_LOGIC.AND;
                startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
            });
            afterAll(() => {
                startElementWithAccountAndNoCondition.filters[0].leftHandSide = '';
                startElementWithAccountAndNoCondition.filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
            });
            it('Checks if configured Scheduled context button rendered correctly with filters', () => {
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.objectLabel).textContent).toBe(
                    ' FlowBuilderCanvasElement.startElementObject '
                );
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.selectedObject).textContent).toBe(
                    'Account'
                );
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.editLabel).textContent).toBe(
                    'FlowBuilderCanvasElement.startElementEdit'
                );
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.recordConditions).textContent).toBe(
                    'Record Conditions: 1'
                );
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
            });
        });
    });
});

describe('When flow trigger Type is SCHEDULED_JOURNEY', () => {
    let startNodeContextButtonEditor;
    describe('without context', () => {
        beforeEach(() => {
            startNodeContextButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY);
        });
        it('Checks if non configured Journey audience button rendered text correctly', () => {
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonText).textContent).toBe(
                'FlowBuilderCanvasElement.startElementChooseAudience'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
        });
    });
    describe('with context', () => {
        beforeAll(() => {
            startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY;
            startElementWithAccountAndNoCondition.object = 'Audience';
            startElementWithAccountAndNoCondition.objectContainer = 'testContainer';
            startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
        });
        afterAll(() => {
            startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.SCHEDULED;
            startElementWithAccountAndNoCondition.object = 'Account';
            startElementWithAccountAndNoCondition.objectContainer = '';
        });
        it('Checks if configured Journey context button rendered correctly', () => {
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.objectLabel).textContent).toBe(
                ' FlowBuilderCanvasElement.startElementObject '
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.selectedObject).textContent).toBe(
                'Audience'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.editLabel).textContent).toBe(
                'FlowBuilderCanvasElement.startElementEdit'
            );
            expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
        });
    });
});
