enum ConnectorType {
    /* simple straight connector */
    STRAIGHT = 'straight',

    /* connector that connects a branching node to its leftmost branch */
    BRANCH_LEFT = 'branch-left',

    /* connector that connects a branching node to its rightmost branch */
    BRANCH_RIGHT = 'branch-right',

    /* connector that precedes the first node of a branch */
    BRANCH_HEAD = 'branch-head',

    /* connector for an empty branch */
    BRANCH_EMPTY_HEAD = 'branch-empty-head',

    /* connector that connects a leftmost non-terminal branch back to its parent branch */
    MERGE_LEFT = 'merge-left',

    /* connector that connects a rightmost non-terminal branch back to its parent branch */
    MERGE_RIGHT = 'merge-right',

    /* connector that follows a branch's merging point */
    POST_MERGE = 'post-merge',

    /* connector that follows the last node in a branch */
    BRANCH_TAIL = 'branch-tail'
}

export default ConnectorType;
