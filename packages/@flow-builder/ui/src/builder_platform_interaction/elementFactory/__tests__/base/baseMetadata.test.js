import { baseResourceMetadataObject, baseChildElementMetadataObject, baseCanvasElementMetadataObject } from "../../base/baseMetadata";
import {createFEROVMetadataObject} from "../../ferov";
import {rhsDataTypePropertyName, rhsPropertyName} from "../../base/baseList";
import {CONDITION_LOGIC} from "../../../flowMetadata/flowMetadata";

jest.mock('../../ferov', () => {
    return {
        createFEROVMetadataObject: jest.fn((condition) => {
            return {
                value: 'someRHSValueFrom' + condition
            };
        }).mockName('createFEROVMetadataObject')
    };
});

const resource = {
    name: 'var1',
    description: 'This is description for variable 1'
};

const childElement = {
    name: 'Outcome_1',
    label: 'Outcome 1',
    conditionLogic: CONDITION_LOGIC.OR,
    conditions: undefined
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
            label: 'Outcome 1',
            conditionLogic: CONDITION_LOGIC.OR,
            conditions: undefined
        };
        const actualResult = baseChildElementMetadataObject(childElement);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new child element object with same value when existing child element object is passed as argument', () => {
        const expectedResult = {
            name: 'Outcome_1',
            label: 'Outcome 1',
            conditionLogic: CONDITION_LOGIC.OR,
            conditions: undefined
        };
        const actualResult = baseChildElementMetadataObject(childElement);
        expect(actualResult).toMatchObject(expectedResult);
    });

    describe('conditions', () => {
        const mockCondition1 = {
            leftHandSide: 'lhs1',
            operator: 'foo'
        };
        const mockCondition2 = {
            leftHandSide: 'lhs2',
            operator: 'bar'
        };
        const childElementWithConditions = {
            name: 'Outcome_1',
            label: 'Outcome 1',
            conditionLogic: CONDITION_LOGIC.OR,
            conditions: [
                mockCondition1,
                mockCondition2,
            ]
        };

        it('are empty if no conditions provided', () => {
            const actualResult = baseChildElementMetadataObject(childElement);
            expect(actualResult.conditions).toBeUndefined();
        });
        it('calls createFEROVMetadataObject for each condition', () => {
            baseChildElementMetadataObject(childElementWithConditions);

            expect(createFEROVMetadataObject.mock.calls[0][0]).toEqual(mockCondition1);
            expect(createFEROVMetadataObject.mock.calls[0][1]).toEqual(rhsPropertyName);
            expect(createFEROVMetadataObject.mock.calls[0][2]).toEqual(rhsDataTypePropertyName);

            expect(createFEROVMetadataObject.mock.calls[1][0]).toEqual(mockCondition2);
            expect(createFEROVMetadataObject.mock.calls[1][1]).toEqual(rhsPropertyName);
            expect(createFEROVMetadataObject.mock.calls[1][2]).toEqual(rhsDataTypePropertyName);
        });
        it('are transformed to store shape', () => {
            const actualResult = baseChildElementMetadataObject(childElementWithConditions);

            expect(actualResult.conditions).toHaveLength(2);

            expect(actualResult.conditions[0]).toEqual({
                leftValueReference: mockCondition1.leftHandSide,
                rightValue: {
                    value: 'someRHSValueFrom' + mockCondition1
                },
                operator: mockCondition1.operator
            });

            expect(actualResult.conditions[1]).toEqual({
                leftValueReference: mockCondition2.leftHandSide,
                rightValue: {
                    value: 'someRHSValueFrom' + mockCondition2
                },
                operator: mockCondition2.operator
            });
        });
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
