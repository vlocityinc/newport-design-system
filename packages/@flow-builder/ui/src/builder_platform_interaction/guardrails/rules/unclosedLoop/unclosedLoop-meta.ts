// @ts-nocheck
import ruleDesc from '@salesforce/label/FlowBuilderGuardrailRules.unclosedLoopDescription';
import ruleTitle from '@salesforce/label/FlowBuilderGuardrailRules.unclosedLoopTitle';
import { ContextInfo, Meta } from 'analyzer_framework/api';
import { FLOW_CONTEXT, TEAM_NAME } from '../constants';
import * as Rule from './unclosedLoop';

const contextInfo = new ContextInfo(FLOW_CONTEXT);

const meta = {
    contextInfo,
    name: 'UnclosedLoop',
    title: ruleTitle,
    description: ruleDesc,
    owner: TEAM_NAME,
    rule: Rule.UnclosedLoop,
    tags: ['Loop']
};

export const UnclosedLoop = new Meta(
    meta.contextInfo,
    meta.name,
    meta.title,
    meta.description,
    meta.owner,
    meta.rule,
    meta.tags
);
