export const flowModelWithLoop = {
    start: {
        guid: 'start',
        parent: 'root',
        childIndex: 0,
        prev: null,
        next: 'loop',
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
    },
    loop: {
        guid: 'loop',
        prev: 'start',
        incomingGoTo: [],
        isTerminal: true,
        next: 'end',
        children: [null],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
    },
    end: {
        guid: 'end',
        prev: 'loop',
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
    },
    root: {
        guid: 'root',
        prev: null,
        next: null,
        children: ['start'],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
    }
};

export const flowModelWithScreenGoTo = {
    start: {
        guid: 'start',
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: 's1'
    },
    s1: {
        guid: 's1',
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        incomingGoTo: ['s2'],
        prev: 'start',
        next: 's2'
    },
    s2: {
        guid: 's2',
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        incomingGoTo: [],
        prev: 's1',
        next: 's1'
    },
    root: {
        guid: 'root',
        prev: null,
        next: null,
        children: ['start']
    }
};
