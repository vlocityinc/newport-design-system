import {createElement} from 'lwc';
import Outcome from "builder_platform_interaction/outcome";
import {
    DeleteOutcomeEvent
} from "builder_platform_interaction/events";
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from "../outcomeLabels";

const outcomeWithOneConditional = {
    label: {value: 'Test Name of the Outcome'},
    name: {value: 'Test Dev Name'},
    guid: {value: '123'},
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1', rowIndex: 0}
    ]
};
const outcomeWithThreeConditionals = {
    guid: {value: '123'},
    conditionLogic: {value: '1 and 2'},
    conditions: [
        {name: 'condition1', rowIndex: 0},
        {name: 'condition2', rowIndex: 1},
        {name: 'condition3', rowIndex: 2},
    ]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeOutcome',
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-outcome', {
        is: Outcome
    });
    document.body.appendChild(el);

    el.showDelete = true;

    return el;
};

describe('Outcome', () => {
    describe('header section', () => {
        it('has name and api name component', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            return Promise.resolve().then(() => {
                const labelAndNameComponents = getShadowRoot(element).querySelectorAll(selectors.labelAndName);
                expect(labelAndNameComponents).toHaveLength(1);
                expect(labelAndNameComponents[0].devName.value).toBe(outcomeWithOneConditional.name.value);
                expect(labelAndNameComponents[0].label.value).toBe(outcomeWithOneConditional.label.value);
            });
        });
        it('has Remove button if show delete is true', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelectorAll(selectors.removeButton)[0];

                expect(removeButton.label).toBe(LABELS.deleteOutcomeLabel);
                expect(removeButton.title).toBe(LABELS.deleteOutcomeTitle);
            });
        });
        it('has no Remove button if show delete is false', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;
            element.showDelete = false;

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelector(selectors.removeButton);

                expect(removeButton).toBeNull();
            });
        });
    });

    describe('handleDelete', () => {
        it('fires deleteOutcomeEvent with outcome GUID', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteOutcomeEvent.EVENT_NAME, eventCallback);

                const removeButton = getShadowRoot(element).querySelector(selectors.button);
                removeButton.click();

                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: element.outcome.guid
                    }
                });
            });
        });
    });

    // TODO: Determine how to test 'grandchildren' which are passed in to slots.  This is not currently
    // supported by jsdom. See outstanding PR: https://github.com/jsdom/jsdom/pull/2347/files
    //
    // it('expression builder type should be fer-to-ferov if no fields present', () => {
    //     const element = createComponentUnderTest(listWithThreeConditionals);
    //
    //     return Promise.resolve().then(() => {
    //         const ebs = getShadowRoot(element).querySelectorAll(selectors.ferToFerov);
    //         expect(ebs).toHaveLength(3);
    //     });
    // });
    // describe('condition list', () => {
    //     it('has one conditional row per conditional', () => {
    //         const element = createComponentUnderTest(listWithThreeConditionals);
    //
    //         return Promise.resolve().then(() => {
    //             const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);
    //
    //             expect(rowsArray).toHaveLength(3);
    //         });
    //     });
    // describe('prefix', () => {
    // it('show-prefix is always true', () => {
    //     const element = createComponentUnderTest(listWithThreeConditionals);
    //
    //     return Promise.resolve().then(() => {
    //         const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);
    //
    //         expect(rowsArray[0].showPrefix).toBeTruthy();
    //         expect(rowsArray[1].showPrefix).toBeTruthy();
    //         expect(rowsArray[2].showPrefix).toBeTruthy();
    //     });
    // });
    //     it('show-prefix is always true', () => {
    //         const element = createComponentUnderTest(listWithThreeConditionals);
    //
    //         return Promise.resolve().then(() => {
    //             const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);
    //
    //             expect(rowsArray[0].showPrefix).toBeTruthy();
    //             expect(rowsArray[1].showPrefix).toBeTruthy();
    //             expect(rowsArray[2].showPrefix).toBeTruthy();
    //         });
    //     });
    // });
});