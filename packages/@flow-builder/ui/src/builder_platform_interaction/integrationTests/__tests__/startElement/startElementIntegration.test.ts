import {
    changeEvent,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import contextRecordEditor from 'builder_platform_interaction/contextRecordEditor';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import {
    CONDITION_LOGIC,
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    RECORD_TIGGER_EVENT
} from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import scheduledPathsEditor from 'builder_platform_interaction/scheduledPathsEditor';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { getChildComponent, resetState, setupStateForFlow } from '../integrationTestUtils';
import {
    emptyFilterItem,
    getFieldToFerovExpressionBuilders,
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    getRecordCombobox
} from '../recordFilterTestUtils';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    TIME_SOURCE_COMBOBOX: '.timeSourceCombobox',
    OFFSET_NUMBER_INPUT: '.offsetNumberInput',
    OFFSET_UNIT_COMBOBOX: '.offsetUnitAndDirectionCombobox',
    DELETE_SCHEDULED_PATH_BUTTON: '.delete-scheduled-path-btn',
    IMMEDIATE_SCHEDULED_PATH: '.test-immediate-scheduled-path'
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

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, sharedUtils, {
        invokeModal: require('builder_platform_interaction/sharedUtils/auraUtils').invokeModal
    });
});

const createComponentForTest = (contextRecordEditorElement) => {
    const el = createElement('builder_platform_interaction-context-record-editor', {
        is: contextRecordEditor
    });
    Object.assign(el, { node: contextRecordEditorElement });
    setDocumentBodyChildren(el);
    return el;
};

const createScheduledPathComponentForTest = (scheduledPathedEditorElement) => {
    const el = createElement('builder_platform_interaction-scheduled-paths-editor', {
        is: scheduledPathsEditor
    });
    Object.assign(el, { node: scheduledPathedEditorElement });
    setDocumentBodyChildren(el);
    return el;
};

const getSObjectField = (apiName) => {
    return mockAccountFields[apiName];
};

const getReorderableVerticalNavigationItems = (scheduledPathEditor) => {
    const verticalNavigation = deepQuerySelector(scheduledPathEditor, [SELECTORS.REORDERABLE_VERTICAL_NAVIGATION]);
    return verticalNavigation.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
};

const getReorderableVerticalNavigationTitle = (scheduledPathEditor, index) => {
    const items = getReorderableVerticalNavigationItems(scheduledPathEditor);
    return items[index].shadowRoot.querySelector('.slds-vertical-tabs__link');
};

const getAddScheduledPathButton = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.LIGHTNING_BUTTON_ICON]);
};

const getImmediateScheduledPath = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.IMMEDIATE_SCHEDULED_PATH]);
};

const getDeleteScheduledPathButton = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.SCHEDULED_PATH, SELECTORS.DELETE_SCHEDULED_PATH_BUTTON]);
};

const getTimeSourceCombobox = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.SCHEDULED_PATH, SELECTORS.TIME_SOURCE_COMBOBOX]);
};

const getPathLabelInput = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.SCHEDULED_PATH, SELECTORS.LABEL_DESCRIPTION, '.label']);
};

const getApiNameInput = (scheduledPathEditor) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.SCHEDULED_PATH, SELECTORS.LABEL_DESCRIPTION, '.devName']);
};

const getScheduledPathElement = (scheduledPathEditor, cssClass) => {
    return deepQuerySelector(scheduledPathEditor, [SELECTORS.SCHEDULED_PATH, cssClass]);
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
            expect(getRecordCombobox(contextRecordComponent).getGroupedCombobox().element.value).toBe('');
        });
        describe('When an object is selected', () => {
            beforeEach(async () => {
                await getRecordCombobox(contextRecordComponent).typeLiteralValue('Account');
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
                expect(fieldToFerovExpressionBuilderComponents[0].element.expression).toMatchObject(emptyFilterItem);
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
                expect(fieldToFerovExpressionBuilderComponents[0].element.expression).toMatchObject(emptyFilterItem);
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
                expect(fieldToFerovExpressionBuilderComponents[0].element.expression).toMatchObject(emptyFilterItem);
            });
            it('Should display the custom logic input', () => {
                expect(getFilterCustomConditionLogicInput(contextRecordComponent)).not.toBeNull();
                expect(getFilterCustomConditionLogicInput(contextRecordComponent).value).toBe('1');
            });
        });
    });
});

describe('Start Element Editor (Record Triggered Flow)', () => {
    let scheduledPathComponent;
    let scheduledPathsNode;
    beforeAll(async () => {
        await setupStateForFlow(recordTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(() => {
        const startElement = getElementByDevName('$Record');
        scheduledPathsNode = getElementForPropertyEditor(startElement);
        scheduledPathComponent = createScheduledPathComponentForTest(scheduledPathsNode);
    });
    describe('Reorderable Vertical Navigation', () => {
        it('should have 3 items', () => {
            expect(getReorderableVerticalNavigationItems(scheduledPathComponent)).toHaveLength(3);
        });
        it('should display the Path Label as link', () => {
            let link = getReorderableVerticalNavigationTitle(scheduledPathComponent, 1);
            expect(link.textContent).toBe(scheduledPathsNode.scheduledPaths[0].label.value);

            link = getReorderableVerticalNavigationTitle(scheduledPathComponent, 2);
            expect(link.textContent).toBe(scheduledPathsNode.scheduledPaths[1].label.value);
        });
    });
    describe('1st  Scheduled Path inner component display', () => {
        let scheduledPath;
        beforeEach(() => {
            scheduledPath = scheduledPathsNode.scheduledPaths[0];
        });
        it('should be display scheduled path Label in the Label description Component', () => {
            expect(getPathLabelInput(scheduledPathComponent).value).toBe(scheduledPath.label.value);
        });
        it('should be display scheduled path name in the Label description Component', () => {
            expect(getApiNameInput(scheduledPathComponent).value).toBe(scheduledPath.name.value);
        });
        it('Should display the correct Time Source', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe(
                scheduledPath.timeSource.value
            );
        });
        it('Should display the correct Offset Number', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe(
                scheduledPath.offsetNumber.value
            );
        });
        it('Should display the correct Offset Unit', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe(
                scheduledPath.offsetUnit.value
            );
        });
    });
    describe('Select 2nd  Scheduled Path inner component display', () => {
        let scheduledPath;
        beforeEach(async () => {
            scheduledPath = scheduledPathsNode.scheduledPaths[1];
            getReorderableVerticalNavigationTitle(scheduledPathComponent, 2).click();
            await ticks(10);
        });
        it('should be display scheduled path Label in the Label description Component', () => {
            expect(getPathLabelInput(scheduledPathComponent).value).toBe(scheduledPath.label.value);
        });
        it('should be display scheduled path name in the Label description Component', () => {
            expect(getApiNameInput(scheduledPathComponent).value).toBe(scheduledPath.name.value);
        });
        it('Should display the correct Time Source', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe(
                scheduledPath.timeSource.value
            );
        });
        it('Should display the correct Offset Number', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe(
                scheduledPath.offsetNumber.value
            );
        });
        it('Should display the correct Offset Unit', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe(
                scheduledPath.offsetUnit.value
            );
        });
    });
    describe('Scheduled Path Time Source Options', () => {
        beforeEach(async () => {
            getReorderableVerticalNavigationTitle(scheduledPathComponent, 1).click();
            await ticks(10);
        });
        it('First Option has value Record Trigger Event', () => {
            expect.assertions(1);
            const timeSourceOptions = getTimeSourceCombobox(scheduledPathComponent).options;
            expect(getValueFromHydratedItem(timeSourceOptions[0].value)).toEqual(RECORD_TIGGER_EVENT);
        });
        it('Other options are of type Date Fields or Date Time Fields', () => {
            expect.assertions(3);
            let timeSourceOptions = getTimeSourceCombobox(scheduledPathComponent).options;
            timeSourceOptions = timeSourceOptions.slice(1);
            const filteredOptions = timeSourceOptions.filter((timeSourceOption) => {
                timeSourceOption = getValueFromHydratedItem(timeSourceOption.value);
                const sobjectField = getSObjectField(timeSourceOption);
                const dataType = sobjectField.dataType;
                return (dataType !== 'Date' && dataType !== 'DateTime') || !sobjectField.isWorkflowFilterable;
            });
            expect(filteredOptions.length).toEqual(0);
            let timeSourceOption = getValueFromHydratedItem(timeSourceOptions[1].value);
            expect(getSObjectField(timeSourceOption).dataType).toEqual('DateTime');
            timeSourceOption = getValueFromHydratedItem(timeSourceOptions[3].value);
            expect(getSObjectField(timeSourceOption).dataType).toEqual('Date');
        });
        it('options have isWorkflowFilterable equals true', () => {
            let timeSourceOptions = getTimeSourceCombobox(scheduledPathComponent).options;
            timeSourceOptions = timeSourceOptions.slice(1);
            timeSourceOptions.forEach((option) => {
                const timeSourceOption = getValueFromHydratedItem(option.value);
                expect(getSObjectField(timeSourceOption).isWorkflowFilterable).toEqual(true);
            });
        });
    });
    describe('New Scheduled Path', () => {
        beforeEach(async () => {
            getAddScheduledPathButton(scheduledPathComponent).click();
            await ticks(10);
        });
        it('Should display the emptyScheduledPathLabel in the navigation menu', () => {
            expect(getReorderableVerticalNavigationItems(scheduledPathComponent)).toHaveLength(4);
            const link = getReorderableVerticalNavigationTitle(scheduledPathComponent, 3);
            expect(link.textContent).toBe('FlowBuilderStartEditor.emptyScheduledPathLabel');
        });
        it('Label should be display in the Label description Component', () => {
            expect(getPathLabelInput(scheduledPathComponent).value).toBe('');
        });
        it('Name should be display in the Label description Component', () => {
            expect(getApiNameInput(scheduledPathComponent).value).toBe('');
        });
        it('Should select the correct Time Source', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.TIME_SOURCE_COMBOBOX).value).toBe('');
        });
        it('Should select the correct Offset Number', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_NUMBER_INPUT).value).toBe('');
        });
        it('Should select the correct Offset Unit', () => {
            expect(getScheduledPathElement(scheduledPathComponent, SELECTORS.OFFSET_UNIT_COMBOBOX).value).toBe('');
        });
    });
    describe('Delete Scheduled Path', () => {
        it('sets the first scheduled path as active when there are 3 scheduled paths (including immediate) and the second one is deleted', async () => {
            expect.assertions(1);
            getReorderableVerticalNavigationTitle(scheduledPathComponent, 2).click();
            await ticks(1);
            getDeleteScheduledPathButton(scheduledPathComponent).click();
            await ticks(1);
            expect(getApiNameInput(scheduledPathComponent).value).toBe(scheduledPathsNode.scheduledPaths[0].name.value);
        });
        it('sets the immediate scheduled path as active when all scheduled paths are deleted except immediate', async () => {
            expect.assertions(1);
            getDeleteScheduledPathButton(scheduledPathComponent).click();
            await ticks(1);
            getDeleteScheduledPathButton(scheduledPathComponent).click();
            await ticks(1);
            expect(getImmediateScheduledPath(scheduledPathComponent)).not.toBe(null);
        });
    });
});
