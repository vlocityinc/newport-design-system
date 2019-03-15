import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

import selectActionHeadingMedium from '@salesforce/label/FlowBuilderCalloutEditor.selectActionHeadingMedium';
import selectActionBodyRegularFlow from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularFlow';
import selectActionBodyRegularCore from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularCore';
import selectActionBodyRegularApex from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularApex';
import selectActionBodyRegularLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularLegacyApex';
import selectActionBodyRegularEmail from '@salesforce/label/FlowBuilderCalloutEditor.selectActionBodyRegularEmail';

import noActionHeadingMediumFlow from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumFlow';
import noActionHeadingMediumCore from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumCore';
import noActionHeadingMediumApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumApex';
import noActionHeadingMediumLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumLegacyApex';
import noActionHeadingMediumEmail from '@salesforce/label/FlowBuilderCalloutEditor.noActionHeadingMediumEmail';

import noActionBodyRegularFlow from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularFlow';
import noActionBodyRegularCore from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularCore';
import noActionBodyRegularApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularApex';
import noActionBodyRegularLegacyApex from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularLegacyApex';
import noActionBodyRegularEmail from '@salesforce/label/FlowBuilderCalloutEditor.noActionBodyRegularEmail';


export const LABELS = {

    [ELEMENT_TYPE.SUBFLOW]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumFlow,
        },
        BODY: {
            true: selectActionBodyRegularFlow,
            false: noActionBodyRegularFlow,
        }
    },
    [ELEMENT_TYPE.ACTION_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumCore,
        },
        BODY: {
            true: selectActionBodyRegularCore,
            false: noActionBodyRegularCore,
        }
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumApex,
        },
        BODY: {
            true: selectActionBodyRegularApex,
            false: noActionBodyRegularApex,
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumLegacyApex,
        },
        BODY: {
            true: selectActionBodyRegularLegacyApex,
            false: noActionBodyRegularLegacyApex,
        }
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumEmail,
        },
        BODY: {
            true: selectActionBodyRegularEmail,
            false: noActionBodyRegularEmail,
        }
    },
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: {
        HEAD: {
            true: selectActionHeadingMedium,
            false: noActionHeadingMediumCore,
        },
        BODY: {
            true: selectActionBodyRegularCore,
            false: noActionBodyRegularCore,
        }
    },
};