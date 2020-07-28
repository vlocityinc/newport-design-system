import { getLayoutChildOrFault, calculateFlowLayout } from '../layout';
import { FAULT_INDEX } from '../model';
import { getBranchLayoutKey } from '../flowRendererUtils';

import {
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithEmptyLoopContext,
    getFlowWithTwoFaults,
    createFlow,
    createFlowRenderContext,
    BRANCH_ELEMENT,
    LOOP_ELEMENT,
    END_ELEMENT
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

        it('flow with loop and nested loop', () => {
            const nestedLoopElement = { ...LOOP_ELEMENT, children: [null] };
            const loopElement = { ...LOOP_ELEMENT, children: [[nestedLoopElement]] };

            const flowModel = createFlow([loopElement]);
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel }));
        });

        it('flow with loop with ended branch', () => {
            const loopElement = { ...LOOP_ELEMENT, children: [[END_ELEMENT]] };

            const flowModel = createFlow([loopElement]);
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel }));
        });

        it('flow with decision and ended middle branch', () => {
            const branchElement = { ...BRANCH_ELEMENT, children: [null, [END_ELEMENT], null] };

            const flowModel = createFlow([branchElement]);
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel }));
        });

        it('flow with empty decision with 3 branches', () => {
            calculateLayoutAndAssert(getFlowWithEmptyDeciisionWith3BranchesContext());
        });

        it('flow with decision with one element on left branch', () => {
            calculateLayoutAndAssert(getFlowWithDecisionWithOneElementOnLeftBranchContext());
        });

        it('flow with two elements with fault branches', () => {
            calculateLayoutAndAssert(getFlowWithTwoFaults());
        });
    });
});
