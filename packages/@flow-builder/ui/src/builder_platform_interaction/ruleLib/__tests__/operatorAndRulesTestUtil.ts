// @ts-nocheck
import { RULE_TYPES } from '../rules';

export const { ASSIGNMENT, COMPARISON } = RULE_TYPES;

export const hasArrayPopulated = property => Array.isArray(property) && property.length > 0;

export const setOfDistinctRhsParams = (givenRules, filter = rule => rule) =>
    new Set(
        givenRules
            .filter(rule => filter(rule))
            .reduce((acc, rule) => [...acc, ...rule.rhsParams], [])
            .map(rhsParam => JSON.stringify(rhsParam))
    );
