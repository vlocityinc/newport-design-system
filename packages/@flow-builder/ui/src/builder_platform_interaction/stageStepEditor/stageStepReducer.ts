import {
    deleteItem,
    getValueFromHydratedItem,
    hydrateWithErrors,
    replaceItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteConditionEvent,
    DeleteParameterItemEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateParameterItemEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { createCondition, StageStep } from 'builder_platform_interaction/elementFactory';
import {
    deleteParameterItem,
    MERGE_WITH_PARAMETERS,
    mergeWithInputOutputParameters,
    REMOVE_UNSET_PARAMETERS,
    removeUnsetParameters,
    updateParameterItem
} from 'builder_platform_interaction/calloutEditorLib';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { usedBy, UsedByElement } from 'builder_platform_interaction/usedByLib';
import { isPlainObject } from 'builder_platform_interaction/storeLib';
import { shouldCallSwapFunction } from 'builder_platform_interaction/translatorLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { LABELS } from './stageStepEditorLabels';

const itemPropertyChanged = (state: StageStep, event: CustomEvent): StageStep => {
    event.detail.guid = state.guid;
    // validateProperty(state, event);
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

const hasOutputsReference = (object, guid: UI.Guid): boolean => {
    const outputsRE = new RegExp(`${guid}.Outputs`);

    if (Array.isArray(object)) {
        const objectLength = object && object.length;
        for (let index = 0; index < objectLength; index += 1) {
            if (hasOutputsReference(object[index], guid)) {
                return true;
            }
        }
    } else if (isPlainObject(object)) {
        const keys = Object.keys(object);
        const keysLength = keys && keys.length;
        for (let index = 0; index < keysLength; index += 1) {
            const key = keys[index];
            const value = getValueFromHydratedItem(object[key]);
            if (shouldCallSwapFunction(object, key, value)) {
                if (outputsRE.test(<string>value)) {
                    return true;
                }
            } else if (typeof value !== 'number') {
                if (hasOutputsReference(value, guid)) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * Helper method to invoke the alert modal regarding an action output being referenced
 *
 * @param usedByElements - List of elements which are referencing step.Outputs
 * @param stepGuid - guid od the step whose action was changed
 * @param storeElements - Current state of elements in the store
 */
function invokeUsedByAlertModal(usedByElements: UsedByElement[], actionName: string) {
    const listSectionHeader = LABELS.changeActionAlertListSectionHeader;
    const listSectionItems = usedByElements;
    const buttonVariant = 'Brand';
    const buttonLabel = LABELS.changeActionAlertOkayButtonLabel;

    const headerTitle = format(LABELS.changeActionAlertHeaderTitle, actionName);
    const bodyTextOne = format(LABELS.changeActionAlertBodyTextLabel, actionName);

    invokeModal({
        headerData: {
            headerTitle
        },
        bodyData: {
            bodyTextOne,
            listSectionHeader,
            listSectionItems
        },
        footerData: {
            buttonOne: {
                buttonVariant,
                buttonLabel
            }
        }
    });
}

const actionChanged = (state: StageStep, event: ValueChangedEvent<InvocableAction>): StageStep => {
    if (event.detail.value) {
        let actionName: string = (<InvocableAction>event.detail.value).actionName;

        let usedElements: UsedByElement[] = usedBy([state.guid]);
        if (usedElements && usedElements.length > 0) {
            usedElements = usedElements.filter((usingElement) => {
                return hasOutputsReference(getElementByGuid(usingElement.guid), state.guid);
            });

            if (usedElements.length > 0) {
                invokeUsedByAlertModal(usedElements, actionName);
                actionName = <string>state.action!.actionName.value;

                return updateProperties(state, {
                    action: hydrateWithErrors({
                        elementType: ELEMENT_TYPE.ACTION_CALL,
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                        actionName
                    }),
                    actionName
                });
            }
        }

        return updateProperties(state, {
            action: hydrateWithErrors({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                actionName
            }),
            actionName,
            // Clear all parameters when changing action
            inputParameters: [],
            outputParameters: []
        });
    }

    return state;
};

/**
 * Updates an entry criteria
 */
const updateEntryCriteria = (state: StageStep, event: UpdateConditionEvent): StageStep => {
    const newEntryCriteria = hydrateWithErrors(createCondition(event.detail.value));

    if (state.entryConditions.length > 0) {
        return updateProperties(state, {
            entryConditions: replaceItem(state.entryConditions, newEntryCriteria, event.detail.index)
        });
    }

    return updateProperties(state, {
        entryConditions: [newEntryCriteria]
    });
};

/**
 * delete entry criteria
 */
const deleteEntryCriteria = (state: StageStep, event: DeleteConditionEvent): StageStep => {
    return updateProperties(state, {
        entryConditions: deleteItem(state.entryConditions, event.detail.index)
    });
};

/**
 * orchestratedStage reducer function runs validation rules and returns back the updated element state
 */
export const stageStepReducer = (state: StageStep, event: CustomEvent): StageStep => {
    switch (event.type) {
        case UpdateConditionEvent.EVENT_NAME:
            return updateEntryCriteria(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteEntryCriteria(state, event);
        case ValueChangedEvent.EVENT_NAME:
            return actionChanged(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return itemPropertyChanged(state, event);
        case REMOVE_UNSET_PARAMETERS:
            return removeUnsetParameters(state);
        case MERGE_WITH_PARAMETERS:
            return mergeWithInputOutputParameters(state, event.detail);
        case UpdateParameterItemEvent.EVENT_NAME:
            return updateParameterItem(state, event.detail);
        case DeleteParameterItemEvent.EVENT_NAME:
            return deleteParameterItem(state, event.detail);
        default:
            return state;
    }
};
