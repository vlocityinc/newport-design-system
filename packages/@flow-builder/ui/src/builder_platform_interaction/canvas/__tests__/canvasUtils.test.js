import { checkMarqueeSelection } from '../canvasUtils';

jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));

const getCanvasElementWithMarqueeProp = (guid, locationX, locationY, config) => {
    return {
        guid,
        locationX,
        locationY,
        config
    };
};

const getConnectorWithMarqueeProp = (guid, source, target, config) => {
    return {
        guid,
        source,
        target,
        config
    };
};

describe('checkMarqueeSelection', () => {
    it('With canvasElements undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection(undefined, [], [], [], []);
          }).toThrow(new Error('canvasElements is not defined. It must be defined.'));
    });

    it('With connectors undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection([], undefined, [], [], []);
          }).toThrow('connectors is not defined. It must be defined.');
    });

    describe('Marquee Select Canvas Elements', () => {
        const canvasElements = [
            getCanvasElementWithMarqueeProp('canvasElement1', 50, 50, { isSelected: false, isHighlighted: false }),
            getCanvasElementWithMarqueeProp('canvasElement2', 50, 50, { isSelected: true, isHighlighted: false })
        ];
        const connectors = [];
        const currentSelectedCanvasElementGuids = new Set();

        it('When canvas element is in unselected state and overlapping with the marquee box, should add to canvasElementGuidsToSelect list', () => {
            const boxStartPos = [40, 40];
            const boxEndPos = [100, 100];

            const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: [], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });

        it('When canvas element is in selected state and leaving the marquee box, should add to canvasElementGuidsToDeselect list', () => {
            const boxStartPos = [10, 10];
            const boxEndPos = [20, 20];
            const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });
    });

    describe('Marquee Select Connectors', () => {
        const boxStartPos = [40, 40];
        const boxEndPos = [100, 100];
        const currentSelectedCanvasElementGuids = new Set();
        it('When both source and target nodes are selected and their connector is in unselected state, should add to connectorGuidsToSelect list', () => {
            const canvasElements = [
                getCanvasElementWithMarqueeProp('canvasElement1', 50, 50, { isSelected: false, isHighlighted: false }),
                getCanvasElementWithMarqueeProp('canvasElement2', 50, 50, { isSelected: false, isHighlighted: false })
            ];
            const connectors = [
                getConnectorWithMarqueeProp('connector1', 'canvasElement1', 'canvasElement2', { isSelected: false }),
                getConnectorWithMarqueeProp('connector2', 'canvasElement1', 'canvasElement2', { isSelected: true })
            ];
            const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1', 'canvasElement2'], canvasElementGuidsToDeselect: [], connectorGuidsToSelect: ['connector1'], connectorGuidsToDeselect: []};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });

        it('When source node is selected and target node is deselected, their connector is in selected state, should add to connectorGuidsToDeselect list', () => {
            const canvasElements = [
                getCanvasElementWithMarqueeProp('canvasElement1', 50, 50, { isSelected: false, isHighlighted: false }),
                getCanvasElementWithMarqueeProp('canvasElement2', 200, 200, { isSelected: true, isHighlighted: false })
            ];
            const connectors = [
                getConnectorWithMarqueeProp('connector1', 'canvasElement1', 'canvasElement2', { isSelected: false }),
                getConnectorWithMarqueeProp('connector2', 'canvasElement1', 'canvasElement2', { isSelected: true })
            ];
            const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: ['connector2']};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });

        it('When source node is deselected and target node is selected, their connector is in selected state, should add to connectorGuidsToDeselect list', () => {
            const canvasElements = [
                getCanvasElementWithMarqueeProp('canvasElement1', 200, 200, { isSelected: true, isHighlighted: false }),
                getCanvasElementWithMarqueeProp('canvasElement2', 50, 50, { isSelected: false, isHighlighted: false })
            ];
            const connectors = [
                getConnectorWithMarqueeProp('connector1', 'canvasElement1', 'canvasElement2', { isSelected: false }),
                getConnectorWithMarqueeProp('connector2', 'canvasElement1', 'canvasElement2', { isSelected: true })
            ];
            const expectedResult = {canvasElementGuidsToSelect: ['canvasElement2'], canvasElementGuidsToDeselect: ['canvasElement1'], connectorGuidsToSelect: [], connectorGuidsToDeselect: ['connector2']};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });

        it('When both source and target nodes get deselected, their connector is in selected state, should add to connectorGuidsToDeselect list', () => {
            const canvasElements = [
                getCanvasElementWithMarqueeProp('canvasElement1', 200, 200, { isSelected: true, isHighlighted: false }),
                getCanvasElementWithMarqueeProp('canvasElement2', 200, 200, { isSelected: true, isHighlighted: false })
            ];
            const connectors = [
                getConnectorWithMarqueeProp('connector1', 'canvasElement1', 'canvasElement2', { isSelected: false }),
                getConnectorWithMarqueeProp('connector2', 'canvasElement1', 'canvasElement2', { isSelected: true })
            ];
            const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: ['canvasElement1', 'canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: ['connector2']};
            expect(checkMarqueeSelection(canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos)).toEqual(expectedResult);
        });
    });
});