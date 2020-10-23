// @ts-nocheck
import { createElement } from 'lwc';
import StartNodeContextButton from 'builder_platform_interaction/startNodeContextButton';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { EDIT_START_RECORD_CHANGE_CONTEXT } from 'builder_platform_interaction/elementConfig';
import { startElementWithAccountAndNoCondition } from 'mock/storeDataAutolaunched';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/commonUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/commonUtils');
    return {
        isUndefinedOrNull: actual.isUndefinedOrNull,
        format: actual.format
    };
});
jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getEntitiesMenuData: actual.getEntitiesMenuData
    };
});

jest.mock(
    '@salesforce/label/FlowBuilderCanvasElement.startElementConditionsApplied',
    () => ({ default: '{0} applied' }),
    {
        virtual: true
    }
);

jest.mock(
    '@salesforce/label/FlowBuilderCanvasElement.startElementRecordConditions',
    () => ({ default: 'Record Conditions: ' }),
    {
        virtual: true
    }
);

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const commands = require('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands });
});
const setupComponentUnderTest = (startElementObject, flowTriggerType) => {
    const element = createElement('builder_platform_interaction-start-node-context-button', {
        is: StartNodeContextButton
    });
    if (startElementObject) {
        element.node = startElementObject;
    } else if (flowTriggerType) {
        element.node.triggerType = flowTriggerType;
    }

    document.body.appendChild(element);
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

describe('Focus Management', () => {
    it('Should fire ArrowKeyDownEvent with the right key on pressing arrow down key', () => {
        const startNodeContextButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.SCHEDULED);
        const callback = jest.fn();
        startNodeContextButtonEditor.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
        startNodeContextButtonEditor.keyboardInteractions.execute('arrowdown');
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.key).toBe('arrowDown');
    });

    it('Should fire ArrowKeyDownEvent with the right key on pressing arrow up key', () => {
        const startNodeContextButtonEditor = setupComponentUnderTest(null, FLOW_TRIGGER_TYPE.SCHEDULED);
        const callback = jest.fn();
        startNodeContextButtonEditor.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
        startNodeContextButtonEditor.keyboardInteractions.execute('arrowup');
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.key).toBe('arrowUp');
    });
});

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
                    'Record Conditions: 1 applied'
                );
                expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
            });
        });
    });
});
describe('When flow trigger Type is BEFORE_SAVE', () => {
    let startNodeContextButtonEditor;
    beforeAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.BEFORE_SAVE;
    });
    beforeEach(() => {
        startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
    });
    afterAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.SCHEDULED;
    });
    it('Checks if non configured before record changed context button rendered text correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonText).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject Account'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
    });
    it('Checks if an EditElementEvent is dispatched when button is clicked', () => {
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            startNodeContextButtonEditor.addEventListener(EditElementEvent.EVENT_NAME, callback);
            startNodeContextButtonEditor.shadowRoot.querySelector(selectors.startContext).click();
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: startNodeContextButtonEditor.node.guid,
                    mode: EDIT_START_RECORD_CHANGE_CONTEXT
                }
            });
        });
    });
});
describe('When flow trigger Type is BEFORE_DELETE', () => {
    let startNodeContextButtonEditor;
    beforeAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.BEFORE_DELETE;
    });
    beforeEach(() => {
        startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
    });
    afterAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.SCHEDULED;
    });
    it('Checks if non configured before delete record changed context button rendered text correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonText).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject Account'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
    });
    it('Checks if configured before delete record changed context button rendered correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.startContext).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject AccountFlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
    });
});
describe('When flow trigger Type is AFTER_SAVE', () => {
    let startNodeContextButtonEditor;
    beforeAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.AFTER_SAVE;
    });
    beforeEach(() => {
        startNodeContextButtonEditor = setupComponentUnderTest(startElementWithAccountAndNoCondition);
    });
    afterAll(() => {
        startElementWithAccountAndNoCondition.triggerType = FLOW_TRIGGER_TYPE.SCHEDULED;
    });
    it('Checks if non configured after record changed context button rendered text correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonText).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject Account'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
    });
    it('Checks if configured before record changed context button rendered correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.startContext).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject AccountFlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
    });
    it('Checks if configured after record changed context button rendered correctly', () => {
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.startContext).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject AccountFlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(startNodeContextButtonEditor, selectors.contextButtonOptionlText)).toBeNull();
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
