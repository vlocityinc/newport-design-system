enum ConnectorType {
    /* simple straight connector */
    STRAIGHT = 'straight',

    /* connector that connects a branching node to its leftmost branch */
    BRANCH_LEFT = 'branchLeft',

    /* connector that connects a branching node to its rightmost branch */
    BRANCH_RIGHT = 'branchRight',

    /* connector that precedes the first node of a branch */
    BRANCH_HEAD = 'branchHead',

    /* connector for an empty branch */
    BRANCH_EMPTY_HEAD = 'branchEmptyHead',

    /* connector that connects a leftmost non-terminal branch back to its parent branch */
    MERGE_LEFT = 'mergeLeft',

    /* connector that connects a rightmost non-terminal branch back to its parent branch */
    MERGE_RIGHT = 'mergeRight',

    /* connector that follows a branch's merging point */
    POST_MERGE = 'postMerge',

    /* connector that follows the last node in a branch */
    BRANCH_TAIL = 'branchTail'
}

export default ConnectorType;
