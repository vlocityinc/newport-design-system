import { getPolymorphicFieldSObjectName } from 'builder_platform_interaction/commonUtils';

/**
 *
 * @param field related record field
 * @param field.apiName apiName
 * @param field.isCustom is a custom field?
 * @param field.isPolymorphic is a polymorphic field?
 * @param field.isRelatedRecordChild is a related record child field?
 * @param field.sobjectName field SObject name
 * @param field.referenceToNames reference names array
 * @param inputReference corresponding inputReference value
 * @returns related record name
 */
export const getRelatedRecordName = (
    field: {
        apiName: string;
        isCustom: boolean;
        isPolymorphic: boolean;
        isRelatedRecordChild: boolean;
        sobjectName: string;
        referenceToNames: string[];
    },
    inputReference: string
) => {
    const { apiName, isCustom, isPolymorphic, isRelatedRecordChild, sobjectName, referenceToNames = [] } = field;
    let relatedRecordName;
    if (isRelatedRecordChild) {
        relatedRecordName = sobjectName;
    } else if (isCustom) {
        relatedRecordName = apiName;
    } else if (isPolymorphic) {
        relatedRecordName = getPolymorphicFieldSObjectName(inputReference);
    } else {
        relatedRecordName = referenceToNames[0];
    }
    return relatedRecordName;
};
