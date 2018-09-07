import { baseResourceMetadataObject, baseChildElementMetadataObject, baseCanvasElementMetadataObject } from '../../base/base-metadata';

const resource = {
    name: 'var1',
    description: 'This is description for variable 1'
};

const childElement = {
    name: 'Outcome_1',
    label: 'Outcome 1'
};

const canvasElement = {
    guid: 'guid_1',
    name: 'Assignment 1',
    description: 'This is description for assignment 1',
    label: 'Assignment 1',
    locationX: 10,
    locationY: 20,
    connectorCount: 1,
    availableConnections: ['connector1', 'connector2'],
    config: {
        isSelected: true
    }
};

describe('Base resource metadata function', () => {
    it('returns a new resource object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            description: '',
        };
        const actualResult = baseResourceMetadataObject();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new resource object when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1',
        };
        const actualResult = baseResourceMetadataObject(resource);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new resource object with same value when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1',
        };
        const actualResult = baseResourceMetadataObject(resource);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('Base child element metadata function', () => {
    it('returns a new child element object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            label: ''
        };
        const actualResult = baseChildElementMetadataObject();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new child element object when existing resource child element is passed as argument', () => {
        const expectedResult = {
            name: 'Outcome_1',
            label: 'Outcome 1'
        };
        const actualResult = baseChildElementMetadataObject(childElement);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new child element object with same value when existing child element object is passed as argument', () => {
        const expectedResult = {
            name: 'Outcome_1',
            label: 'Outcome 1'
        };
        const actualResult = baseChildElementMetadataObject(childElement);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('Base canvas element metadata function', () => {
    it('returns a new canvas element object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            label: '',
            description: '',
            locationX: 0,
            locationY: 0,
        };
        const actualResult = baseCanvasElementMetadataObject();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new canvas object when existing resource canvas element is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
        };
        const actualResult = baseCanvasElementMetadataObject(canvasElement);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new canvas object with same value when existing canvas element object is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
        };
        const actualResult = baseCanvasElementMetadataObject(canvasElement);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new canvas object with updated location when existing canvas element object and config is passed as arguments', () => {
        const config = {
            xyTranslate: {
                translateX: 10,
                translateY: 20
            },
            connectorMap: {
                'guid_1': [{
                    type: 'REGULAR',
                    source: 'guid_1',
                    target: 'guid_2'
                }]
            }
        };
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 20,
            locationY: 40,
            connector: {
                targetReference: 'guid_2'
            }
        };

        const actualResult = baseCanvasElementMetadataObject(canvasElement, config);
        expect(actualResult).toMatchObject(expectedResult);
    });
});
