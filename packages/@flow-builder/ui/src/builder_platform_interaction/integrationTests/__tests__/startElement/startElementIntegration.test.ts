// @ts-nocheck
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { getChildComponent, resetState, setupStateForFlow } from '../integrationTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { createElement } from 'lwc';
import contextRecordEditor from 'builder_platform_interaction/contextRecordEditor';
import timeTriggersEditor from 'builder_platform_interaction/timeTriggersEditor';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { RECORD_TIGGER_EVENT } from 'builder_platform_interaction/flowMetadata';
import {
    blurEvent,
    changeEvent,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    textInputEvent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { CONDITION_LOGIC, ELEMENT_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    emptyFilterItem,
    getFieldToFerovExpressionBuilders,
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    getRecordGroupedComboox
} from '../recordFilterTestUtils';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    TIME_SOURCE_COMBOBOX: '.timeSourceCombobox',
    OFFSET_NUMBER_INPUT: '.offsetNumberInput',
    OFFSET_UNIT_COMBOBOX: '.offsetUnitAndDirectionCombobox',
    DELETE_TIME_TRIGGER_BUTTON: '.delete-time-trigger-btn',
    IMMEDIATE_TIME_TRIGGER: '.test-immediate-time-trigger'
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/sobjectLib');
    return Object.assign({}, actual, {
        getFieldsForEntity: jest.fn().mockImplementation((entityName) => {
            if (entityName === 'Account') {
                return mockAccountFields;
            }
            return undefined;
        }),
        getEntity: jest.fn().mockImplementation((apiName) => {
            return {
                apiName
            };
        })
    });
});

const createComponentForTest = (contextRecordEditorElement) => {
    const el = createElement('builder_platform_interaction-context-record-editor', {
        is: contextRecordEditor
    });
    Object.assign(el, { node: contextRecordEditorElement });
    document.body.appendChild(el);
    return el;
};

const createTimeTriggerComponentForTest = (timeTriggeredEditorElement) => {
    const el = createElement('builder_platform_interaction-time-triggers-editor', {
        is: timeTriggersEditor
    });
    Object.assign(el, { node: timeTriggeredEditorElement });
    document.body.appendChild(el);
    return el;
};

const getSObjectField = (apiName) => {
    return mockAccountFields[apiName];
};

const getReorderableVerticalNavigationItems = (timeTriggerEditor) => {
    const verticalNavigation = deepQuerySelector(timeTriggerEditor, [SELECTORS.REORDERABLE_VERTICAL_NAVIGATION]);
    return verticalNavigation.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
};

const getReorderableVerticalNavigationTitle = (timeTriggerEditor, index) => {
    const items = getReorderableVerticalNavigationItems(timeTriggerEditor);
    return items[index].shadowRoot.querySelector('a');
};

const getAddTimeTriggerButton = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.LIGHTNING_BUTTON_ICON]);
};

const getImmediateTimeTrigger = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.IMMEDIATE_TIME_TRIGGER]);
};

const getDeleteTimeTriggerButton = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.TIME_TRIGGER, SELECTORS.DELETE_TIME_TRIGGER_BUTTON]);
};

const getTimeSourceCombobox = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.TIME_TRIGGER, SELECTORS.TIME_SOURCE_COMBOBOX]);
};

const getPathLabelInput = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.TIME_TRIGGER, SELECTORS.LABEL_DESCRIPTION, '.label']);
};

const getApiNameInput = (timeTriggerEditor) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.TIME_TRIGGER, SELECTORS.LABEL_DESCRIPTION, '.devName']);
};

const getTimeTriggerElement = (timeTriggerEditor, cssClass) => {
    return deepQuerySelector(timeTriggerEditor, [SELECTORS.TIME_TRIGGER, cssClass]);
};

describe('Start Element Editor (context record editor)', () => {
    let contextRecordComponent;
    beforeAll(async () => {
        await setupStateForFlow(scheduleTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    describe('default value', () => {
        let recordFilter;
        beforeEach(() => {
            const contextRecordNode = getElementForPropertyEditor({
                elementType: ELEMENT_TYPE.START_ELEMENT
            });
            contextRecordNode.triggerType.value = FLOW_TRIGGER_TYPE.SCHEDULED;
            contextRecordComponent = createComponentForTest(contextRecordNode);
        });
        it('should not display the record filter', () => {
            recordFilter = getChildComponent(contextRecordComponent, INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);
            expect(recordFilter).toBeNull();
        });
        it('should display the combobox to select an object and its value should be empty string', () => {
            expect(getRecordGroupedComboox(contextRecordComponent)).not.toBeNull();
            expect(getRecordGroupedComboox(contextRecordComponent).value).toBe('');
        });
        describe('When an object is selected', () => {
            beforeEach(async () => {
                getRecordGroupedComboox(contextRecordComponent).dispatchEvent(textInputEvent('Account'));
                getRecordGroupedComboox(contextRecordComponent).dispatchEvent(blurEvent);
                await ticks(1);
                recordFilter = getChildComponent(
                    contextRecordComponent,
                    INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER
                );
            });
            it('should display the filter after the record is selected', async () => {
                expect(recordFilter).not.toBeNull();
            });
            it('should have filter logic equals to "and" by default', () => {
                expect(recordFilter.filterLogic.value).toBe(CONDITION_LOGIC.AND);
            });
            it('Should have an empty filter displayed', () => {
                const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
                expect(fieldToFerovExpressionBuilderComponents).toHaveLength(1);
                expect(fieldToFerovExpressionBuilderComponents[0].expression).toMatchObject(emptyFilterItem);
            });
            it('Should not display the custom logic input', () => {
                expect(getFilterCustomConditionLogicInput(contextRecordComponent)).toBeNull();
            });
        });
    });
    describe('Existing element', () => {
        let recordFilter;
        beforeEach(() => {
            const startElement = getElementByDevName('$Record');
            const startElementForPropertyEditor = getElementForPropertyEditor(startElement);
            contextRecordComponent = createComponentForTest(startElementForPropertyEditor);
            recordFilter = getChildComponent(contextRecordComponent, INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);
        });
        it('should display the record filter', () => {
            expect(recordFilter).not.toBeNull();
        });
        it('should have filter logic equals to "no_conditions"', () => {
            expect(recordFilter.filterLogic.value).toBe(CONDITION_LOGIC.NO_CONDITIONS);
        });
        it('Should have 1 empty filter items', () => {
            expect(recordFilter.filterItems).toHaveLength(1);
            expect(recordFilter.filterItems[0]).toMatchObject(emptyFilterItem);
        });
        it('Should not display the filter item', () => {
            const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
            expect(fieldToFerovExpressionBuilderComponents).toHaveLength(0);
        });
        describe('When Condition logic change to "and"', () => {
            beforeEach(async () => {
                getFilterConditionLogicCombobox(contextRecordComponent).dispatchEvent(changeEvent(CONDITION_LOGIC.AND));
                await ticks(1);
            });
            it('Should have FilterLogic "and" selected', () => {
                expect(getFilterConditionLogicCombobox(contextRecordComponent).value).toBe(CONDITION_LOGIC.AND);
            });
            it('Should have an empty filter', () => {
                const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
                expect(fieldToFerovExpressionBuilderComponents).toHaveLength(1);
                expect(fieldToFerovExpressionBuilderComponents[0].expression).toMatchObject(emptyFilterItem);
            });
            it('Should not display the custom logic input', () => {
                expect(getFilterCustomConditionLogicInput(contextRecordComponent)).toBeNull();
            });
        });
        describe('When Condition logic change to "custom"', () => {
            beforeEach(async () => {
                getFilterConditionLogicCombobox(contextRecordComponent).dispatchEvent(
                    changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC)
                );
                await ticks(1);
            });
            it('Should have FilterLogic "custom" selected', () => {
                expect(getFilterConditionLogicCombobox(contextRecordComponent).value).toBe(
                    CONDITION_LOGIC.CUSTOM_LOGIC
                );
            });
            it('Should have an empty filter should be displayed', () => {
                const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
                expect(fieldToFerovExpressionBuilderComponents).toHaveLength(1);
                expect(fieldToFerovExpressionBuilderComponents[0].expression).toMatchObject(emptyFilterItem);
            });
            it('Should display the custom logic input', () => {
                expect(getFilterCustomConditionLogicInput(contextRecordComponent)).not.toBeNull();
                expect(getFilterCustomConditionLogicInput(contextRecordComponent).value).toBe('1');
            });
        });
    });
});

describe('Start Element Editor (Record Triggered Flow)', () => {
    let timeTriggerComponent;
    let timeTriggersNode;
    beforeAll(async () => {
        await setupStateForFlow(recordTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(() => {
        const startElement = getElementByDevName('$Record');
        timeTriggersNode = getElementForPropertyEditor(startElement);
        timeTriggerComponent = createTimeTriggerComponentForTest(timeTriggersNode);
    });
    describe('Reorderable Vertical Navigation', () => {
        it('should have 3 items', () => {
            expect(getReorderableVerticalNavigationItems(timeTriggerComponent)).toHaveLength(3);
        });
        it('should display the Path Label as link', () => {
            let link = getReorderableVerticalNavigationTitle(timeTriggerComponent, 0);
            expect(link.textContent).toBe(timeTriggersNode.timeTriggers[0].label.value);

            link = getReorderableVerticalNavigationTitle(timeTriggerComponent, 1);
            expect(link.textContent).toBe(timeTriggersNode.timeTriggers[1].label.value);
        });
    });
    describe('1st  Time Trigger inner component display', () => {
        let timeTrigger;
        beforeEach(() => {
            timeTrigger = timeTriggersNode.timeTriggers[0];
        });
        it('should be display time trigger Label in the Label description Component', () => {
            expect(getPathLabelInput(timeTriggerComponent).value).toBe(timeTrigger.label.value);
        });
        it('should be display time trigger name in the Label description Component', () => {
            expect(getApiNameInput(timeTriggerComponent).value).toBe(timeTrigger.name.value);
        });
        it('Should display the correct Time Source', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe(
                timeTrigger.timeSource.value
            );
        });
        it('Should display the correct Offset Number', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe(
                timeTrigger.offsetNumber.value
            );
        });
        it('Should display the correct Offset Unit', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe(
                timeTrigger.offsetUnit.value
            );
        });
    });
    describe('Select 2nd  Time Trigger inner component display', () => {
        let timeTrigger;
        beforeEach(async () => {
            timeTrigger = timeTriggersNode.timeTriggers[1];
            getReorderableVerticalNavigationTitle(timeTriggerComponent, 1).click();
            await ticks(10);
        });
        it('should be display time trigger Label in the Label description Component', () => {
            expect(getPathLabelInput(timeTriggerComponent).value).toBe(timeTrigger.label.value);
        });
        it('should be display time trigger name in the Label description Component', () => {
            expect(getApiNameInput(timeTriggerComponent).value).toBe(timeTrigger.name.value);
        });
        it('Should display the correct Time Source', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe(
                timeTrigger.timeSource.value
            );
        });
        it('Should display the correct Offset Number', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe(
                timeTrigger.offsetNumber.value
            );
        });
        it('Should display the correct Offset Unit', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe(
                timeTrigger.offsetUnit.value
            );
        });
    });
    describe('Time Trigger Time Source Options', () => {
        beforeEach(async () => {
            getReorderableVerticalNavigationTitle(timeTriggerComponent, 0).click();
            await ticks(10);
        });
        it('First Option has value Record Trigger Event', () => {
            expect.assertions(1);
            const timeSourceOptions = getTimeSourceCombobox(timeTriggerComponent).options;
            expect(getValueFromHydratedItem(timeSourceOptions[0].value)).toEqual(RECORD_TIGGER_EVENT);
        });
        it('Other options are of type Date Fields or Date Time Fields', () => {
            expect.assertions(3);
            let timeSourceOptions = getTimeSourceCombobox(timeTriggerComponent).options;
            timeSourceOptions = timeSourceOptions.slice(1);
            const filteredOptions = timeSourceOptions.filter((timeSourceOption) => {
                timeSourceOption = getValueFromHydratedItem(timeSourceOption.value);
                const dataType = getSObjectField(timeSourceOption).dataType;
                return dataType !== 'Date' && dataType !== 'DateTime';
            });
            expect(filteredOptions.length).toEqual(0);
            let timeSourceOption = getValueFromHydratedItem(timeSourceOptions[1].value);
            expect(getSObjectField(timeSourceOption).dataType).toEqual('DateTime');
            timeSourceOption = getValueFromHydratedItem(timeSourceOptions[6].value);
            expect(getSObjectField(timeSourceOption).dataType).toEqual('Date');
        });
    });
    describe('New Time Trigger', () => {
        beforeEach(async () => {
            getAddTimeTriggerButton(timeTriggerComponent).click();
            await ticks(10);
        });
        it('Should display the emptyTimeTriggerLabel in the navigation menu', () => {
            expect(getReorderableVerticalNavigationItems(timeTriggerComponent)).toHaveLength(4);
            const link = getReorderableVerticalNavigationTitle(timeTriggerComponent, 2);
            expect(link.textContent).toBe('FlowBuilderStartEditor.emptyTimeTriggerLabel');
        });
        it('Label should be display in the Label description Component', () => {
            expect(getPathLabelInput(timeTriggerComponent).value).toBe('');
        });
        it('Name should be display in the Label description Component', () => {
            expect(getApiNameInput(timeTriggerComponent).value).toBe('');
        });
        it('Should select the correct Time Source', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe('');
        });
        it('Should select the correct Offset Number', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe('');
        });
        it('Should select the correct Offset Unit', () => {
            expect(getTimeTriggerElement(timeTriggerComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe('');
        });
    });
    describe('Delete Time Trigger', () => {
        it('sets the first time trigger as active when there are 3 time triggers (including immediate) and the second one is deleted', async () => {
            expect.assertions(1);
            getReorderableVerticalNavigationTitle(timeTriggerComponent, 1).click();
            await ticks(1);
            getDeleteTimeTriggerButton(timeTriggerComponent).click();
            await ticks(1);
            expect(getApiNameInput(timeTriggerComponent).value).toBe(timeTriggersNode.timeTriggers[0].name.value);
        });
        it('sets the immediate time trigger as active when all time triggers are deleted except immediate', async () => {
            expect.assertions(1);
            getDeleteTimeTriggerButton(timeTriggerComponent).click();
            await ticks(1);
            getDeleteTimeTriggerButton(timeTriggerComponent).click();
            await ticks(1);
            expect(getImmediateTimeTrigger(timeTriggerComponent)).not.toBe(null);
        });
    });
});
