import {
    getApexClasses,
    getApexPropertyWithName,
    getPropertiesForClass
} from 'builder_platform_interaction/apexTypeLib';
import { splitStringBySeparator } from 'builder_platform_interaction/commonUtils';
import {
    getExtensionParamDescriptionAsComplexTypeFieldDescription,
    getInvocableActionParamDescriptionAsComplexTypeFieldDescription
} from 'builder_platform_interaction/complexTypeLib';
import { FLOW_DATA_TYPE, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getScreenElement, isElementAllowed } from 'builder_platform_interaction/expressionUtils';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { elementToParam, getDataType } from 'builder_platform_interaction/ruleLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getActiveOrLatestFlowOutputVariables } from 'builder_platform_interaction/subflowsLib';
import {
    getGlobalConstantOrSystemVariable,
    getGlobalVariable,
    GLOBAL_CONSTANT_PREFIX
} from 'builder_platform_interaction/systemLib';
import {
    SYSTEM_VARIABLE_CLIENT_PREFIX,
    SYSTEM_VARIABLE_ORCHESTRATION_PREFIX,
    SYSTEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/systemVariableConstantsLib';
import { getEntityFieldWithRelationshipName, getPolymorphicRelationShipName, getReferenceToName } from './mergeField';
import * as validationErrors from './mergeFieldValidationErrors';
import { ValidationError } from './mergeFieldValidationErrors';

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';

const MERGEFIELD_REGEX = /\{!(((\$\w+)(\.[A-Za-z0-9_:]+)+)|(\w+|\$(Record|Record__Prior))(\.[A-Za-z0-9_:]+)*)\}/g;

const MAXIMUM_NUMBER_OF_LEVELS = 10;

/**
 * Validate merge fields.
 *
 * Validation is best-effort only : no false negatives but there can be false positives. This is because some validations
 * are not yet supported and because validateMergeField is synchronous which means data (field descriptions ...) must
 * already have been retrieved from server for validation.
 *
 */
export class MergeFieldsValidation {
    allowGlobalConstants = true;
    allowCollectionVariables = false;
    allowSObjectFieldsTraversal = true;
    allowApexTypeFieldsTraversal = true;
    ignoreGlobalVariables = false;
    includeEntityRelatedRecordFields = false;

    // The allowed param types for merge field based on rule service.
    // If present, this is used to validate the element merge field.
    allowedParamTypes: any = null;

    /**
     * Validate a merge field
     *
     * @param {string} mergeField the merge field (ex : {!variable1.Name})
     * @returns {ValidationError[]} The validation errors
     */
    validateMergeField(mergeField: string): ValidationError[] {
        try {
            const match = MERGEFIELD_REGEX.exec(mergeField);
            if (match === null || match[0] !== mergeField) {
                return [validationErrors.invalidMergeField(mergeField, 0, mergeField.length - 1)];
            }
            return this._validateMergeFieldReferenceValue(match[1], 2);
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

    /**
     * Checks if input text is text with merge field(s).
     * ex: {!variable1.Name} - false
     *     test input - false
     *     Hi {!variable1.Name} - true
     *
     * @param {string} text
     *          input text
     * @returns {boolean} true if input is text with merge field
     */
    static isTextWithMergeFields(text: string) {
        if (typeof text !== 'string') {
            return false;
        }

        try {
            const match = MERGEFIELD_REGEX.exec(text);
            return match !== null && match[0] !== text;
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

    _getReferenceValue(mergeFieldReference: string) {
        return mergeFieldReference.substring(
            MERGE_FIELD_START_CHARS.length,
            mergeFieldReference.length - MERGE_FIELD_END_CHARS.length
        );
    }

    _isGlobalConstantMergeField(mergeFieldReferenceValue: string) {
        return mergeFieldReferenceValue.startsWith(GLOBAL_CONSTANT_PREFIX);
    }

    _isSystemVariableFlowMergeField(mergeFieldReferenceValue: string) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_PREFIX + '.');
    }

    _isSystemVariableClientMergeField(mergeFieldReferenceValue: string) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_CLIENT_PREFIX + '.');
    }

    _isSystemVariableRecordMergeField(mergeFieldReferenceValue: string) {
        return /^\$Record/i.test(mergeFieldReferenceValue);
    }

    _isSystemVariableOrchestrationMergeField(mergeFieldReferenceValue: string) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_ORCHESTRATION_PREFIX + '.');
    }

    _isSystemVariableRecordPriorMergeField(mergeFieldReferenceValue: string) {
        return /^\$Record__Prior/i.test(mergeFieldReferenceValue);
    }

    GLOBAL_VARIABLE_MERGE_FIELD_FUNCTIONS = [
        this._isGlobalConstantMergeField,
        this._isSystemVariableFlowMergeField,
        this._isSystemVariableClientMergeField,
        this._isSystemVariableRecordMergeField,
        this._isSystemVariableRecordPriorMergeField,
        this._isSystemVariableOrchestrationMergeField
    ];

    _isGlobalVariableMergeField(mergeFieldReferenceValue: string) {
        return (
            mergeFieldReferenceValue.startsWith('$') &&
            !this.GLOBAL_VARIABLE_MERGE_FIELD_FUNCTIONS.some((testFn) => {
                return testFn(mergeFieldReferenceValue);
            })
        );
    }

    _validateMergeFieldReferenceValue(mergeFieldReferenceValue: string, index: number): ValidationError[] {
        const hasDot = mergeFieldReferenceValue.indexOf('.') !== -1;
        if (this._isGlobalConstantMergeField(mergeFieldReferenceValue)) {
            return this._validateGlobalConstant(mergeFieldReferenceValue, index);
        }
        if (this._isGlobalVariableMergeField(mergeFieldReferenceValue)) {
            if (!this.ignoreGlobalVariables) {
                return this._validateGlobalVariable(mergeFieldReferenceValue, index);
            }
            return [];
        }
        if (
            this._isSystemVariableFlowMergeField(mergeFieldReferenceValue) ||
            this._isSystemVariableOrchestrationMergeField(mergeFieldReferenceValue) ||
            this._isSystemVariableClientMergeField(mergeFieldReferenceValue) ||
            (this._isSystemVariableRecordPriorMergeField(mergeFieldReferenceValue) && !hasDot)
        ) {
            return this._validateSystemVariable(mergeFieldReferenceValue, index);
        }
        if (hasDot) {
            return this._validateComplexTypeFieldMergeField(mergeFieldReferenceValue, index);
        }
        return this._validateElementMergeField(mergeFieldReferenceValue, index);
    }

    _validateGlobalConstant(mergeFieldReferenceValue: string, index: number) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const globalConstant = getGlobalConstantOrSystemVariable(mergeFieldReferenceValue);
        if (!this.allowGlobalConstants) {
            return [validationErrors.globalConstantsNotAllowed(index, endIndex)];
        }
        if (!globalConstant) {
            return [
                validationErrors.invalidGlobalConstant(
                    MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS,
                    index,
                    endIndex
                )
            ];
        }
        if (!this._isElementValidForAllowedParamTypes(globalConstant)) {
            return [validationErrors.invalidDataType(index, endIndex)];
        }
        return [];
    }

    _validateSystemVariable(mergeFieldReferenceValue: string, index: number) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const systemVariable = getGlobalConstantOrSystemVariable(mergeFieldReferenceValue);
        if (!systemVariable) {
            return [
                validationErrors.invalidGlobalVariable(
                    MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS,
                    index,
                    endIndex
                )
            ];
        }
        if (!this._isElementValidForAllowedParamTypes(systemVariable)) {
            return [validationErrors.invalidDataType(index, endIndex)];
        }
        return [];
    }

    _validateGlobalVariable(mergeFieldReferenceValue: string, index: number) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        // TODO W-7881499 Once global variables with child types are returned in
        // menu data, remove this special handling
        if (!mergeFieldReferenceValue.startsWith('$SmartDataDiscovery')) {
            const globalVariable = getGlobalVariable(mergeFieldReferenceValue);
            if (!globalVariable) {
                return [
                    validationErrors.invalidGlobalVariable(
                        MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS,
                        index,
                        endIndex
                    )
                ];
            }
            if (!this._isElementValidForAllowedParamTypes(globalVariable)) {
                return [validationErrors.invalidDataType(index, endIndex)];
            }
        }
        return [];
    }

    _isElementValidForAllowedParamTypes(element) {
        if (!this.allowedParamTypes) {
            return true;
        }
        return isElementAllowed(this.allowedParamTypes, elementToParam(element));
    }

    _validateElementMergeField(mergeFieldReferenceValue: string, index: number) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;

        const element = this._getElement(mergeFieldReferenceValue);

        if (!element) {
            return [validationErrors.unknownResource(mergeFieldReferenceValue, index, endIndex)];
        }

        if (this.allowedParamTypes) {
            if (!this._isElementValidForAllowedParamTypes(element)) {
                return [validationErrors.invalidDataType(index, endIndex)];
            }
        } else {
            const elementType = this._getElementType(element);
            if (elementType.dataType === null || (!this.allowCollectionVariables && elementType.isCollection)) {
                return [validationErrors.resourceCannotBeUsedAsMergeField(mergeFieldReferenceValue, index, endIndex)];
            }
        }
        return [];
    }

    _getUncommittedElement(screen, referenceValue: string) {
        if (!screen || !referenceValue) {
            return null;
        }
        if (screen.fields) {
            const fields = screen.fields;
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (field.name && field.name.value === referenceValue) {
                    return field;
                }
                const foundField = this._getUncommittedElement(field, referenceValue);
                if (foundField) {
                    return foundField;
                }
            }
        }
        return null;
    }

    _getElementType(element) {
        let dataType: string | null = getDataType(element) || null;
        const isCollection: boolean = element.isCollection || false;
        const subtype: string = element.subtype;
        if (element.elementType === ELEMENT_TYPE.STAGE) {
            dataType = FLOW_DATA_TYPE.STRING.value;
        }
        return {
            dataType,
            isCollection,
            subtype
        };
    }

    _validateApexMergeField(
        apexClassName: string,
        fieldNames: string[],
        index: number,
        endIndex: number
    ): { field?; error?: ValidationError } {
        const [fieldName, ...remainingFieldNames] = fieldNames;
        if (this.allowApexTypeFieldsTraversal === false && fieldNames.length > 1) {
            return { error: validationErrors.mergeFieldNotAllowed(index, endIndex) };
        }
        if (getApexClasses() === null) {
            // apex classes not yet set
            return {
                field: undefined // we don't know if it is valid or not
            };
        }
        const properties = getPropertiesForClass(apexClassName);
        const property = properties && getApexPropertyWithName(properties, fieldName);
        if (!property) {
            return {
                error: validationErrors.unknownRecordField(apexClassName, fieldName, index, endIndex)
            };
        }
        if (remainingFieldNames.length > 0) {
            if (property.dataType === FLOW_DATA_TYPE.APEX.value) {
                return this._validateApexMergeField(property.subtype, remainingFieldNames, index, endIndex);
            } else if (property.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                return this._validateMergeField(
                    this.includeEntityRelatedRecordFields
                        ? sobjectLib.getRelatedRecordFieldsForEntity
                        : sobjectLib.getFieldsForEntity,
                    property.subtype,
                    remainingFieldNames,
                    index,
                    endIndex
                );
            }
            return {
                error: validationErrors.unknownRecordField(apexClassName, fieldName, index, endIndex)
            };
        }
        return { field: property };
    }

    _validateMergeField(
        getEntity: Function,
        entityName: string,
        fieldNames: string[],
        index: number,
        endIndex: number
    ): { field?; error?: ValidationError } {
        const [fieldName, ...remainingFieldNames] = fieldNames;
        let field;
        if (this.allowSObjectFieldsTraversal === false && fieldNames.length > 1) {
            return {
                error: validationErrors.mergeFieldNotAllowed(index, endIndex)
            };
        }
        const fields = getEntity(entityName);

        if (!fields) {
            // entity not cached or no entity with this name ...
            return {
                field: undefined // we don't know if it is valid or not
            };
        }
        if (
            remainingFieldNames.length > 0 ||
            (this.includeEntityRelatedRecordFields && this._isPolymorphicField(fieldName))
        ) {
            const { relationshipName, specificEntityName } = getPolymorphicRelationShipName(fieldName);
            field = getEntityFieldWithRelationshipName(fields, relationshipName);
            if (!field) {
                return {
                    error: validationErrors.unknownRecordField(entityName, relationshipName, index, endIndex)
                };
            }
            const referenceToName = getReferenceToName(field, specificEntityName);
            if (!referenceToName) {
                return {
                    error: validationErrors.invalidPolymorphicRecordFieldReference(
                        entityName,
                        fieldName,
                        index,
                        endIndex
                    )
                };
            }
            if (this.includeEntityRelatedRecordFields) {
                return { field };
            }
            return this._validateMergeField(getEntity, referenceToName, remainingFieldNames, index, endIndex);
        }
        field = sobjectLib.getEntityFieldWithApiName(fields, fieldName);

        if (!field) {
            field = getEntityFieldWithRelationshipName(fields, fieldName);
        }

        if (!field) {
            return {
                error: validationErrors.unknownRecordField(entityName, fieldName, index, endIndex)
            };
        }
        return { field };
    }

    _isPolymorphicField = (fieldText: string): boolean => (fieldText || '').includes(':');

    _validateApexOrSObjectMergeField(
        currentObjectName: string,
        currentFieldName: string,
        dataType: string,
        subtype: string,
        fieldNames: string[],
        index: number,
        endIndex: number
    ) {
        if (dataType === FLOW_DATA_TYPE.APEX.value) {
            return this._validateApexMergeField(subtype, fieldNames, index, endIndex);
        } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
            return this._validateMergeField(
                this.includeEntityRelatedRecordFields
                    ? sobjectLib.getRelatedRecordFieldsForEntity
                    : sobjectLib.getFieldsForEntity,
                subtype,
                fieldNames,
                index,
                endIndex
            );
        }
        return {
            error: validationErrors.unknownRecordField(currentObjectName, currentFieldName, index, endIndex)
        };
    }

    _validateLightningComponentOutputMergeField(
        element,
        fieldNames: string[],
        index: number,
        endIndex: number
    ): { field?; error?: ValidationError } {
        const [fieldName, ...remainingFieldNames] = fieldNames;
        const extension = getCachedExtension(element.extensionName, element.dynamicTypeMappings);
        if (!extension) {
            // this lib is synchronous, we check the field only if already cached.
            return {
                field: undefined // we don't know if it is valid or not
            };
        }
        const parameter = this._getOutputParameterForExtension(extension, fieldName);
        if (!parameter) {
            return {
                error: validationErrors.unknownRecordField(element.extensionName, fieldName, index, endIndex)
            };
        }
        if (remainingFieldNames.length > 0) {
            return this._validateApexOrSObjectMergeField(
                element.extensionName,
                fieldName,
                parameter.dataType,
                parameter.subtype,
                remainingFieldNames,
                index,
                endIndex
            );
        }
        return { field: parameter };
    }

    _validateSubflowOutputMergeField(
        element,
        fieldNames: string[],
        index: number,
        endIndex: number
    ): { field?; error?: ValidationError } {
        const [fieldName, ...remainingFieldNames] = fieldNames;
        const outputVariables = getActiveOrLatestFlowOutputVariables(element.flowName);
        if (!outputVariables) {
            // this lib is synchronous, we check the field only if already cached.
            return {
                field: undefined // we don't know if it is valid or not
            };
        }
        const outputVariable = this._getSubflowOutputVariable(outputVariables, fieldName);
        if (!outputVariable) {
            return {
                error: validationErrors.unknownRecordField(element.flowName, fieldName, index, endIndex)
            };
        }
        if (remainingFieldNames.length > 0) {
            return this._validateApexOrSObjectMergeField(
                element.flowName,
                fieldName,
                outputVariable.dataType,
                outputVariable.subtype,
                remainingFieldNames,
                index,
                endIndex
            );
        }
        return { field: outputVariable };
    }

    _validateActionOutputMergeField(
        element,
        fieldNames: string[],
        index: number,
        endIndex: number
    ): { field?; error?: ValidationError } {
        const [fieldName, ...remainingFieldNames] = fieldNames;
        const parameters = getParametersForInvocableAction(element);
        if (!parameters) {
            // this lib is synchronous, we check the field only if already cached.
            return {
                field: undefined // we don't know if it is valid or not
            };
        }
        const parameter = this._getActionOutputParameter(parameters, fieldName);
        const objectName = `${element.actionType}-${element.actionName}`;
        if (!parameter) {
            return {
                error: validationErrors.unknownRecordField(objectName, fieldName, index, endIndex)
            };
        }
        if (remainingFieldNames.length > 0) {
            return this._validateApexOrSObjectMergeField(
                objectName,
                fieldName,
                parameter.dataType,
                parameter.subtype,
                remainingFieldNames,
                index,
                endIndex
            );
        }
        return { field: parameter };
    }

    // fetch element from store using the devName
    // if element is not present in store get element from screen variable as it may have been
    // just created and not yet committed to store (user hasn't pressed 'Done' yet)
    _getElement(elementName: string) {
        return getElementByDevName(elementName) || this._getUncommittedElement(getScreenElement(), elementName);
    }

    _getResource(resourceName: string) {
        return this._getElement(resourceName) || getGlobalConstantOrSystemVariable(resourceName);
    }

    _validateComplexTypeFieldMergeField(mergeFieldReferenceValue: string, index: number) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const parts = splitStringBySeparator(mergeFieldReferenceValue);
        const [resourceName, ...fieldNames] = parts;

        if (fieldNames.length >= MAXIMUM_NUMBER_OF_LEVELS) {
            return [validationErrors.maximumNumberOfLevelsReached(index, endIndex)];
        }

        const resource = this._getResource(resourceName);

        if (!resource) {
            return [validationErrors.unknownResource(resourceName, index, endIndex)];
        }
        if (!resource.dataType) {
            return [
                validationErrors.invalidMergeField(
                    MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS,
                    index,
                    endIndex
                )
            ];
        }
        if (!isComplexType(resource.dataType) || (!this.allowCollectionVariables && resource.isCollection)) {
            return [validationErrors.resourceCannotBeUsedAsMergeField(mergeFieldReferenceValue, index, endIndex)];
        }
        let field;
        if (resource.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
            const { field: sobjectField, error } = this._validateMergeField(
                this.includeEntityRelatedRecordFields
                    ? sobjectLib.getRelatedRecordFieldsForEntity
                    : sobjectLib.getFieldsForEntity,
                resource.subtype,
                fieldNames,
                index,
                endIndex
            );
            if (error) {
                return [error];
            }
            field = sobjectField;
        } else if (resource.dataType === FLOW_DATA_TYPE.APEX.value) {
            const { field: apexField, error } = this._validateApexMergeField(
                resource.subtype,
                fieldNames,
                index,
                endIndex
            );
            if (error) {
                return [error];
            }
            field = apexField;
        } else if (resource.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
            const { field: lightningComponentField, error } = this._validateLightningComponentOutputMergeField(
                resource,
                fieldNames,
                index,
                endIndex
            );
            if (error) {
                return [error];
            }
            field = lightningComponentField;
        } else if (resource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
            const { field: actionField, error } = this._validateActionOutputMergeField(
                resource,
                fieldNames,
                index,
                endIndex
            );
            if (error) {
                return [error];
            }
            field = actionField;
        } else if (resource.dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
            const { field: subflowField, error } = this._validateSubflowOutputMergeField(
                resource,
                fieldNames,
                index,
                endIndex
            );
            if (error) {
                return [error];
            }
            field = subflowField;
        }
        if (field && !this._isElementValidForAllowedParamTypes(field)) {
            return [validationErrors.invalidDataType(index, endIndex)];
        }
        return [];
    }

    _getOutputParameterForExtension(extension, parameterName: string) {
        parameterName = parameterName.toLowerCase();
        const outputParam = extension.outputParameters.find((param) => parameterName === param.apiName.toLowerCase());
        return outputParam && getExtensionParamDescriptionAsComplexTypeFieldDescription(outputParam);
    }

    _getActionOutputParameter(parameters, parameterName: string) {
        parameterName = parameterName.toLowerCase();
        const outputParam = parameters.find(
            (param) => param.isOutput === true && parameterName === param.name.toLowerCase()
        );
        return outputParam && getInvocableActionParamDescriptionAsComplexTypeFieldDescription(outputParam);
    }

    _getSubflowOutputVariable(outputVariables, variableName: string) {
        variableName = variableName.toLowerCase();
        return outputVariables.find((variable) => variableName === variable.name.toLowerCase());
    }
}

/**
 * Validate text with merge fields
 * textWithMergeFields text with merge fields (ex : '{!variable1.Name} == {!variable2.Name}')
 *
 * @param textWithMergeFields
 * @param root0
 * @param root0.allowGlobalConstants
 * @param root0.allowCollectionVariables
 * @param root0.ignoreGlobalVariables
 * @returns {ValidationError[]} The validation errors
 */
export function validateTextWithMergeFields(
    textWithMergeFields: string,
    { allowGlobalConstants = true, allowCollectionVariables = false, ignoreGlobalVariables = false } = {}
) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowCollectionVariables = allowCollectionVariables;
    validation.ignoreGlobalVariables = ignoreGlobalVariables;

    const results: ValidationError[] = [];
    let match: RegExpExecArray | null;
    try {
        while ((match = MERGEFIELD_REGEX.exec(textWithMergeFields)) !== null) {
            results.push(...validation._validateMergeFieldReferenceValue(match[1], match.index + 2));
        }
        return results;
    } finally {
        MERGEFIELD_REGEX.lastIndex = 0;
    }
}

/**
 * @param mergeField
 * @param root0
 * @param root0.allowGlobalConstants
 * @param root0.allowedParamTypes
 * @param root0.allowCollectionVariables
 * @param root0.allowSObjectFieldsTraversal
 * @param root0.allowApexTypeFieldsTraversal
 * @param root0.includeEntityRelatedRecordFields - true include entity related fields
 * @returns {ValidationError[]} all validation errors
 */
export function validateMergeField(
    mergeField: string,
    {
        allowGlobalConstants = true,
        allowedParamTypes = null,
        allowCollectionVariables = false,
        allowSObjectFieldsTraversal = true,
        allowApexTypeFieldsTraversal = true,
        includeEntityRelatedRecordFields = false
    }: {
        allowGlobalConstants?: boolean;
        allowedParamTypes?: any;
        allowCollectionVariables?: boolean;
        allowSObjectFieldsTraversal?: boolean;
        allowApexTypeFieldsTraversal?: boolean;
        includeEntityRelatedRecordFields?: boolean;
    } = {}
) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowedParamTypes = allowedParamTypes;
    validation.allowCollectionVariables = allowCollectionVariables;
    validation.allowSObjectFieldsTraversal = allowSObjectFieldsTraversal;
    validation.allowApexTypeFieldsTraversal = allowApexTypeFieldsTraversal;
    validation.includeEntityRelatedRecordFields = includeEntityRelatedRecordFields;
    return validation.validateMergeField(mergeField);
}

/**
 * @param text
 */
export function isTextWithMergeFields(text: string) {
    return MergeFieldsValidation.isTextWithMergeFields(text);
}
