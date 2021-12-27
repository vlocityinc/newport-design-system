import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createListRowItem, RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from './base/baseList';
import { createFEROV, createFEROVMetadataObject } from './ferov';

/**
 * @param assignNextValueToReference
 * @param condition
 *  @returns filter item in UI representation
 */
export function createFilterConditionItem(assignNextValueToReference, condition) {
    if (!condition) {
        throw new Error('Condition is not defined');
    }

    if (!assignNextValueToReference) {
        throw new Error('AssignNextValueToReference is not defined');
    }

    let newCondition = {};
    if (condition.hasOwnProperty('leftValueReference')) {
        const { operator, rightValue, leftValueReference } = condition;
        const ferov = createFEROV(rightValue, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        const ref = getElementByGuid(assignNextValueToReference);
        let lhsValue = leftValueReference;

        if (ref && ref.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
            // e.g. Account.AccountNumber
            lhsValue = `${ref.subtype}.${lhsValue.split('.')[1]}`;
        }

        newCondition = Object.assign({}, ferov, {
            leftHandSide: lhsValue,
            operator
        });
        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }
    return newCondition;
}

/**
 * @param assignNextValueToReference
 * @param condition
 * @returns filter item in flow metadata format
 */
export function createFilterConditionMetadataObject(assignNextValueToReference, condition) {
    if (!condition) {
        throw new Error('Condition is not defined');
    }

    if (!assignNextValueToReference) {
        throw new Error('AssignNextValueToReference is not defined');
    }

    const { leftHandSide, operator } = condition;
    const currentItemVar = getElementByGuid(assignNextValueToReference);

    let lhsValue;

    if (currentItemVar) {
        lhsValue = currentItemVar.name;

        if (
            currentItemVar.dataType === FLOW_DATA_TYPE.APEX.value ||
            currentItemVar.dataType === FLOW_DATA_TYPE.SOBJECT.value
        ) {
            lhsValue = `${currentItemVar.name}.${leftHandSide.split('.')[1]}`;
        }
    }

    const rightValue = createFEROVMetadataObject(condition, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);

    return Object.assign(
        {},
        {
            leftValueReference: lhsValue,
            rightValue,
            operator: operator === '' ? null : operator
        }
    );
}
