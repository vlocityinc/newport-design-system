import { renderFlow } from '../flowRenderer';
import { calculateFlowLayout } from '../layout';

import {
    getEmptyFlowContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithDecisionWithOneElementOnLeftBranchContext
} from './testUtils';

function renderAndAssert(ctx) {
    calculateFlowLayout(ctx);
    expect(renderFlow(ctx, 1)).toMatchSnapshot();
}

describe('flowRenderer', () => {
    describe('renderFlow', () => {
        it('empty flow', () => {
            renderAndAssert(getEmptyFlowContext());
        });

        it('flow with empty decision', () => {
            renderAndAssert(getFlowWithEmptyDecisionContext());
        });

        it('flow with empty decision with 3 branches', () => {
            renderAndAssert(getFlowWithEmptyDeciisionWith3BranchesContext());
        });

        it('flow with decision with one element on left branch', () => {
            renderAndAssert(getFlowWithDecisionWithOneElementOnLeftBranchContext());
        });
    });
});
