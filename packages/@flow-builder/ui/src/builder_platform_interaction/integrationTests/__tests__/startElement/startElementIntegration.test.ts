// @ts-nocheck
import * as autoLaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import { getChildComponent, resetState, setupStateForFlow } from '../integrationTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { createElement } from 'lwc';
import contextRecordEditor from 'builder_platform_interaction/contextRecordEditor';
import {
    blurEvent,
    changeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
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

const createComponentForTest = (contextRecordEditorElement) => {
    const el = createElement('builder_platform_interaction-context-record-editor', {
        is: contextRecordEditor
    });
    Object.assign(el, { node: contextRecordEditorElement });
    document.body.appendChild(el);
    return el;
};

describe('Start Element Editor (context record editor)', () => {
    let contextRecordComponent;
    beforeAll(async () => {
        await setupStateForFlow(autoLaunchedFlow);
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
