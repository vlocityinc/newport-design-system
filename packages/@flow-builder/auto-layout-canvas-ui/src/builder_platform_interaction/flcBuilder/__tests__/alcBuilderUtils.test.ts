import { getFocusPath } from '../alcBuilderUtils';

const flowModel = {
    startGuid: {
        guid: 'startGuid',
        label: 'start node',
        elementType: 'START_ELEMENT',
        prev: null,
        next: 'branch1',
        parent: 'root',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    },
    branch1: {
        guid: 'branch1',
        label: 'branch node',
        elementType: 'DECISION',
        prev: 'startGuid',
        next: 'end',
        children: ['branchHead1', 'branchHead2'],
        maxConnections: 2,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    },
    branchHead1: {
        guid: 'branchHead1',
        label: 'Left branch head element',
        elementType: 'SCREEN',
        prev: null,
        next: null,
        parent: 'branch1',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    },
    branchHead2: {
        guid: 'branchHead2',
        label: 'Right branch head element',
        elementType: 'DECISION',
        prev: null,
        next: null,
        parent: 'branch1',
        childIndex: 1,
        children: ['screen1', null],
        maxConnections: 2,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    },
    screen1: {
        guid: 'screen1',
        label: 'Left branch screen',
        elementType: 'SCREEN',
        prev: null,
        next: null,
        parent: 'branchHead2',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    },
    end: {
        guid: 'end',
        label: 'end node',
        elementType: 'END_ELEMENT',
        prev: 'branch1',
        next: null,
        maxConnections: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null
    }
};

describe('ALC Builder Utils tests', () => {
    describe('getFocusPath tests', () => {
        it('When focusing on Start Element', () => {
            const focusPath = [{ guid: 'startGuid' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([{ guid: 'startGuid' }]);
        });

        it('When focusing on any other element is the main flow', () => {
            const focusPath = [{ guid: 'branch1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([{ guid: 'branch1' }]);
        });

        it('When focusing on a branch head element', () => {
            const focusPath = [{ guid: 'branchHead1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([
                {
                    guid: 'branch1',
                    index: 0
                },
                {
                    guid: 'branchHead1'
                }
            ]);
        });

        it('When focusing on any element other than a branch head element in a given branch', () => {
            const focusPath = [{ guid: 'screen1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([
                {
                    guid: 'branch1',
                    index: 1
                },
                {
                    guid: 'branchHead2',
                    index: 0
                },
                {
                    guid: 'screen1'
                }
            ]);
        });
    });
});
