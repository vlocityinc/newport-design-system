import { getBranchLayoutKey } from '../flowRendererUtils';
import { calculateFlowLayout, getLayoutChildOrFault } from '../layout';
import { FAULT_INDEX } from '../model';
import {
    BRANCH_ELEMENT,
    createFlow,
    createFlowRenderContext,
    END_ELEMENT,
    getEmptyFlowContext,
    getFlowWhenGoingFromParentDefaultBranchToPreviousElement,
    getFlowWhenGoingFromParentFaultBranchToPreviousElement,
    getFlowWhenGoingFromParentFirstBranchToPreviousElement,
    getFlowWhenGoingToPreviousElement,
    getFlowWithDecisionWithOneElementOnLeftBranchContext,
    getFlowWithDynamicNodeComponent,
    getFlowWithEmptyDeciisionWith3BranchesContext,
    getFlowWithEmptyDecisionContext,
    getFlowWithEmptyLoopContext,
    getFlowWithOnlyImmediateScheduledPathContext,
    getFlowWithScheduledPathsContext,
    getFlowWithTwoFaults,
    LOOP_ELEMENT
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

        it('flow with loop and nested loop - loop menu opened', () => {
            const nestedLoopElement = { ...LOOP_ELEMENT, children: [null] };
            const loopElement = { ...LOOP_ELEMENT, children: [[nestedLoopElement]] };

            const flowModel = createFlow([loopElement]);
            const interactionState = {
                menuInfo: {
                    key: 'loop-guid',
                    type: 0,
                    needToPosition: false,
                    geometry: {
                        w: 300,
                        h: 221,
                        x: 0,
                        y: 0
                    }
                }
            };
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel, interactionState }));
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

        it('flow with decision with 3 branches where the middle branch is a left bottom edge', () => {
            const nestedBranch = { ...BRANCH_ELEMENT, children: [null, null, null] };
            const branchElement = { ...BRANCH_ELEMENT, children: [[END_ELEMENT], null, [nestedBranch]] };

            const flowModel = createFlow([branchElement]);
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel }));
        });

        it('flow with decision with 3 branches with decision menu opened', () => {
            const nestedBranch = { ...BRANCH_ELEMENT, children: [null, null, null] };
            const branchElement = { ...BRANCH_ELEMENT, children: [[END_ELEMENT], null, [nestedBranch]] };

            const flowModel = createFlow([branchElement]);
            const interactionState = {
                menuInfo: {
                    key: 'branch-guid',
                    type: 0,
                    needToPosition: false,
                    geometry: {
                        w: 300,
                        h: 221,
                        x: 0,
                        y: 0
                    }
                }
            };
            calculateLayoutAndAssert(createFlowRenderContext({ flowModel, interactionState }));
        });

        it('flow with dynamic node component', () => {
            calculateLayoutAndAssert(getFlowWithDynamicNodeComponent());
        });

        it('flow with a GoTo connection to the previous element', () => {
            calculateLayoutAndAssert(getFlowWhenGoingToPreviousElement(false, false));
        });

        it('flow with a GoTo connection to the previous element and source node menu is open', () => {
            calculateLayoutAndAssert(getFlowWhenGoingToPreviousElement(true, false));
        });

        it('flow with a GoTo connection to the previous element and goTo connector menu is open', () => {
            calculateLayoutAndAssert(getFlowWhenGoingToPreviousElement(false, true));
        });

        it('flow with a GoTo connection from parent first branch to the previous element', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false));
        });

        it('flow with a GoTo connection from parent first branch to the previous element and the source node menu is open', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(true, false, false));
        });

        it('flow with a GoTo connection from parent first branch to the previous element when merge connector menu is open', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, true, false));
        });

        it('flow with a GoTo connection from parent first branch to the previous element when branch head connector menu is open', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, true));
        });

        it('flow with a GoTo connection from parent default branch to the previous element', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentDefaultBranchToPreviousElement());
        });

        it('flow with a GoTo connection from parent fault branch to the previous element', () => {
            calculateLayoutAndAssert(getFlowWhenGoingFromParentFaultBranchToPreviousElement());
        });

        it('flow with scheduled paths', () => {
            calculateLayoutAndAssert(getFlowWithScheduledPathsContext());
        });

        it('flow with only the immediate scheduled path with start menu closed', () => {
            calculateLayoutAndAssert(getFlowWithOnlyImmediateScheduledPathContext());
        });

        it('flow with only the immediate scheduled path with start menu opened', () => {
            calculateLayoutAndAssert(getFlowWithOnlyImmediateScheduledPathContext(true));
        });
    });
});
