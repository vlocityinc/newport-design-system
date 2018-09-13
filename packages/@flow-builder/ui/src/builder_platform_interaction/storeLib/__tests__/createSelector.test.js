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
        }},
    canvasElements: ["ASSIGNMENT_00000", "ASSIGNMENT_00001"]
};
const elementsSelector = () => state.elements;
const canvasElementsSelector = () => state.canvasElements;

describe('Create Selectors', () => {
    it('when two selectors {array} values are passed in should return as two arguments to resulted function.', (done) => {
        const canvasSelector = createSelector([elementsSelector, canvasElementsSelector], (elements, canvasElements) => {
            expect(elements).toEqual(state.elements);
            expect(canvasElements).toEqual(state.canvasElements);
            done();
        });
        canvasSelector();
    });
    it('when selectors {array} value is NULL should return as error string - {string} could not transform the null.', (done) => {
        try {
            (createSelector(null, () => {}))();
        } catch (e) {
            expect(e.message).toEqual("could not transform the null.");
            done();
        }
    });
    it('when one selectors {array} values instead of two are passed in should return as two arguments to resulted function.', (done) => {
        const canvasSelector = createSelector([elementsSelector], (elements, canvasElements) => {
            expect(elements).toEqual(state.elements);
            expect(canvasElements).toBeUndefined();
            done();
        });
        canvasSelector();
    });
    it('when selectors {array} value is empty then should return as error string - {string} could not transform the null.', (done) => {
        try {
            (createSelector([], () => {}))();
        } catch (e) {
            expect(e.message).toEqual("could not transform the .");
            done();
        }
    });
    it('when selectors value is an OBJECT then should return as error string - {string} could not transform the [object Object].', (done) => {
        try {
            (createSelector({}, () => {}))();
        } catch (e) {
            expect(e.message).toEqual("could not transform the [object Object].");
            done();
        }
    });
});