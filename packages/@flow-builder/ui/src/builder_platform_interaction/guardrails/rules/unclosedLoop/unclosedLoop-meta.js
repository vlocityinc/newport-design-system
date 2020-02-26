import { Meta } from 'analyzer_framework/api';
import * as Rule from './unclosedLoop';
import { FLOW_CONTEXT, TEAM_NAME } from '../constants';
import ruleTitle from '@salesforce/label/FlowBuilderGuardrailRules.unclosedLoopTitle';
import ruleDesc from '@salesforce/label/FlowBuilderGuardrailRules.unclosedLoopDescription';

const meta = {
    context: FLOW_CONTEXT,
    name: 'UnclosedLoop',
    title: ruleTitle,
    description: ruleDesc,
    owner: TEAM_NAME,
    rule: Rule.UnclosedLoop,
    tags: ['Loop']
};

export const UnclosedLoop = new Meta(
    meta.context,
    meta.name,
    meta.title,
    meta.description,
    meta.owner,
    meta.rule,
    meta.tags
);
