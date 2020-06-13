enum ConnectorType {
    /* simple straight connector */
    STRAIGHT = 'straight',

    /* connector that connects a branching node to its leftmost branch */
    BRANCH_LEFT = 'branchLeft',

    /* connector that connects a branching node to its rightmost branch */
    BRANCH_RIGHT = 'branchRight',

    /* connector that connects a leftmost non-terminal branch back to its parent branch */
    MERGE_LEFT = 'mergeLeft',

    /* connector that connects a rightmost non-terminal branch back to its parent branch */
    MERGE_RIGHT = 'mergeRight',

    /* connector that loops back from the last element in the loop branch to the loop parent */
    LOOP_BACK = 'loopBack',

    /* after last loop connector */
    LOOP_AFTER_LAST = 'loopAfterLast'
}

export default ConnectorType;
