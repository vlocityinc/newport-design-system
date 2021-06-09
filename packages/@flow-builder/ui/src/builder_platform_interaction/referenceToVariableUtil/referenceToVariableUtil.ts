import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { getElementByGuidFromState, getElementByDevNameFromState } from 'builder_platform_interaction/storeUtils';
import { getGlobalConstantOrSystemVariableFromState } from 'builder_platform_interaction/systemLib';
import { retrieveResourceComplexTypeFields } from 'builder_platform_interaction/complexTypeLib';

const referenceToVariable = (reference: string, elements: any) => {
    const complexGuid = sanitizeGuid(reference);
    return (
        getElementByGuidFromState({ elements }, complexGuid.guidOrLiteral) ||
        getElementByDevNameFromState({ elements }, complexGuid.guidOrLiteral) ||
        getGlobalConstantOrSystemVariableFromState({ elements }, complexGuid.guidOrLiteral)
    );
};

/**
 * Looks for the corresponding variable or field corresponding to the given reference
 *
 * @param reference a reference such as variableApiName, variableGuid, variableApiName.field1.field2, variableGuid.field1
 * @param elements elements in which we're looking for the variable or field
 * @returns the corresponding variable or field if found, undefined otherwise
 */
export const getVariableOrField = (reference: string, elements: any): any => {
    const complexGuid = sanitizeGuid(reference);
    const variable = referenceToVariable(reference, elements);
    if (variable !== undefined && complexGuid !== undefined) {
        if (!complexGuid.fieldNames || complexGuid.fieldNames.length === 0) {
            return variable;
        }
        let fields = retrieveResourceComplexTypeFields(variable);
        if (fields) {
            let referencedField: { isCollection: boolean };
            if (complexGuid.fieldNames.length === 1) {
                referencedField = fields[complexGuid.fieldNames[0]];
            } else {
                const complexGuidPreviousFields = complexGuid.fieldNames.slice(0, complexGuid.fieldNames.length - 1);
                for (let i = 0; i < complexGuidPreviousFields.length; i++) {
                    if (fields && fields[complexGuidPreviousFields[i]]) {
                        fields = retrieveResourceComplexTypeFields(fields[complexGuidPreviousFields[i]]);
                    } else {
                        break;
                    }
                }
                referencedField = fields
                    ? fields[complexGuid.fieldNames[complexGuid.fieldNames.length - 1]]
                    : undefined;
            }
            return referencedField;
        }
    }
    return undefined;
};
