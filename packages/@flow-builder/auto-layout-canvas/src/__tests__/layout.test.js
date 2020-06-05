import { getBranchLayoutKey, getLayoutChildOrFault, calculateFlowLayout } from '../layout';
import { FAULT_INDEX } from '../model';
import {
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithEmptyLoopContext
} from './testUtils';

function calculateLayoutAndAssert(ctx) {
    calculateFlowLayout(ctx);
    expect(ctx.nodeLayoutMap).toMatchSnapshot();
}

describe('layout', () => {
    describe('getBranchLayoutKey', () => {
        it('creates a key', () => {
            expect(getBranchLayoutKey('guid', 2)).toEqual('guid:2');
        });
    });

    describe('getLayoutChildOrFault', () => {
        const parentNodeModel = {
            children: ['child-guid0', 'child-guid1'],
            fault: 'fault-guid'
        };

        it('returns a child guid when non-negative', () => {
            expect(getLayoutChildOrFault(parentNodeModel, 1)).toEqual('child-guid1');
        });

        it('returns the fault when -1', () => {
            expect(getLayoutChildOrFault(parentNodeModel, FAULT_INDEX)).toEqual('fault-guid');
        });
    });

    describe('calculateLayout', () => {
        it('empty flow', () => {
            calculateLayoutAndAssert(getEmptyFlowContext());
        });

        it('flow with empty decision', () => {
            calculateLayoutAndAssert(getFlowWithEmptyDecisionContext());
        });

        it('flow with empty loop', () => {
            calculateLayoutAndAssert(getFlowWithEmptyLoopContext());
        });

        it('flow with empty decision with 3 branches', () => {
            calculateLayoutAndAssert(getFlowWithEmptyDeciisionWith3BranchesContext());
        });

        it('flow with decision with one element on left branch', () => {
            calculateLayoutAndAssert(getFlowWithDecisionWithOneElementOnLeftBranchContext());
        });
    });
});
