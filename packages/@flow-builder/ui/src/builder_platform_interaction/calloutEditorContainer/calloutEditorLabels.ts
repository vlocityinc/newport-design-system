// @ts-nocheck
import actionsLoading from '@salesforce/label/FlowBuilderCalloutEditor.actionsLoading';
import noActionBodyRegularApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularApex';
import noActionBodyRegularCore from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularCore';
import noActionBodyRegularEmail from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularEmail';
import noActionBodyRegularFlow from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularFlow';
import noActionBodyRegularLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularLegacyApex';
import noActionHeadingMediumApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumApex';
import noActionHeadingMediumCore from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumCore';
import noActionHeadingMediumEmail from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumEmail';
import noActionHeadingMediumFlow from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumFlow';
import noActionHeadingMediumLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumLegacyApex';
import selectActionBodyRegular from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegular';
import selectActionBodyRegularApex from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularApex';
import selectActionBodyRegularCore from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularCore';
import selectActionBodyRegularEmail from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularEmail';
import selectActionBodyRegularExternalService from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularExternalService';
import selectActionBodyRegularFlow from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularFlow';
import selectActionBodyRegularLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularLegacyApex';
import selectActionHeadingMedium from '@salesforce/label/FlowBuilderCalloutEditor.selectActionHeadingMedium';
import selectActionHeadingMediumFlow from '@salesforce/label/FlowBuilderCalloutEditor.selectActionHeadingMediumFlow';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    actionsLoading,
    selectActionBodyRegular,
    selectActionHeadingMedium,
    [ELEMENT_TYPE.SUBFLOW]: {
        HEAD: {
            true: selectActionHeadingMediumFlow,
            false: noActionHeadingMediumFlow
        },
        BODY: {
            true: selectActionBodyRegularFlow,
            false: noActionBodyRegularFlow
        }
    },
    [ELEMENT_TYPE.ACTION_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumCore
        },
        BODY: {
            true: selectActionBodyRegularCore,
            false: noActionBodyRegularCore
        }
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumApex
        },
        BODY: {
            true: selectActionBodyRegularApex,
            false: noActionBodyRegularApex
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumLegacyApex
        },
        BODY: {
            true: selectActionBodyRegularLegacyApex,
            false: noActionBodyRegularLegacyApex
        }
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumEmail
        },
        BODY: {
            true: selectActionBodyRegularEmail,
            false: noActionBodyRegularEmail
        }
    },
    // no external service actions case is filtered out in code
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: ''
        },
        BODY: {
            true: selectActionBodyRegularExternalService,
            false: ''
        }
    }
};
