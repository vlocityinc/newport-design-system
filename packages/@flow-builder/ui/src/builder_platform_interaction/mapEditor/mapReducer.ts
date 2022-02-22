import { COLLECTION_PROCESSOR_PROPERTIES } from 'builder_platform_interaction/collectionProcessorLib';
import { deleteItem, set, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import {
    AddRecordFieldAssignmentEvent,
    CollectionReferenceChangedEvent,
    DeleteRecordFieldAssignmentEvent,
    PrepopulateMapItemsEvent,
    PropertyChangedEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { DEFAULT_OUTPUT_TYPE, RECOMMENDATION_ASSIGNMENT } from 'builder_platform_interaction/mapEditorLib';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getRules, mapValidation } from './mapValidation';

const MAP_ITEMS = COLLECTION_PROCESSOR_PROPERTIES.MAP_ITEMS;

const updateCollectionReference = (state, event) => {
    const newCollectionValue = event.detail.value ? event.detail.value : null;
    const newCollectionError = event.detail.error ? event.detail.error : null;
    state = updateProperties(state, {
        [COLLECTION_PROCESSOR_PROPERTIES.COLLECTION_REFERENCE]: {
            value: newCollectionValue,
            error: newCollectionError ? newCollectionError : null
        }
    });
    return state;
};

const updateProperty = (state, event) => {
    if (event.detail.propertyName) {
        state = updateProperties(state, {
            [event.detail.propertyName]: {
                value: event.detail.value,
                error: event.detail.error
            }
        });
    }
    return state;
};

const newMapItem = (lhsValue: string, operator: string, rhsValue: string, rhsDataType: string) => {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: lhsValue, error: null },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: operator, error: null },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: rhsValue, error: null },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: rhsDataType,
            error: null
        },
        rowIndex: generateGuid()
    };
};

const resetMapItems = (state) => {
    // reset assignment items
    state = set(state, MAP_ITEMS, []);
    return state;
};

const addMapItem = (state, item: any) => {
    const path = [MAP_ITEMS, state[MAP_ITEMS].length];
    return set(state, path, item ? item : newMapItem('', '', '', ''));
};

const deleteMapItem = (state, event) => {
    const updatedItems = deleteItem(state[MAP_ITEMS], event.detail.index);
    return set(state, MAP_ITEMS, updatedItems);
};

const updateMapItem = (state, event) => {
    const path = [MAP_ITEMS, event.detail.index];
    const item = updateProperties(state[MAP_ITEMS][event.detail.index], event.detail.value);
    return set(state, path, item);
};

const prepopulateMapItems = (state, event) => {
    state = resetMapItems(state);
    const _mapItems: any[] = [];
    const outputObjectType = event.detail.outputObjectType;
    const outputFields = event.detail.outputFields;
    const inputObjectType = event.detail.inputObjectType;
    const inputFields = event.detail.inputFields;
    const currentItemGuid = event.detail.currentItemGuid;
    if (inputObjectType !== outputObjectType) {
        Object.keys(outputFields).forEach((key) => {
            let prepopulate = false;
            if (outputFields[key].creatable && outputFields[key].required) {
                // find this key in input fields
                if (currentItemGuid) {
                    const inputKeyFound = Object.keys(inputFields).find((inputKey) => inputKey === key);
                    if (inputKeyFound) {
                        prepopulate = true;
                        _mapItems.push(
                            newMapItem(
                                outputObjectType + '.' + key,
                                RULE_OPERATOR.ASSIGN,
                                currentItemGuid + '.' + key,
                                'reference'
                            )
                        );
                    }
                }
                if (!prepopulate) {
                    _mapItems.push(newMapItem(outputObjectType + '.' + key, RULE_OPERATOR.ASSIGN, '', ''));
                }
            }
            if (key === RECOMMENDATION_ASSIGNMENT.RECOMMENDATION_KEY && outputObjectType === DEFAULT_OUTPUT_TYPE) {
                _mapItems.push(
                    newMapItem(
                        outputObjectType + '.' + RECOMMENDATION_ASSIGNMENT.RECOMMENDATION_KEY,
                        RULE_OPERATOR.ASSIGN,
                        currentItemGuid ? currentItemGuid + '.' + RECOMMENDATION_ASSIGNMENT.ID : '',
                        'reference'
                    )
                );
            }
        });
    } else {
        _mapItems.push(newMapItem('', '', '', ''));
    }
    return set(state, COLLECTION_PROCESSOR_PROPERTIES.MAP_ITEMS, _mapItems);
};
/**
 * filter reducer function runs validation rules and returns back the updated element filter
 *
 * @param {object} state - element / sort editor node
 * @param {object} event - the event from sort editor
 * @returns {object} filter - updated filter
 */
export const mapReducer = (state, event) => {
    switch (event.type) {
        case CollectionReferenceChangedEvent.EVENT_NAME:
            return updateCollectionReference(state, event);
        case PrepopulateMapItemsEvent.EVENT_NAME:
            return prepopulateMapItems(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return updateProperty(state, event);
        case AddRecordFieldAssignmentEvent.EVENT_NAME:
            return addMapItem(state, null);
        case DeleteRecordFieldAssignmentEvent.EVENT_NAME:
            return deleteMapItem(state, event);
        case UpdateRecordFieldAssignmentEvent.EVENT_NAME:
            return updateMapItem(state, event);
        case VALIDATE_ALL:
            return mapValidation.validateAll(state, getRules());
        default:
            return null;
    }
};
