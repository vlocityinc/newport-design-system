import { checkMarqueeSelection } from '../marqueeSelectionLib';

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
            checkMarqueeSelection(undefined, [], 1, {}, []);
        }).toThrow(new Error('canvasElements is not defined. It must be defined.'));
    });

    it('With connectors undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection([], undefined, 1, {}, []);
        }).toThrow('connectors is not defined. It must be defined.');
    });

    it('With currentScale undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection([], [], undefined, {}, []);
        }).toThrow('currentScale is not defined. It must be defined.');
    });

    it('With marqueeConfig undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection([], [], 1, undefined, []);
        }).toThrow('marqueeConfig is not defined. It must be defined.');
    });

    it('With viewportCenterPoint undefined should throw an error', () => {
        expect(() => {
            checkMarqueeSelection([], [], 1, {}, undefined);
        }).toThrow('viewportCenterPoint is not defined. It must be defined.');
    });

    describe('Marquee Select Canvas Elements', () => {
        const canvasElements = [
            getCanvasElementWithMarqueeProp('canvasElement1', 100, 100, { isSelected: false, isHighlighted: false }),
            getCanvasElementWithMarqueeProp('canvasElement2', 400, 400, { isSelected: true, isHighlighted: false })
        ];
        const connectors = [];
        const viewportCenterPoint = [250, 250];

        describe('On scale 1 without any centerOffsets', () => {
            const currentScale = 1;
            it('Should add partially overlapping elements to canvasElementGuidsToSelect and non overlapping selected elements to canvasElementGuidsToDeselect', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [0, 0],
                    marqueeStartPoint: [90, 90],
                    marqueeEndPoint: [120, 120]
                };

                const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });

            it('Should neither add already selected overlapping elements to canvasElementGuidsToSelect nor add non overlapping unselected elements to canvasElementGuidsToDeselect', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [0, 0],
                    marqueeStartPoint: [450, 450],
                    marqueeEndPoint: [200, 200]
                };

                const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: [], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });
        });

        describe('On scale 1 with centerOffsets', () => {
            const currentScale = 1;
            it('Should not add canvasElement1 to canvasElementGuidsToSelect since it does not overlap with the marquess box anymore', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [50, 50],
                    marqueeStartPoint: [90, 90],
                    marqueeEndPoint: [120, 120]
                };

                const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });

            it('Should add canvasElement1 to canvasElementGuidsToSelect since it does overlap with the marquess box including the centerOffsets', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [50, 50],
                    marqueeStartPoint: [180, 100],
                    marqueeEndPoint: [140, 200]
                };

                const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });
        });

        describe('On scale 0.5 without any centerOffsets', () => {
            const currentScale = 0.5;
            it('Should add partially overlapping on a given scale to canvasElementGuidsToSelect and add any other selected non overlapping elements to canvasElementGuidsToDeselect', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [0, 0],
                    marqueeStartPoint: [150, 150],
                    marqueeEndPoint: [250, 250]
                };

                const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });

            it('Should not add canvasElement1 to canvasElementGuidsToSelect since it does not overlap witht he marque box on 0.5 scale', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [0, 0],
                    marqueeStartPoint: [90, 90],
                    marqueeEndPoint: [120, 120]
                };

                const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });
        });

        describe('On scale 0.5 with centerOffsets', () => {
            const currentScale = 0.5;
            it('Should not add canvasElement1 to canvasElementGuidsToSelect since it does not overlap with the marquess box anymore', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [50, 50],
                    marqueeStartPoint: [90, 90],
                    marqueeEndPoint: [120, 120]
                };

                const expectedResult = {canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });

            it('Should add canvasElement1 to canvasElementGuidsToSelect since it does overlap with the marquess box including the centerOffsets', () => {
                const marqueeConfig = {
                    scaledOffsetsOnMarqueeStart: [50, 50],
                    marqueeStartPoint: [200, 200],
                    marqueeEndPoint: [300, 300]
                };

                const expectedResult = {canvasElementGuidsToSelect: ['canvasElement1'], canvasElementGuidsToDeselect: ['canvasElement2'], connectorGuidsToSelect: [], connectorGuidsToDeselect: []};
                expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
            });
        });
    });

    describe('Marquee Select Connectors', () => {
        const currentScale = 1;
        const marqueeConfig = {
            scaledOffsetsOnMarqueeStart: [0, 0],
            marqueeStartPoint: [40, 40],
            marqueeEndPoint: [100, 100]
        };
        const viewportCenterPoint = [250, 250];

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
            expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
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
            expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
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
            expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
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
            expect(checkMarqueeSelection(canvasElements, connectors, currentScale, marqueeConfig, viewportCenterPoint)).toEqual(expectedResult);
        });
    });
});