import {
    baseResource,
    baseCanvasElement,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    createCondition
} from "../../base/baseElement";
import { CONDITION_LOGIC, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import {FLOW_DATA_TYPE} from "../../../dataTypeLib/dataTypeLib";
import * as baseList from '../../base/baseList';

const createListRowItemSpy = jest.spyOn(baseList, 'createListRowItem');

const resource = {
    name: 'var1',
    description: 'This is description for variable 1'
};
const canvasElement = {
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

const childElement = {
    name: 'Outcome_1',
    label: 'Outcome 1',
    conditionLogic: 'someConditionLogic'
};

const mockCondition1 = {
    leftHandSide: 'lhs1',
    operator: 'foo'
};
const mockCondition2 = {
    leftHandSide: 'lhs2',
    operator: 'bar'
};

const elementList = [{
    guid: '1',
    name: 'decision 1'
}, {
    guid: '2',
    name: 'decision 2'
}];

const connectors = [{
    guid: '3',
    label: 'connector 1'
}, {
    guid: '4',
    label: 'connector 2'
}];

describe('Base resource function', () => {
    it('returns a new resource object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            description: '',
        };
        const actualResult = baseResource();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new resource object when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1',
        };
        const actualResult = baseResource(resource);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new resource object with same value when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1',
        };
        const actualResult = baseResource(resource);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('Base canvas element function', () => {
    it('returns a new canvas element object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            description: '',
            label: '',
            locationX: 0,
            locationY: 0,
            connectorCount: 0,
            isCanvasElement: true,
            config: {
                isSelected: false
            }
        };
        const actualResult = baseCanvasElement();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new canvas element object when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
            connectorCount: 1,
            isCanvasElement: true,
            config: {
                isSelected: true
            }
        };
        const actualResult = baseCanvasElement(canvasElement);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new canvas element object with same value when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
            connectorCount: 1,
            isCanvasElement: true,
            config: {
                isSelected: true
            }
        };
        const actualResult = baseCanvasElement(canvasElement);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('Base child element function', () => {
    it('throws an Error if no element type specified', () => {
        expect(() => baseChildElement()).toThrow('baseChildElement should only be used for outcomes and wait events');
    });
    it('throws an Error if invalid element type specified', () => {
        expect(() => baseChildElement(childElement, ELEMENT_TYPE.ACTION_CALL)).toThrow('baseChildElement should only be used for outcomes and wait events');
    });
    it('returns a new child element object when existing resource child element is passed as argument', () => {
        const expectedResult =  {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME,
        };

        const actualResult = baseChildElement(childElement, ELEMENT_TYPE.OUTCOME);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new child element object with same value when existing child element object is passed as argument', () => {
        const mockOutcome =  {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME,
        };

        const actualResult = baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME);
        expect(actualResult).toMatchObject(mockOutcome);
    });

    it('child element returned has data type BOOLEAN even if no data type specified', () => {
        const mockOutcome =  {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME,
        };

        const actualResult = baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME);
        expect(actualResult.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
    });

    it('throws an Error if data type other than BOOLEAN specified', () => {
        const mockOutcome =  {
            conditionLogic: CONDITION_LOGIC.OR,
            conditions: [
                mockCondition1,
                mockCondition2,
            ],
            dataType: FLOW_DATA_TYPE.STRING.value,
        };

        expect(() => baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME)).toThrow(`dataType ${FLOW_DATA_TYPE.STRING.value} is invalid for baseChildElement`);
    });
});

describe('createCondition', () => {
    it('creates a new condition even if one is already passed in', () => {
        const input = {};
        const result = createCondition(input);
        expect(result).not.toBe(input);
    });

    it('calls createListRowItem when given a condition from the store', () => {
        const mockCondition = { leftValueReference: '{!foo}', rightValue: { stringValue: 'bar' }, operator: 'fizzBuzz' };
        const expectedParam = {
            leftHandSide: mockCondition.leftValueReference,
            rightHandSide: mockCondition.rightValue.stringValue,
            rightHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            operator: mockCondition.operator,
        };
        createCondition(mockCondition);
        expect(createListRowItemSpy).toHaveBeenCalledWith(expectedParam);
    });

    it('calls listRowItem when given an existing condition', () => {
        const mockCondition = {
            leftHandSide: 'foo',
            rightHandSide: 'bar',
            rightHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            operator: 'fizzBuzz',
        };
        const condition = createCondition(mockCondition);
        expect(createListRowItemSpy).toHaveBeenCalledWith(mockCondition);
        expect(condition).toBe(createListRowItemSpy.mock.results[0].value);
    });

    it('creates a rowIndex', () => {
        const result = createCondition();
        expect(result).toHaveProperty('rowIndex');
    });

    it('returns a condition list row item', () => {
        const result = createCondition();
        expect(result).toHaveProperty('leftHandSide');
        expect(result).toHaveProperty('operator');
        expect(result).toHaveProperty('rightHandSide');
        expect(result).toHaveProperty('rightHandSideDataType');
    });
});

describe('Base elements with connectors function returns a new object combining elements and connectors', () => {
    it('and have same element object as element in element list', () => {
        const actualResult = baseCanvasElementsArrayToMap(elementList, connectors);
        expect(actualResult.elements['1']).toBe(elementList[0]);
    });
    it('and have same connector array in new object as connector', () => {
        const actualResult = baseCanvasElementsArrayToMap(elementList, connectors);
        expect(actualResult.connectors).toBe(connectors);
    });
});