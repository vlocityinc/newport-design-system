// @ts-nocheck
import {
    createTestScreen,
    createTestScreenField,
    SCREEN_NO_DEF_VALUE
} from 'builder_platform_interaction/builderTestUtils';
import { screenReducer } from '../screenReducer';
import { createChoice } from 'builder_platform_interaction/elementFactory';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as usebyMock from 'builder_platform_interaction/usedByLib';

const SCREEN_NAME = 'TestScreen1';
const MOCK_PICKLIST_CHOICE_SET_PREFIX = 'picklistChoiceSet';
const MOCK_STATIC_CHOICE_NUMBER = 'choiceNumber';
const MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
const MOCK_CHOICE_ELEMENT_TYPE = ELEMENT_TYPE.CHOICE;
const MOCK_STRING_FLOW_DATA_TYPE = FLOW_DATA_TYPE.STRING;
const MOCK_NUMBER_FLOW_DATA_TYPE = FLOW_DATA_TYPE.NUMBER;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            const elementType = guid.startsWith(MOCK_PICKLIST_CHOICE_SET_PREFIX)
                ? MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE
                : MOCK_CHOICE_ELEMENT_TYPE;
            return {
                dataType:
                    guid === MOCK_STATIC_CHOICE_NUMBER
                        ? MOCK_NUMBER_FLOW_DATA_TYPE.value
                        : MOCK_STRING_FLOW_DATA_TYPE.value,
                elementType,
                guid,
                isCanvasElement: false,
                isCollection: false,
                name: guid
            };
        },
        isDevNameInStore: jest.fn()
    };
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedBy: jest.fn(() => {
            return [
                {
                    guid: 'choiceComponent1'
                },
                {
                    guid: 'choiceComponent2'
                }
            ];
        })
    };
});

it('change choice screen field by changing the 1st choice', () => {
    usebyMock.usedBy.mockReturnValueOnce([]);
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({ name: 'newChoice' });
    screen.fields = [field];

    // Change first choice
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: 'error1' },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The first choice should be changed, the rest should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBe('error1');
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[2]).toBe(field.choiceReferences[2]);
});

it('change choice screen field by changing the last choice', () => {
    usebyMock.usedBy.mockReturnValueOnce([]);
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({ name: 'newChoice' });
    screen.fields = [field];

    // Change last choice
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 2
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The last choice should be changed, the rest should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[0]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[2].choiceReference.value).toBe(newChoice.name);
});

it('defaultValue is not cleared when a choice is changed', () => {
    usebyMock.usedBy.mockReturnValueOnce([]);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
    });
    field.defaultValue = { value: 'choice1', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({ name: 'newChoice' });
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should still be present.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultValue.value).toBe('choice1');
});

it('defaultValue is cleared when a choice is changed and we have no more choices', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.defaultValue = { value: 'choice1', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: null, error: null },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toEqual('');
    expect(newScreen.fields[0].defaultValue.value).toBeNull();
});

it('add choice to radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Add new choice to the field.
    const event = {
        type: ScreenEditorEventName.ChoiceAdded,
        detail: {
            screenElement: field,
            position: 3
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // New choice is added to the end of the list and it's empty.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices + 1);
    expect(newScreen.fields[0].choiceReferences[originalNumChoices].choiceReference.value).toBe('');
});

it('Attempt to add choice to invalid position results in an error', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Badly formed event with invalid position.
    const event = {
        type: ScreenEditorEventName.ChoiceAdded,
        detail: {
            screenElement: field,
            position: 2
        }
    };

    try {
        screenReducer(screen, event, screen.fields[0]);
    } catch (e) {
        expect(e.message).toMatch('Position for new choice is invalid');
    }
});

it('Delete first choice from radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The first choice should be gone and the rest should be moved up.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices - 1);
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[2]);
});

it('Delete last choice from radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 2
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The last choice should be gone, the others should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices - 1);
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[0]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
});

it('validate all when choice based field has no choice associated with it', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: '', error: null }
    });
    screen.fields.push(field);
    const event = {
        type: VALIDATE_ALL,
        detail: {
            type: VALIDATE_ALL
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The screen should now have an error associated with the choice field.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBe(LABELS.cannotBeBlank);
});

it('validate all when choice based field has a choice associated with it', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    screen.fields.push(field);
    const event = {
        type: VALIDATE_ALL,
        detail: {
            type: VALIDATE_ALL
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The screen should now have an error associated with the choice field.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBeNull();
});
describe('Choice Visual Display Type Switching', () => {
    describe('Switching between Single Select displays', () => {
        it('Field type and extension name are updated when switching', () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                dataType: FLOW_DATA_TYPE.STRING.value,
                validation: false,
                helpText: false
            });
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.RadioButtons,
                    newDisplayType: FlowScreenFieldType.DropdownBox
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].fieldType).toEqual(FlowScreenFieldType.DropdownBox);
            expect(newScreen.fields[0].extensionName).toEqual(FlowScreenFieldType.DropdownBox);
        });
        it("Data type, default value, choice references and isRequired don't change when switching", () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                dataType: FLOW_DATA_TYPE.NUMBER.value,
                validation: false,
                helpText: false,
                isRequired: true
            });
            field.choiceReferences = [];
            const choiceReference1 = {
                choiceReference: { value: MOCK_STATIC_CHOICE_NUMBER, error: null }
            };
            const choiceReference2 = {
                choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
            };
            field.choiceReferences.push(choiceReference1);
            field.choiceReferences.push(choiceReference2);
            field.defaultValue = { value: MOCK_STATIC_CHOICE_NUMBER, error: null };
            field.defaultValueDataType = 'reference';
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.RadioButtons,
                    newDisplayType: FlowScreenFieldType.DropdownBox
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].dataType).toEqual(field.dataType);
            expect(newScreen.fields[0].defaultValue).toEqual(field.defaultValue);
            expect(newScreen.fields[0].choiceReferences[0]).toEqual(choiceReference1);
            expect(newScreen.fields[0].choiceReferences[1]).toEqual(choiceReference2);
            expect(newScreen.fields[0].isRequired).toEqual(field.isRequired);
        });
    });
    describe('Switching between Multi Select displays', () => {
        it('Field type and extension name are updated when switching', () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField(
                'multiPicklist',
                FlowScreenFieldType.MultiSelectPicklist,
                SCREEN_NO_DEF_VALUE,
                {
                    dataType: FLOW_DATA_TYPE.STRING.value,
                    validation: false,
                    helpText: false
                }
            );
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.MultiSelectPicklist,
                    newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].fieldType).toEqual(FlowScreenFieldType.MultiSelectCheckboxes);
            expect(newScreen.fields[0].extensionName).toEqual(FlowScreenFieldType.MultiSelectCheckboxes);
        });
        it("Data type, default value, choice references and isRequired don't change when switching", () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField(
                'radio1',
                FlowScreenFieldType.MultiSelectPicklist,
                SCREEN_NO_DEF_VALUE,
                {
                    dataType: FLOW_DATA_TYPE.STRING.value,
                    validation: false,
                    helpText: false,
                    isRequired: true
                }
            );
            field.choiceReferences = [];
            const choiceReference1 = {
                choiceReference: { value: 'choice1', error: null }
            };
            const choiceReference2 = {
                choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
            };
            field.choiceReferences.push(choiceReference1);
            field.choiceReferences.push(choiceReference2);
            field.defaultValue = { value: 'test', error: null };
            field.defaultValueDataType = 'reference';
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.MultiSelectPicklist,
                    newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].dataType).toEqual(field.dataType);
            expect(newScreen.fields[0].defaultValue).toEqual(field.defaultValue);
            expect(newScreen.fields[0].choiceReferences[0]).toEqual(choiceReference1);
            expect(newScreen.fields[0].choiceReferences[1]).toEqual(choiceReference2);
            expect(newScreen.fields[0].isRequired).toEqual(field.isRequired);
        });
    });
    describe('Switching from Single Select to Multi Select displays', () => {
        it('Field type and extension name are updated when switching', () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField('Radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                dataType: FLOW_DATA_TYPE.STRING.value,
                validation: false,
                helpText: false
            });
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.RadioButtons,
                    newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].fieldType).toEqual(FlowScreenFieldType.MultiSelectCheckboxes);
            expect(newScreen.fields[0].extensionName).toEqual(FlowScreenFieldType.MultiSelectCheckboxes);
        });
        describe('When data type of choice component is not text', () => {
            it('Data type of choice component changes to text', () => {
                const screen = createTestScreen(SCREEN_NAME, []);
                screen.fields = [];
                const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                    dataType: FLOW_DATA_TYPE.NUMBER.value,
                    validation: false,
                    helpText: false
                });
                screen.fields.push(field);
                const event = {
                    type: ScreenEditorEventName.ChoiceDisplayChanged,
                    detail: {
                        screenElement: field,
                        oldDisplayType: FlowScreenFieldType.RadioButtons,
                        newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                    }
                };
                const newScreen = screenReducer(screen, event, screen.fields[0]);
                expect(newScreen).toBeDefined();
                expect(newScreen.fields[0].dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
            });
            it('Choice references and default value are cleared out', () => {
                const screen = createTestScreen(SCREEN_NAME, []);
                screen.fields = [];
                const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                    dataType: FLOW_DATA_TYPE.NUMBER.value,
                    validation: false,
                    helpText: false
                });
                field.choiceReferences = [];
                const choiceReference1 = {
                    choiceReference: { value: MOCK_STATIC_CHOICE_NUMBER, error: null }
                };
                field.choiceReferences.push(choiceReference1);
                field.defaultValue = { value: MOCK_STATIC_CHOICE_NUMBER, error: null };
                field.defaultValueDataType = 'reference';
                screen.fields.push(field);
                const event = {
                    type: ScreenEditorEventName.ChoiceDisplayChanged,
                    detail: {
                        screenElement: field,
                        oldDisplayType: FlowScreenFieldType.RadioButtons,
                        newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                    }
                };
                const newScreen = screenReducer(screen, event, screen.fields[0]);
                expect(newScreen).toBeDefined();
                expect(newScreen.fields[0].defaultValue).toEqual('');
                expect(newScreen.fields[0].choiceReferences.length).toEqual(1);
                expect(newScreen.fields[0].choiceReferences[0]).toEqual({
                    choiceReference: { value: '', error: null }
                });
            });
            it("isRequired doesn't change", () => {
                const screen = createTestScreen(SCREEN_NAME, []);
                screen.fields = [];
                const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                    dataType: FLOW_DATA_TYPE.NUMBER.value,
                    validation: false,
                    helpText: false,
                    isRequired: true
                });
                field.choiceReferences = [];
                screen.fields.push(field);
                const event = {
                    type: ScreenEditorEventName.ChoiceDisplayChanged,
                    detail: {
                        screenElement: field,
                        oldDisplayType: FlowScreenFieldType.RadioButtons,
                        newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                    }
                };
                const newScreen = screenReducer(screen, event, screen.fields[0]);
                expect(newScreen).toBeDefined();
                expect(newScreen.fields[0].isRequired).toEqual(field.isRequired);
            });
        });
        describe('When data type of choice component is text', () => {
            it("Data type, default value, choice references and isRequired don't change when switching", () => {
                const screen = createTestScreen(SCREEN_NAME, []);
                screen.fields = [];
                const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                    dataType: FLOW_DATA_TYPE.STRING.value,
                    validation: false,
                    helpText: false,
                    isRequired: true
                });
                field.choiceReferences = [];
                const choiceReference1 = {
                    choiceReference: { value: 'choice1', error: null }
                };
                const choiceReference2 = {
                    choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
                };
                field.choiceReferences.push(choiceReference1);
                field.choiceReferences.push(choiceReference2);
                field.defaultValue = { value: 'test', error: null };
                field.defaultValueDataType = 'reference';
                screen.fields.push(field);
                const event = {
                    type: ScreenEditorEventName.ChoiceDisplayChanged,
                    detail: {
                        screenElement: field,
                        oldDisplayType: FlowScreenFieldType.RadioButtons,
                        newDisplayType: FlowScreenFieldType.MultiSelectCheckboxes
                    }
                };
                const newScreen = screenReducer(screen, event, screen.fields[0]);
                expect(newScreen).toBeDefined();
                expect(newScreen.fields[0].dataType).toEqual(field.dataType);
                expect(newScreen.fields[0].defaultValue).toEqual(field.defaultValue);
                expect(newScreen.fields[0].choiceReferences[0]).toEqual(choiceReference1);
                expect(newScreen.fields[0].choiceReferences[1]).toEqual(choiceReference2);
                expect(newScreen.fields[0].isRequired).toEqual(field.isRequired);
            });
        });
    });
    describe('Switching from Multi Select to Single Select displays', () => {
        it('Field type and extension name are updated when switching', () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField(
                'multiPicklist',
                FlowScreenFieldType.MultiSelectPicklist,
                SCREEN_NO_DEF_VALUE,
                {
                    dataType: FLOW_DATA_TYPE.STRING.value,
                    validation: false,
                    helpText: false
                }
            );
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.MultiSelectPicklist,
                    newDisplayType: FlowScreenFieldType.RadioButtons
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].fieldType).toEqual(FlowScreenFieldType.RadioButtons);
            expect(newScreen.fields[0].extensionName).toEqual(FlowScreenFieldType.RadioButtons);
        });

        it("Data type, default value, choice references and isRequired don't change when switching", () => {
            const screen = createTestScreen(SCREEN_NAME, []);
            screen.fields = [];
            const field = createTestScreenField(
                'multiPicklist',
                FlowScreenFieldType.MultiSelectPicklist,
                SCREEN_NO_DEF_VALUE,
                {
                    dataType: FLOW_DATA_TYPE.STRING.value,
                    validation: false,
                    helpText: false,
                    isRequired: true
                }
            );
            field.choiceReferences = [];
            const choiceReference1 = {
                choiceReference: { value: 'choice1', error: null }
            };
            const choiceReference2 = {
                choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
            };
            field.choiceReferences.push(choiceReference1);
            field.choiceReferences.push(choiceReference2);
            field.defaultValue = { value: 'test', error: null };
            field.defaultValueDataType = 'reference';
            screen.fields.push(field);
            const event = {
                type: ScreenEditorEventName.ChoiceDisplayChanged,
                detail: {
                    screenElement: field,
                    oldDisplayType: FlowScreenFieldType.MultiSelectPicklist,
                    newDisplayType: FlowScreenFieldType.RadioButtons
                }
            };
            const newScreen = screenReducer(screen, event, screen.fields[0]);
            expect(newScreen).toBeDefined();
            expect(newScreen.fields[0].dataType).toEqual(field.dataType);
            expect(newScreen.fields[0].defaultValue).toEqual(field.defaultValue);
            expect(newScreen.fields[0].choiceReferences[0]).toEqual(choiceReference1);
            expect(newScreen.fields[0].choiceReferences[1]).toEqual(choiceReference2);
            expect(newScreen.fields[0].isRequired).toEqual(field.isRequired);
        });
    });
});
describe('Two choice component using the same choice', () => {
    it('When choice is changed via one choice component, then second choice component gets updated', () => {
        const screen = createTestScreen(SCREEN_NAME, []);
        screen.fields = [];
        let field = createTestScreenField('choiceComponent1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.STRING.value,
            validation: false,
            helpText: false
        });
        field.guid = 'choiceComponent1';
        field.choiceReferences = [];
        const choiceReference = {
            choiceReference: { value: 'choice1', error: null }
        };
        field.choiceReferences.push(choiceReference);
        screen.fields.push(field);
        field = createTestScreenField('choiceComponent2', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.STRING.value,
            validation: false,
            helpText: false
        });
        field.guid = 'choiceComponent2';
        field.choiceReferences = [];
        field.choiceReferences.push(choiceReference);
        screen.fields.push(field);
        const event = {
            type: ScreenEditorEventName.ChoiceChanged,
            detail: {
                screenElement: field,
                newValue: { value: 'choice1', error: 'error' },
                position: 0
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].choiceReferences[0]).toEqual({
            choiceReference: { value: 'choice1', error: 'error' }
        });
        expect(newScreen.fields[1].choiceReferences[0]).toEqual({
            choiceReference: { value: 'choice1', error: 'error' }
        });
    });
});
