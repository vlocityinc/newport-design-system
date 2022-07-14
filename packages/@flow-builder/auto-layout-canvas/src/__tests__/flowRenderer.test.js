import { renderFlow } from '../flowRenderer';
import { calculateFlowLayout } from '../layout';
import MenuType from '../MenuType';
import {
    getComplicatedFlow,
    getEmptyFlowContext,
    getFlowWhenGoingFromForEachBranch,
    getFlowWhenGoingFromParentDefaultBranchToPreviousElement,
    getFlowWhenGoingFromParentFaultBranchToPreviousElement,
    getFlowWhenGoingFromParentFirstBranchToPreviousElement,
    getFlowWhenGoingToLoopBranchHead,
    getFlowWhenGoingToPreviousElement,
    getFlowWith3levelNestedDescisionWhichEndsWithAScreen,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithDynamicNodeComponent,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyLoopContext,
    getFlowWithGoToOnTheNestedBranchElement,
    getFlowWithHighlightedAndMergedDecisionBranch,
    getFlowWithHighlightedDecisionBranch,
    getFlowWithHighlightedFaultBranch,
    getFlowWithHighlightedLoopBranches,
    getFlowWithNestedDescisionWhichEndsWithAScreen,
    getFlowWithOnlyImmediateScheduledPathContext,
    getFlowWithScheduledPathsContext,
    getFlowWithTwoFaults,
    getSimpleFlowContext
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

        it('flow with decision with highlighted branch', () => {
            renderAndAssert(getFlowWithHighlightedDecisionBranch());
        });

        it('flow with decision with highlighted and merged branch', () => {
            renderAndAssert(getFlowWithHighlightedAndMergedDecisionBranch());
        });

        it('flow with decision with one terminated branch, fault element and nested decisions', () => {
            renderAndAssert(getComplicatedFlow());
        });

        it('flow with 3 levels of nested decisions to test highlight for delete works fine', () => {
            renderAndAssert(getFlowWith3levelNestedDescisionWhichEndsWithAScreen());
        });

        it('flow with nested decisions to test highlight for delete works fine', () => {
            renderAndAssert(getFlowWithNestedDescisionWhichEndsWithAScreen());
        });

        it('flow with empty loop context', () => {
            renderAndAssert(getFlowWithEmptyLoopContext());
        });

        it('flow with highlighted loop branches', () => {
            renderAndAssert(getFlowWithHighlightedLoopBranches());
        });

        it('flow with highlighted fault branch', () => {
            renderAndAssert(getFlowWithHighlightedFaultBranch());
        });

        it('flow with two faults', () => {
            renderAndAssert(getFlowWithTwoFaults());
        });

        it('flow with dynamic node component', () => {
            renderAndAssert(getFlowWithDynamicNodeComponent());
        });
        it('flow with a GoTo connection to the previous element', () => {
            renderAndAssert(getFlowWhenGoingToPreviousElement(false, false));
        });
        it('flow with a GoTo connection to the previous element and source node menu is open', () => {
            renderAndAssert(getFlowWhenGoingToPreviousElement(true, false));
        });
        it('flow with a GoTo connection to the previous element and goTo connector menu is open', () => {
            renderAndAssert(getFlowWhenGoingToPreviousElement(false, true));
        });
        it('flow with a GoTo connection from parent first branch to the previous element', () => {
            renderAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false));
        });
        it('flow with a GoTo connection from parent first branch to the previous element and the source node menu is open', () => {
            renderAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(true, false, false));
        });

        it('flow with a GoTo connection from parent first branch to the previous element when merge connector menu is open', () => {
            renderAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, true, false));
        });

        it('flow with a GoTo connection from parent first branch to the previous element when branch head connector menu is open', () => {
            renderAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, true));
        });
        it('flow with a GoTo connection from parent default branch to the previous element', () => {
            renderAndAssert(getFlowWhenGoingFromParentDefaultBranchToPreviousElement());
        });
        it('flow with a GoTo connection from parent fault branch to the previous element', () => {
            renderAndAssert(getFlowWhenGoingFromParentFaultBranchToPreviousElement());
        });
        it('flow with a GoTo connection from the nested decision branch to the parent decision', () => {
            renderAndAssert(getFlowWithGoToOnTheNestedBranchElement());
        });
        it('flow with a GoTo connection from the loop next to the branch head element in the ForEach branch', () => {
            renderAndAssert(getFlowWhenGoingToLoopBranchHead());
        });
        it('flow with a GoTo connection from the loop for-each branch to the previous element', () => {
            renderAndAssert(getFlowWhenGoingFromForEachBranch());
        });

        it('flow with a start element that supports scheduled paths but has no children', () => {
            renderAndAssert(getFlowWithOnlyImmediateScheduledPathContext());
        });

        it('flow with a start element that supports scheduled paths and has children', () => {
            renderAndAssert(getFlowWithScheduledPathsContext());
        });

        describe('with menu', () => {
            const context = getSimpleFlowContext();
            const interactionState = {
                menuInfo: {
                    key: 'screen-guid',
                    type: MenuType.NODE
                },
                geometry: { x: 0, y: 0, w: 100, h: 100 }
            };

            it('opened', () => {
                renderAndAssert({ ...context, interactionState });
            });

            it('closing', () => {
                renderAndAssert({ ...context, interactionState });
            });
        });
    });
});
