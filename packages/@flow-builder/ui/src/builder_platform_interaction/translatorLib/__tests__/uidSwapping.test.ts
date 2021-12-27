// @ts-nocheck
import {
    createAccountFromLiteralValues,
    getAccountSeparateFieldsWithFilters,
    lookupRecordAutomaticOutputWithFields,
    recordChoiceSet
} from 'mock/storeData';
import { step1OfStage1 } from 'mock/storeDataOrchestrator';
import { getSwapValueFunction, swapDevNamesToUids, swapSingleExpression, swapUidsForDevNames } from '../uidSwapping';

const elementUidMap = { before: { name: 'after' }, pre: { name: 'post' } };
const guidMapping = { before: 'after', pre: 'post' };

const nameToUidMapping = { before: 'AFTER', secondswap: 'secondSwapAfter' };
const guidRegex = new RegExp(
    '^({{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}}{0,1})$'
);

describe('UID Swapper', () => {
    describe('Swaps single expressions', () => {
        it('Handles basic expressions', () => {
            expect(swapSingleExpression('before', guidMapping)).toEqual('after');
        });
        it('Handles dot separated expressions', () => {
            expect(swapSingleExpression('before.second.third', guidMapping)).toEqual('after.second.third');
        });
        it('Only swaps the expressions at the begining', () => {
            expect(swapSingleExpression(' before', guidMapping)).toEqual(' before');
        });
        it('Does not swap if only the start matches', () => {
            expect(swapSingleExpression('before3', guidMapping)).toEqual('before3');
        });
    });

    describe('Swaps full values', () => {
        const swapFunction = (value) => {
            return '[' + value + ']';
        };
        const swapValueFunction = getSwapValueFunction(swapFunction, true);
        it('Swaps values inside a template', () => {
            expect(swapValueFunction(null, 'stringValue', '{!value}')).toEqual('{![value]}');
        });
        it('Swaps compound values inside a template', () => {
            expect(swapValueFunction(null, 'stringValue', '{!value.first.second}')).toEqual('{![value.first.second]}');
        });
        it('Swaps multiple values inside a template', () => {
            expect(swapValueFunction(null, 'stringValue', ' {!first.a.b} {!second.a.b}')).toEqual(
                ' {![first.a.b]} {![second.a.b]}'
            );
        });
        it('Swaps reference values', () => {
            expect(swapValueFunction(null, 'elementReference', 'value')).toEqual('[value]');
        });
    });

    describe('swapUidsForDevNames', () => {
        it('Handles complicated jumbles', () => {
            const object = {
                items: [
                    {
                        first: {
                            stringValue:
                                'All the things {!Global} {!$pre.first.before} {!before.first.before} {!pre} {! pre} {! '
                        }
                    }
                ]
            };
            swapUidsForDevNames(elementUidMap, object);

            expect(object.items[0].first.stringValue).toEqual(
                'All the things {!Global} {!$pre.first.before} {!after.first.before} {!post} {! pre} {! '
            );
        });

        it('Does not crash on nulls', () => {
            const object = {
                items: [{ first: { stringValue: null, targetReference: null } }]
            };
            swapUidsForDevNames(elementUidMap, object);
        });

        it('Does not swap uids to devname for special reference fields when disabled', () => {
            const object = { items: [{ first: { rightHandSide: 'pre.abc' } }] };
            swapUidsForDevNames(elementUidMap, object, {
                enableGuidToDevnameSwappingForReferenceFields: false
            });
            expect(object.items[0].first.rightHandSide).toEqual('pre.abc');
        });
    });

    describe('swapDevNamesToUids', () => {
        it('Handles complicated scenarios', () => {
            const object = {
                items: [
                    {
                        first: {
                            stringValue:
                                'All the things {!Global} {!$Global.first.BEFORE} {!BEFORE.first.BEFORE} {!secondSwap} {! secondSwap} {! '
                        }
                    }
                ]
            };
            swapDevNamesToUids(nameToUidMapping, object);

            expect(object.items[0].first.stringValue).toEqual(
                'All the things {!Global} {!$Global.first.BEFORE} {!AFTER.first.BEFORE} {!secondSwapAfter} {! secondSwap} {! '
            );
        });

        it('Does not crash with null data', () => {
            const object = {
                items: [{ first: { stringValue: null, targetReference: null } }]
            };
            swapDevNamesToUids(nameToUidMapping, object);
        });

        it('Does not swap devname to guid for reference fields when disabled', () => {
            const object = {
                items: [{ first: { elementReference: 'post.abc' } }]
            };
            swapDevNamesToUids(nameToUidMapping, object, {
                enableDevnameToGuidSwappingForReferenceFields: false
            });
            expect(object.items[0].first.elementReference).toEqual('post.abc');
        });

        it('Does not swap devname to guid for fields that are not reference fields', () => {
            // leftHandSide generally can be a reference but not for recordCreate inputAssignments because FlowInputFieldAssignment.field is the name of the field
            expect(createAccountFromLiteralValues.inputAssignments[0].leftHandSide).toBe('Account.Name');
            expect(lookupRecordAutomaticOutputWithFields.filters[0].leftHandSide).toBe('Account.BillingCity');
            expect(recordChoiceSet.filters[0].leftHandSide).toBe('Account.BillingCity');
            expect(recordChoiceSet.outputAssignments[0].leftHandSide).toBe('Account.Id');
            expect(getAccountSeparateFieldsWithFilters.outputAssignments[0].leftHandSide).toBe('Account.BillingCity');
        });

        it('swaps devname to guid for orchestrator stage step assignee', () => {
            const stageStepAssigneeParts = step1OfStage1.assignees[0].assignee.split('.');
            expect(guidRegex.test(stageStepAssigneeParts[0])).toBe(true);
            expect(stageStepAssigneeParts[1]).toBe('Status');
        });
    });
});
