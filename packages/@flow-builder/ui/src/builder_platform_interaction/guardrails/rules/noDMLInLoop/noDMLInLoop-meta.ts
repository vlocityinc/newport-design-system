// @ts-nocheck
import ruleDesc from '@salesforce/label/FlowBuilderGuardrailRules.noDMLInLoopDescription';
import ruleTitle from '@salesforce/label/FlowBuilderGuardrailRules.noDMLInLoopTitle';
import { ContextInfo, Meta } from 'analyzer_framework/api';
import { FLOW_CONTEXT, TEAM_NAME } from '../constants';
import * as Rule from './noDMLInLoop';

const contextInfo = new ContextInfo(FLOW_CONTEXT);

const meta = {
    contextInfo,
    name: 'NoDMLInLoop',
    title: ruleTitle,
    description: ruleDesc,
    owner: TEAM_NAME,
    rule: Rule.NoDMLInLoop,
    tags: ['Loop']
};

export const NoDMLInLoop = new Meta(
    meta.contextInfo,
    meta.name,
    meta.title,
    meta.description,
    meta.owner,
    meta.rule,
    meta.tags
);
