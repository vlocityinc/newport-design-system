import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { getElementByGuidFromState, getElementByDevNameFromState } from 'builder_platform_interaction/storeUtils';
import { getGlobalConstantOrSystemVariable } from 'builder_platform_interaction/systemLib';
import { retrieveResourceComplexTypeFields } from 'builder_platform_interaction/complexTypeLib';

export const referenceToVariable = (reference: string, elements: any) => {
    const complexGuid = sanitizeGuid(reference);
    return (
        getElementByGuidFromState({ elements }, complexGuid.guidOrLiteral) ||
        getElementByDevNameFromState({ elements }, complexGuid.guidOrLiteral) ||
        getGlobalConstantOrSystemVariable(complexGuid.guidOrLiteral)
    );
};

export const getFirstRecordOnlyFromVariable = (
    variable: { isCollection: boolean },
    reference: string
): boolean | undefined => {
    const complexGuid = sanitizeGuid(reference);
    if (variable !== undefined && complexGuid !== undefined) {
        if (!complexGuid.fieldNames || complexGuid.fieldNames.length === 0) {
            return !variable.isCollection;
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
            return referencedField ? !referencedField.isCollection : undefined;
        }
    }
    return undefined;
};
