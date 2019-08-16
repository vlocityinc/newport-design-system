import all from '@salesforce/label/FlowBuilderProcessTypesVerticalNavigation.all';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getProcessFeatures } from 'builder_platform_interaction/systemLib';

export const PROCESS_TYPE_DEFAULT_ICON = 'utility:flow';

export const ALL_PROCESS_TYPE = { name: 'all', label: all };

export const PROCESS_TYPES_ICONS = {
    FEATURED: new Map([
        [ALL_PROCESS_TYPE.name, 'utility:flow'],
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, 'utility:magicwand'],
        [FLOW_PROCESS_TYPE.FLOW, 'utility:desktop']
    ]),
    OTHERS: new Map([
        [FLOW_PROCESS_TYPE.ACTION_CADENCE_FLOW, 'utility:activity'],
        [FLOW_PROCESS_TYPE.ACTION_PLAN, 'utility:fallback'],
        [FLOW_PROCESS_TYPE.APPOINTMENTS, 'utility:events'],
        [FLOW_PROCESS_TYPE.CHECKOUT_FLOW, 'utility:cart'],
        [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW, 'utility:contact_request'],
        [FLOW_PROCESS_TYPE.CUSTOM_EVENT, 'utility:event'],
        [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE, 'utility:phone_portrait'],
        [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB, 'utility:insert_tag_field'],
        [FLOW_PROCESS_TYPE.FORM, 'utility:edit_form'],
        [FLOW_PROCESS_TYPE.INVOCABLE_PROCESS, 'utility:process'],
        [FLOW_PROCESS_TYPE.JOURNEY_BUILDER_INTEGRATION, 'utility:builder'],
        [FLOW_PROCESS_TYPE.LOGIN_FLOW, 'utility:password'],
        [FLOW_PROCESS_TYPE.MANAGED_CONTENT_FLOW, 'utility:cases'],
        [FLOW_PROCESS_TYPE.ORCHESTRATION_FLOW, 'utility:classic_interface'],
        [FLOW_PROCESS_TYPE.SURVEY, 'utility:survey'],
        [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW, 'utility:user'],
        [
            FLOW_PROCESS_TYPE.TRANSACTION_SECURITY_FLOW,
            'utility:inspector_panel'
        ],
        [FLOW_PROCESS_TYPE.WORKFLOW, 'utility:pause'],
        [FLOW_PROCESS_TYPE.SALES_ENTRY_EXPERIENCE_FLOW, 'utility:macros']
    ])
};

export const FLOW_AUTOMATIC_OUTPUT_HANDLING = {
    SUPPORTED: 'Supported',
    UNSUPPORTED: 'Unsupported',
    REQUIRED: 'Required'
};

export const FLOW_PROCESS_TYPE_FEATURE = {
    STORE_OUTPUT_AUTOMATICALLY: 'StoreOutputAutomatically'
};

export const getProcessTypesWithIcons = (
    unfilteredProcessTypes,
    processTypesMap,
    filtering,
    postFiltering
) => {
    let filteredProcessTypes = unfilteredProcessTypes;
    if (filtering) {
        filteredProcessTypes = unfilteredProcessTypes.filter(filtering);
    }

    if (postFiltering) {
        postFiltering(filteredProcessTypes);
    }
    return filteredProcessTypes.map(processType => {
        const {
            name,
            label,
            iconName = processTypesMap.get(name) || PROCESS_TYPE_DEFAULT_ICON
        } = processType;
        return { name, label, iconName };
    });
};

export const getProcessTypeIcon = processType => {
    return (
        PROCESS_TYPES_ICONS.FEATURED.get(processType) ||
        PROCESS_TYPES_ICONS.OTHERS.get(processType) ||
        PROCESS_TYPE_DEFAULT_ICON
    );
};

/**
 * this function returns one of the value of the  FLOW_AUTOMATIC_OUTPUT_HANDLING enum.
 * Supported - The processType supports Automatic output handling and Advanced Options
 * Unsupported - The processType does not support Automatic output handling
 * Required - The ProcessType only supports Automatic output handling
 *
 * @params {String} processType
 * @return {FLOW_AUTOMATIC_OUTPUT_HANDLING} Supported, Unsupported or Required
 */
export const getProcessTypeAutomaticOutPutHandlingSupport = processType => {
    const processTypeFeatures = getProcessFeatures(processType);

    if (processTypeFeatures) {
        const isStoreOutputAutomaticallyAvailable = processTypeFeatures.find(
            processTypeFeature =>
                processTypeFeature ===
                FLOW_PROCESS_TYPE_FEATURE.STORE_OUTPUT_AUTOMATICALLY
        );
        if (isStoreOutputAutomaticallyAvailable) {
            return FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED;
        }
    }
    return FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED; // TODO: this should be removed when automaticOutputHandling will be returned by the server. (W-6136932)
};

/**
 * Determines whether the given process type supports having a configurable start element
 * @param {String} processType
 * @returns {Boolean}
 */
export const isConfigurableStartSupported = processType => {
    // TODO: Determine whether configurable start is supported through a service W-6356800
    return processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW;
};

/**
 * Determines whether the given process type supports having the new start element metadata element
 * TODO We need to remove this hardcoded check and all references to this function; see W-6462807 and W-6462716
 * @param {String} processType
 * @returns {Boolean}
 */
export const isStartMetadataSupported = processType => {
    return (
        processType !== FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE &&
        processType !== FLOW_PROCESS_TYPE.DIGITAL_FORM
    );
};
