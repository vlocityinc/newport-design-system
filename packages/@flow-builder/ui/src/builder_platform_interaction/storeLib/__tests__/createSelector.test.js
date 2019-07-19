import { createSelector } from '../createSelector';

const state = {
    elements: {
        ASSIGNMENT_00000: {
            assignmentItems: [Array],
            connector: [Object],
            label: 'Assignment1',
            locationX: 145,
            locationY: 105,
            name: 'Assignment1',
            processMetadataValues: [],
            elementType: 'ASSIGNMENT',
            isCanvasElement: true,
            config: [Object],
            maxConnections: 1,
            connectorCount: 1,
            guid: 'ASSIGNMENT_00000'
        },
        ASSIGNMENT_00001: {
            assignmentItems: [Array],
            label: 'Assignment2',
            locationX: 264,
            locationY: 299,
            name: 'Assignment2',
            processMetadataValues: [],
            elementType: 'ASSIGNMENT',
            isCanvasElement: true,
            config: [Object],
            maxConnections: 1,
            connectorCount: 0,
            guid: 'ASSIGNMENT_00001'
        },
        VARIABLE_00002: {
            dataType: 'String',
            isCollection: false,
            isInput: false,
            isOutput: false,
            name: 'Test',
            processMetadataValues: [],
            scale: 0,
            elementType: 'VARIABLE',
            isCanvasElement: false,
            guid: 'VARIABLE_00002'
        }
    },
    canvasElements: ['ASSIGNMENT_00000', 'ASSIGNMENT_00001']
};
const elementsSelector = () => state.elements;
const canvasElementsSelector = () => state.canvasElements;

describe('Create Selectors', () => {
    it('when two selectors {array} values are passed in should return as two arguments to resulted function.', done => {
        const canvasSelector = createSelector(
            [elementsSelector, canvasElementsSelector],
            (elements, canvasElements) => {
                expect(elements).toEqual(state.elements);
                expect(canvasElements).toEqual(state.canvasElements);
                done();
            }
        );
        canvasSelector();
    });
    it('when selectors {array} value is NULL should return as error string - {string} could not transform the null.', done => {
        try {
            createSelector(
                null,
                () => {}
            )();
        } catch (e) {
            expect(e.message).toEqual('could not transform the null.');
            done();
        }
    });
    it('when one selectors {array} values instead of two are passed in should return as two arguments to resulted function.', done => {
        const canvasSelector = createSelector(
            [elementsSelector],
            (elements, canvasElements) => {
                expect(elements).toEqual(state.elements);
                expect(canvasElements).toBeUndefined();
                done();
            }
        );
        canvasSelector();
    });
    it('when selectors {array} value is empty then should return as error string - {string} could not transform the null.', done => {
        try {
            createSelector(
                [],
                () => {}
            )();
        } catch (e) {
            expect(e.message).toEqual('could not transform the .');
            done();
        }
    });
    it('when selectors value is an OBJECT then should return as error string - {string} could not transform the [object Object].', done => {
        try {
            createSelector(
                {},
                () => {}
            )();
        } catch (e) {
            expect(e.message).toEqual(
                'could not transform the [object Object].'
            );
            done();
        }
    });

    describe('memoized selectors and tranforms', () => {
        const selectorCounter = [0, 0];
        let transformCounter = 0;

        function selector0(v) {
            selectorCounter[0]++;
            return 'sel0_' + (typeof v === 'string' ? v : v.sel0);
        }

        function selector1(v) {
            selectorCounter[1]++;
            return 'sel1_' + (typeof v === 'string' ? v : v.sel1);
        }

        const selector = createSelector(
                [selector0, selector1],
                (v0, v1) => {
                    transformCounter++;
                    return '' + v0 + '_' + v1;
                },
                true
            );

        it('invokes original selectors and the transform (functions) if invoked for the first time', () => {
            const result = selector('0');
            expect(result).toEqual('sel0_0_sel1_0');
            expect(selectorCounter).toEqual([1, 1]);
            expect(transformCounter).toEqual(1);
        });

        it('invokes original functions if invoked with different arguments', () => {
            const result = selector('1');
            expect(result).toEqual('sel0_1_sel1_1');
            expect(selectorCounter).toEqual([2, 2]);
            expect(transformCounter).toEqual(2);
        });

        it('does not invoke original functions, if the arguments did not change', () => {
            const result = selector('1');
            expect(result).toEqual('sel0_1_sel1_1');
            expect(selectorCounter).toEqual([2, 2]);
            expect(transformCounter).toEqual(2);
        });

        it('invokes original functions if invoked with different arguments after invocation with same arguments', () => {
            const result = selector('2');
            expect(result).toEqual('sel0_2_sel1_2');
            expect(selectorCounter).toEqual([3, 3]);
            expect(transformCounter).toEqual(3);
        });

        it('invokes original selectors and does not invoke the transform if invoked with different arguments and selectors produce the same set of results', () => {
            const result = selector({
                sel0: '2',
                sel1: '2'
            });
            expect(result).toEqual('sel0_2_sel1_2');
            expect(selectorCounter).toEqual([4, 4]);
            expect(transformCounter).toEqual(3);
        });
    });
});
