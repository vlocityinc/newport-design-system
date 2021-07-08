import { createElement } from 'lwc';
import ScreenChoiceField from 'builder_platform_interaction/screenChoiceField';
import { setDocumentBodyChildren, createTestScreenField } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const SELECTORS = {
    CHECKBOX_GROUP: 'lightning-checkbox-group',
    COMBOBOX: 'lightning-combobox'
};
const testLabel = 'Chechbox Group';
const MOCK_PICKLIST_CHOICE_SET_PREFIX = 'picklistChoiceSet';
const MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
const MOCK_CHOICE_ELEMENT_TYPE = ELEMENT_TYPE.CHOICE;
const MOCK_STRING_FLOW_DATE_TYPE = FLOW_DATA_TYPE.STRING;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            if (guid === 'foobar') {
                return null;
            }
            const elementType = guid.startsWith(MOCK_PICKLIST_CHOICE_SET_PREFIX)
                ? MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE
                : MOCK_CHOICE_ELEMENT_TYPE;
            return {
                dataType: MOCK_STRING_FLOW_DATE_TYPE.value,
                elementType,
                guid,
                isCanvasElement: false,
                isCollection: false,
                name: guid,
                choiceText: { value: guid, error: null },
                picklistField: { value: 'Industry', error: null },
                picklistObject: { value: 'industryObj', error: null }
            };
        },
        isDevNameInStore: jest.fn()
    };
});
jest.mock('builder_platform_interaction/propertyEditorFactory', () => {
    return {
        getElementForPropertyEditor: jest.fn().mockImplementation((node) => node)
    };
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-choice-field', { is: ScreenChoiceField });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

function createMultiCheckboxScreenField() {
    const field = createTestScreenField(
        'checkboxGroup',
        FlowScreenFieldType.MultiSelectCheckboxes,
        { value: 'test', error: null },
        {
            dataType: FLOW_DATA_TYPE.STRING.value,
            validation: false,
            helpText: false
        }
    );
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
    });
    return field;
}

function createPicklistScreenField() {
    const field = createTestScreenField(
        'picklist',
        FlowScreenFieldType.DropdownBox,
        { value: 'test', error: null },
        {
            dataType: FLOW_DATA_TYPE.STRING.value,
            validation: false,
            helpText: false
        }
    );
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    return field;
}

describe('Multi checkbox screen field', () => {
    let checkboxGroupWrapperCmp;
    beforeEach(() => {
        const field = createMultiCheckboxScreenField();
        checkboxGroupWrapperCmp = createComponentForTest({
            field,
            label: { value: testLabel, error: null }
        });
    });
    it('Options should have correct length', () => {
        const checkboxGroup = checkboxGroupWrapperCmp.shadowRoot.querySelector(SELECTORS.CHECKBOX_GROUP);
        expect(checkboxGroup).toBeDefined();
        expect(checkboxGroup.options).toHaveLength(2);
    });
    describe('No Default Value set', () => {
        it('No value selected', () => {
            const checkboxGroup = checkboxGroupWrapperCmp.shadowRoot.querySelector(SELECTORS.CHECKBOX_GROUP);
            expect(checkboxGroup.value).toBeDefined();
            expect(checkboxGroup.value).toHaveLength(0);
        });
    });
    describe('Default Value is a literal', () => {
        let checkboxGroupWrapperCmp;
        beforeEach(() => {
            const field = createMultiCheckboxScreenField();
            field.defaultValue = { value: 'choice1', error: null };
            field.defaultValue = { value: 'foobar', error: null };
            checkboxGroupWrapperCmp = createComponentForTest({
                field,
                label: { value: testLabel, error: null }
            });
        });
        it('No value selected', () => {
            const checkboxGroup = checkboxGroupWrapperCmp.shadowRoot.querySelector(SELECTORS.CHECKBOX_GROUP);
            expect(checkboxGroup.value).toBeDefined();
            expect(checkboxGroup.value).toHaveLength(0);
        });
    });
    describe('Default Value is one of the static choices among choice references', () => {
        let checkboxGroupWrapperCmp;
        beforeEach(() => {
            const field = createMultiCheckboxScreenField();
            field.defaultValue = { value: 'choice1', error: null };
            checkboxGroupWrapperCmp = createComponentForTest({
                field,
                label: { value: testLabel, error: null }
            });
        });
        it('Value is selected', () => {
            const checkboxGroup = checkboxGroupWrapperCmp.shadowRoot.querySelector(SELECTORS.CHECKBOX_GROUP);
            expect(checkboxGroup.value).toBeDefined();
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.value[0]).toEqual('choice1');
        });
    });
    describe('Default Value is a resource and not one of the static choices among choice references', () => {
        let checkboxGroupWrapperCmp;
        beforeEach(() => {
            const field = createMultiCheckboxScreenField();
            field.defaultValue = { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null };
            checkboxGroupWrapperCmp = createComponentForTest({
                field,
                label: { value: testLabel, error: null }
            });
        });
        it('No value selected', () => {
            const checkboxGroup = checkboxGroupWrapperCmp.shadowRoot.querySelector(SELECTORS.CHECKBOX_GROUP);
            expect(checkboxGroup.value).toBeDefined();
            expect(checkboxGroup.value).toHaveLength(0);
        });
    });
});

describe('picklist screenField', () => {
    let picklistWrapperCmp;
    beforeEach(() => {
        const field = createPicklistScreenField();
        picklistWrapperCmp = createComponentForTest({
            field,
            label: { value: testLabel, error: null }
        });
    });
    it('No Default Value set', () => {
        const picklistGroup = picklistWrapperCmp.shadowRoot.querySelector(SELECTORS.COMBOBOX);
        expect(picklistGroup.value).toBeDefined();
        expect(picklistGroup.value).toBeNull();
    });
    describe('Default Value Set', () => {
        beforeEach(() => {
            const field = createPicklistScreenField();
            field.defaultValue = { value: 'choice1', error: null };
            picklistWrapperCmp = createComponentForTest({
                field,
                label: { value: testLabel, error: null }
            });
        });
        it('default value should show', () => {
            const picklistGroup = picklistWrapperCmp.shadowRoot.querySelector(SELECTORS.COMBOBOX);
            expect(picklistGroup.value).toBeDefined();
            expect(picklistGroup.value).toEqual('choice1');
        });
    });
});
