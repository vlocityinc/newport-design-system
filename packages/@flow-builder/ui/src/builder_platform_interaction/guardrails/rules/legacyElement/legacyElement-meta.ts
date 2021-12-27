// @ts-nocheck
import ruleDesc from '@salesforce/label/FlowBuilderGuardrailRules.legacyElementDescription';
import ruleTitle from '@salesforce/label/FlowBuilderGuardrailRules.legacyElementTitle';
import { ContextInfo, Meta } from 'analyzer_framework/api';
import { FLOW_CONTEXT, TEAM_NAME } from '../constants';
import * as Rule from './legacyElement';

const contextInfo = new ContextInfo(FLOW_CONTEXT);

const meta = {
    contextInfo,
    name: 'LegacyElement',
    title: ruleTitle,
    description: ruleDesc,
    owner: TEAM_NAME,
    rule: Rule.LegacyElement,
    tags: []
};

export const LegacyElement = new Meta(
    meta.contextInfo,
    meta.name,
    meta.title,
    meta.description,
    meta.owner,
    meta.rule,
    meta.tags
);
