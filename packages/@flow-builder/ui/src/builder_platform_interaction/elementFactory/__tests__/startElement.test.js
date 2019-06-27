import {
    createStartElement,
    createStartElementWithConnectors
} from '../startElement';

const startElementReference = 'assignment1';

describe('Start element', () => {
    describe('createStart element', () => {
        it('return new start element', () => {
            const expectedResult = {
                name: '',
                description: '',
                label: '',
                locationX: 50,
                locationY: 50,
                isCanvasElement: true,
                connectorCount: 0,
                config: {
                    isSelected: false,
                    isHighlighted: false
                },
                elementType: 'START_ELEMENT',
                maxConnections: 1
            };
            const actualResult = createStartElement();
            expect(actualResult).toMatchObject(expectedResult);
        });
    });
    describe('createStartElementWithConnector function', () => {
        it('return new start element with connector having target as start element reference', () => {
            const { connectors } = createStartElementWithConnectors(
                startElementReference
            );
            const target = connectors[0].target;
            expect(target).toBe(startElementReference);
        });
    });
});
