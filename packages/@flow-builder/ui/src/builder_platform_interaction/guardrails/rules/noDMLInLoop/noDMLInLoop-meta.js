import { Meta } from 'analyzer_framework/api';
import * as Rule from './noDMLInLoop';
import { FLOW_CONTEXT, TEAM_NAME } from '../constants';
import ruleTitle from '@salesforce/label/FlowBuilderGuardrailRules.noDMLInLoopTitle';
import ruleDesc from '@salesforce/label/FlowBuilderGuardrailRules.noDMLInLoopDescription';

const meta = {
    context: FLOW_CONTEXT,
    name: 'NoDMLInLoop',
    title: ruleTitle,
    description: ruleDesc,
    owner: TEAM_NAME,
    rule: Rule.NoDMLInLoop,
    tags: ['Loop']
};

export const NoDMLInLoop = new Meta(
    meta.context,
    meta.name,
    meta.title,
    meta.description,
    meta.owner,
    meta.rule,
    meta.tags
);
