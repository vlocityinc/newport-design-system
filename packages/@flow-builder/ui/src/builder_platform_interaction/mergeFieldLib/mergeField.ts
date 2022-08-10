import { getApexPropertyWithName, getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import {
    getExtensionParamDescriptionAsComplexTypeFieldDescription,
    getInvocableActionParamDescriptionAsComplexTypeFieldDescription
} from 'builder_platform_interaction/complexTypeLib';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import { describeExtension } from 'builder_platform_interaction/flowExtensionLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { loadApexClasses } from 'builder_platform_interaction/preloadLib';
import { isLookupTraversalSupported as isLookupTraversalSupportedByProcessType } from 'builder_platform_interaction/processTypeLib';
import {
    fetchFieldsForEntity,
    fetchRelatedRecordFieldsForEntity,
    getEntityFieldWithApiName
} from 'builder_platform_interaction/sobjectLib';
import { fetchActiveOrLatestFlowOutputVariables } from 'builder_platform_interaction/subflowsLib';
import { isLookupTraversalSupported as isLookupTraversalSupportedByTriggerType } from 'builder_platform_interaction/triggerTypeLib';

/**
 * Whether or not lookup traversal is supported in this flow
 *
 * @param processType the current process type
 * @param triggerType the current trigger type
 * @returns true if lookup traversal is supported, false otherwise
 */
export const isLookupTraversalSupported = (processType: string, triggerType: UI.FlowTriggerType): boolean =>
    isLookupTraversalSupportedByProcessType(processType) && isLookupTraversalSupportedByTriggerType(triggerType);

/**
 * Resolve the reference given its identifier.
 * The identifier can be a resource/element guid ('a4451815-988d-4f17-883d-64b6ad9fab7e'), a global constant identifier ('$GlobalConstant.EmptyString'), a system variable identifier or
 * a field reference identifier ('a4451815-988d-4f17-883d-64b6ad9fab7e.Account.User.Name')
 *
 * @param identifier
 * @param isTriggeringRelatedRecord true need to get the related fields
 * @returns {Promise<Object[]|undefined>} Array with first item being the element (resource/global constant ...) and next items being the fields. Returns undefined if not a valid reference
 */
export function resolveReferenceFromIdentifier(
    identifier: string,
    isTriggeringRelatedRecord = false
): Promise<object[] | undefined> {
    const elementOrResource = getResourceByUniqueIdentifier(identifier);
    if (!elementOrResource) {
        return Promise.resolve(undefined);
    }
    if (isComplexType(elementOrResource.dataType)) {
        const { fieldNames } = sanitizeGuid(identifier);
        return resolveComplexTypeReference(elementOrResource, fieldNames, isTriggeringRelatedRecord);
    }
    return Promise.resolve([elementOrResource]);
}

/**
 * @param flowResource flow resource to be resolved
 * @param fieldNames field names array
 * @param isTriggeringRelatedRecord true need to get the related fields
 * @returns Promise with flow resource as value
 */
function resolveComplexTypeReference(
    flowResource,
    fieldNames?: string[],
    isTriggeringRelatedRecord?: boolean
): Promise<object[] | undefined> {
    if (!fieldNames || fieldNames.length === 0) {
        return Promise.resolve([flowResource]);
    }
    let fieldsPromise;
    if (flowResource.dataType === FLOW_DATA_TYPE.SOBJECT.value && !isTriggeringRelatedRecord) {
        fieldsPromise = resolveEntityFieldReference(flowResource.subtype, fieldNames);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.SOBJECT.value && isTriggeringRelatedRecord) {
        fieldsPromise = resolveRecordRelatedFieldReference(flowResource.subtype, fieldNames);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.APEX.value) {
        fieldsPromise = resolveApexPropertyReference(flowResource.subtype, fieldNames);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
        fieldsPromise = resolveLightningComponentOutputReference(flowResource.extensionName, fieldNames);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
        fieldsPromise = resolveActionOutputReference(flowResource, fieldNames);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
        fieldsPromise = resolveSubflowOutputReference(flowResource, fieldNames);
    }
    if (fieldsPromise) {
        return fieldsPromise.then((fields) => {
            return fields ? [flowResource, ...fields] : undefined;
        });
    }
    return Promise.resolve(undefined);
}

/**
 * @param clazz
 */
function fetchPropertiesForClass(clazz: string) {
    return loadApexClasses().then(() => getPropertiesForClass(clazz));
}

/**
 * @param clazz
 * @param fieldNames
 */
function resolveApexPropertyReference(clazz: string, fieldNames: string[]) {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchPropertiesForClass(clazz).then((properties) => {
        const property = getApexPropertyWithName(properties, fieldName);
        if (!property) {
            return undefined;
        }
        if (remainingFieldNames.length > 0) {
            if (property.dataType === FLOW_DATA_TYPE.APEX.value) {
                return resolveApexPropertyReference(property.subtype, remainingFieldNames).then((fields) => {
                    return fields ? [property, ...fields] : undefined;
                });
            } else if (property.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                return resolveEntityFieldReference(property.subtype, remainingFieldNames).then((fields) => {
                    return fields ? [property, ...fields] : undefined;
                });
            }
            return undefined;
        }
        return [property];
    });
}

/**
 * @param entityName Entity name
 * @param fieldNames field names array
 * @returns a promise to get the data from all the fields in the fieldNames
 */
function resolveEntityFieldReference(entityName: string, fieldNames: string[]): Promise<object[] | undefined> {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchFieldsForEntity(entityName, { disableErrorModal: true }).then((fields) =>
        resolveField(fields, fieldName, remainingFieldNames)
    );
}

/**
 * @param entityName Entity name
 * @param fieldNames field names array
 * @returns a promise to get the data from all the related fields in the fieldNames.
 */
function resolveRecordRelatedFieldReference(entityName: string, fieldNames: string[]): Promise<object[] | undefined> {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchRelatedRecordFieldsForEntity(entityName, { disableErrorModal: true }).then((fields) =>
        resolveRecordRelatedField(fields, fieldName, remainingFieldNames)
    );
}

const _isPolymorphicField = (fieldText: string): boolean => (fieldText || '').includes(':');

/**
 * @param fields list of fields
 * @param fieldName fields name
 * @param remainingFieldNames remaining field names
 * @returns a Promise or the field Definition
 */
function resolveRecordRelatedField(
    fields: Object,
    fieldName: string,
    remainingFieldNames: string[]
): Promise<object[] | undefined> | undefined | FieldDefinition[] {
    if (remainingFieldNames.length > 0 || _isPolymorphicField(fieldName)) {
        const { relationshipName, specificEntityName } = getPolymorphicRelationShipName(fieldName);
        const field = getEntityFieldWithRelationshipName(fields, relationshipName);
        if (!field) {
            return undefined;
        }
        const referenceToName = getReferenceToName(field, specificEntityName);
        if (!referenceToName) {
            return undefined;
        }
        if (_isPolymorphicField(fieldName) && remainingFieldNames.length === 0) {
            return [field];
        }
        return resolveRecordRelatedFieldReference(referenceToName, remainingFieldNames).then((remainingFields) =>
            remainingFields ? [field, ...remainingFields] : undefined
        );
    }

    const field = getEntityFieldWithApiName(fields, fieldName) || getEntityFieldWithRelationshipName(fields, fieldName);
    return field ? [field] : undefined;
}

/**
 * @param fields list of fields
 * @param fieldName fields name
 * @param remainingFieldNames remaining field names
 * @returns a Promise or the field Definition
 */
function resolveField(
    fields: Object,
    fieldName: string,
    remainingFieldNames: string[]
): Promise<object[] | undefined> | undefined | FieldDefinition[] {
    if (remainingFieldNames.length > 0) {
        const { relationshipName, specificEntityName } = getPolymorphicRelationShipName(fieldName);
        const field = getEntityFieldWithRelationshipName(fields, relationshipName);
        if (!field) {
            return undefined;
        }
        const referenceToName = getReferenceToName(field, specificEntityName);
        if (!referenceToName) {
            return undefined;
        }
        return resolveEntityFieldReference(referenceToName, remainingFieldNames).then((remainingFields) =>
            remainingFields ? [field, ...remainingFields] : undefined
        );
    }
    const field = getEntityFieldWithApiName(fields, fieldName);
    if (!field) {
        return undefined;
    }
    return [field];
}

/**
 * @param extensionName
 * @param fieldNames
 */
function resolveLightningComponentOutputReference(
    extensionName: string,
    fieldNames: string[]
): Promise<object[] | undefined> {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchExtensionOutputParameters(extensionName).then((outputParameters) => {
        const field = outputParameters[fieldName];
        if (!field) {
            return undefined;
        }
        if (remainingFieldNames.length > 0) {
            return resolveApexPropertyOrEntityFieldReference(field, remainingFieldNames).then((remainingFields) => {
                return remainingFields ? [field, ...remainingFields] : undefined;
            });
        }
        return [field];
    });
}

/**
 * @param field
 * @param fieldNames
 */
function resolveApexPropertyOrEntityFieldReference(field, fieldNames: string[]): Promise<object[] | undefined> {
    if (field.dataType === FLOW_DATA_TYPE.APEX.value) {
        return resolveApexPropertyReference(field.subtype, fieldNames);
    } else if (field.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        return resolveEntityFieldReference(field.subtype, fieldNames);
    }
    return Promise.resolve(undefined);
}

/**
 * @param root0
 * @param root0.actionType
 * @param root0.actionName
 * @param fieldNames
 */
function resolveActionOutputReference(
    { actionType, actionName }: { actionType: string; actionName: string },
    fieldNames: string[]
): Promise<object[] | undefined> {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchActionOutputParameters({ actionType, actionName }).then((outputParameters) => {
        const field = outputParameters[fieldName];
        if (!field) {
            return undefined;
        }
        if (remainingFieldNames.length > 0) {
            return resolveApexPropertyOrEntityFieldReference(field, remainingFieldNames).then((remainingFields) => {
                return remainingFields ? [field, ...remainingFields] : undefined;
            });
        }
        return [field];
    });
}

/**
 * @param root0
 * @param root0.flowName
 * @param fieldNames
 */
function resolveSubflowOutputReference(
    { flowName }: { flowName: string },
    fieldNames: string[]
): Promise<object[] | undefined> {
    if (fieldNames.length === 0) {
        return Promise.resolve([]);
    }
    const [fieldName, ...remainingFieldNames] = fieldNames;
    return fetchActiveOrLatestFlowOutputVariables(flowName).then((variables) => {
        const field = variables.find((variable) => variable.name === fieldName);
        if (!field) {
            return undefined;
        }
        if (remainingFieldNames.length > 0) {
            return resolveApexPropertyOrEntityFieldReference(field, remainingFieldNames).then((remainingFields) => {
                return remainingFields ? [field, ...remainingFields] : undefined;
            });
        }
        return [field];
    });
}

/**
 * @param field
 * @param specificEntityName
 */
export function getReferenceToName(field, specificEntityName?: string): string | undefined {
    let referenceToName;
    if (specificEntityName) {
        if (!field.isPolymorphic || !entityFieldIncludesReferenceToName(field, specificEntityName)) {
            return undefined;
        }
        referenceToName = specificEntityName;
    } else {
        if (field.isPolymorphic) {
            return undefined;
        }
        referenceToName = field.referenceToNames[0];
    }
    return referenceToName;
}

/**
 * @param entityField
 * @param referenceToName
 */
function entityFieldIncludesReferenceToName(entityField, referenceToName: string): boolean {
    referenceToName = referenceToName.toLowerCase();
    return entityField.referenceToNames.some(
        (fieldReferenceToName) => fieldReferenceToName.toLowerCase() === referenceToName
    );
}

/**
 * @param fieldName field name
 * @returns corresponding polymorphic relationship name
 */
export function getPolymorphicRelationShipName(fieldName: string): {
    relationshipName: string;
    specificEntityName?: string;
} {
    const index = fieldName.indexOf(':');
    if (index < 0) {
        return { relationshipName: fieldName };
    }
    return {
        relationshipName: fieldName.substr(0, index),
        specificEntityName: fieldName.substr(index + 1)
    };
}

/**
 * @param fields array of fields
 * @param relationshipName relationship name
 * @returns field matching the relationship name or undefined if no match
 */
export function getEntityFieldWithRelationshipName(fields, relationshipName: string) {
    relationshipName = relationshipName.toLowerCase();
    for (const apiName in fields) {
        if (fields.hasOwnProperty(apiName)) {
            const field = fields[apiName];
            if (field.isSpanningAllowed) {
                if (field.relationshipName && relationshipName === field.relationshipName.toLowerCase()) {
                    return fields[apiName];
                } else if (relationshipName === field.apiName.toLowerCase() && field.isCustom) {
                    return fields[apiName];
                }
            }
        }
    }
    return undefined;
}

/**
 * @param extension extension
 * @returns extension output parameters
 */
function getExtensionOutputParamDescriptions(extension) {
    return extension.outputParameters.reduce((acc, parameter) => {
        acc[parameter.apiName] = getExtensionParamDescriptionAsComplexTypeFieldDescription(parameter);
        return acc;
    }, {});
}

/**
 * @param extensionName
 */
function fetchExtensionOutputParameters(extensionName: string) {
    return describeExtension(extensionName, {
        disableErrorModal: true
    }).then((extension) => getExtensionOutputParamDescriptions(extension));
}

/**
 * @param details
 */
function getActionOutputParameterDescriptions(details) {
    return details.parameters
        .filter((parameter) => parameter.isOutput === true)
        .reduce((acc, parameter) => {
            acc[parameter.name] = getInvocableActionParamDescriptionAsComplexTypeFieldDescription(parameter);
            return acc;
        }, {});
}

/**
 * @param root0
 * @param root0.actionType
 * @param root0.actionName
 */
function fetchActionOutputParameters({ actionType, actionName }: { actionType: string; actionName: string }) {
    return fetchDetailsForInvocableAction(
        { actionType, actionName },
        {
            disableErrorModal: true
        }
    ).then((details) => getActionOutputParameterDescriptions(details));
}
