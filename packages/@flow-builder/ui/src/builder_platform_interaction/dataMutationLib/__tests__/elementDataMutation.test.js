import { hydrateWithErrors, dehydrate, getErrorsFromHydratedElement, getValueFromHydratedItem, getErrorFromHydratedItem } from '../elementDataMutation';
import {deepCopy, isPlainObject} from "builder_platform_interaction/storeLib";

/** Mock data objects - Start **/
const testObj = {
    assignmentItems : [{
        operator: 'Assign',
        leftHandSide: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
        rightHandSide: 'xyz'
        // After discussion with Derek, we are not sure if right Hand side is going to look something like this or a simple string value.
        //        rightHandSide: {
        //            dateValue: null,
        //            stringValue: '23',
        //            dateTimeValue: null,
        //            elementReference: '',
        //            inputValue: {
        //                converterName: 'HashMapToSimpleInputValueConverter',
        //                label: '',
        //                value: null
        //                }
        //        },
    }],
    description : 'test desc',
    elementType : 'ASSIGNMENT',
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElement : true,
    label : 'testAssignmentLabel',
    locationX : 358,
    locationY : 227,
    name : 'testAssignmentName',
    rowIndex: 1
};

const hydratedObject = {
    assignmentItems : [{
        operator: {value: 'Assign', error: null},
        leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
        rightHandSide: {value: 'xyz', error: null},
    }],
    description : 'test desc',
    elementType : {value: 'ASSIGNMENT', error: null},
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElement : true,
    label : {value: 'testAssignmentLabel', error:null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testAssignmentName', error: null}
};

const testObjectForGetErrorsFromHydratedElementFunction = {
    assignmentItems : [{
        operator: {value: 'Assign', error: null},
        leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: "Test Error1"},
        rightHandSide: {value: 'xyz', error: null},
    }],
    description : 'test desc',
    elementType : {value: 'ASSIGNMENT', error: null},
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElement : true,
    label : {value: 'testAssignmentLabel', error:"Test Error2"},
    locationX : 358,
    locationY : 227,
    name : {value: 'testAssignmentName', error: null}
};
/** Mock data objects - End **/

/** Helper Functions - Start **/
/**
 * @param {Object} field - field object to be tested
 */
function expectFieldToHaveValueAndErrorProperty(field) {
    expect(field).toHaveProperty('value');
    expect(field).toHaveProperty('error');
    expect(field.error).toBeNull();
}

/**
 * Check if the given field is not hydrated
 * @param {Object} field - field object to be tested
 */
function expectNotToBeHydrated(field) {
    if (isPlainObject(field)) {
        expect(field).not.toHaveProperty('value');
        expect(field).not.toHaveProperty('error');
    }
}

/** Helper Functions - End **/

describe('hydrateWithErrors function', () => {
    describe('without default blacklist', () => {
        const blackListFields = ['guid', 'description'];
        const resultObj = hydrateWithErrors(deepCopy(testObj), blackListFields, false);
        const fieldsToBeTestedForHydration = {
            name: resultObj.name,
            label: resultObj.label,
            elementType: resultObj.elementType,
            leftHandSide: resultObj.assignmentItems[0].leftHandSide,
            operator: resultObj.assignmentItems[0].operator,
            rightHandSide: resultObj.assignmentItems[0].rightHandSide
        };

        Object.entries(fieldsToBeTestedForHydration).forEach(([fieldKey, fieldValue]) => {
            it(`${fieldKey}:Needs to have a value and an empty error property`, () => {
                expectFieldToHaveValueAndErrorProperty(fieldValue);
            });
        });

        const fieldsNotToBeHydrated = {
            description: resultObj.description, // Blacklisted
            guid: resultObj.guid, // Blacklisted
            locationX: resultObj.locationX, // number
            locationY: resultObj.locationY, // number
            isCanvasElement: resultObj.isCanvasElement // boolean
        };
        Object.entries(fieldsNotToBeHydrated).forEach(([fieldKey, fieldValue]) => {
            it(`${fieldKey} should not have the error or value property on itself`, () => {
                expectNotToBeHydrated(fieldValue);
            });
        });
    });
    describe('with default blacklist', () => {
        const blackListFields = ['leftHandSide', 'name'];
        const resultObj = hydrateWithErrors(deepCopy(testObj), blackListFields);
        const fieldsToBeTestedForHydration = {
            label: resultObj.label,
            operator: resultObj.assignmentItems[0].operator,
            rightHandSide: resultObj.assignmentItems[0].rightHandSide
        };

        Object.entries(fieldsToBeTestedForHydration).forEach(([fieldKey, fieldValue]) => {
            it(`${fieldKey}:Needs to have a value and an empty error property`, () => {
                expectFieldToHaveValueAndErrorProperty(fieldValue);
            });
        });

        const fieldsNotToBeHydrated = {
            guid: resultObj.guid,
            locationX: resultObj.locationX,
            locationY: resultObj.locationY,
            elementType: resultObj.elementType,
            rowIndex: resultObj.rowIndex,
            leftHandSide: resultObj.assignmentItems[0].leftHandSide,
            name: resultObj.name
        };
        Object.entries(fieldsNotToBeHydrated).forEach(([fieldKey, fieldValue]) => {
            it(`${fieldKey} should not have the error or value property on itself`, () => {
                expectNotToBeHydrated(fieldValue);
            });
        });
    });
});

describe('dehydrate function', () => {
    const dehydratedObj = dehydrate(hydratedObject);
    const fieldsToBeTestedForDeHydration = {
        name: dehydratedObj.name,
        label: dehydratedObj.label,
        elementType: dehydratedObj.elementType,
        leftHandSide: dehydratedObj.assignmentItems[0].leftHandSide,
        operator: dehydratedObj.assignmentItems[0].operator,
        rightHandSide: dehydratedObj.assignmentItems[0].rightHandSide
    };
    Object.entries(fieldsToBeTestedForDeHydration).forEach(([fieldKey, fieldValue]) => {
        it(`${fieldKey} should not have the error or value property on itself`, () => {
            expectNotToBeHydrated(fieldValue);
        });
    });
});

describe('getErrorsFromHydratedElement function', () => {
    it('should recursively include all errors for element values including arrays', () => {
        const errorsList = getErrorsFromHydratedElement(testObjectForGetErrorsFromHydratedElementFunction);
        expect(errorsList).toHaveLength(2);
        expect(errorsList[0].key).toBe("leftHandSide");
        expect(errorsList[1].key).toBe("label");
        expect(errorsList[0].errorString).toBe("Test Error1");
        expect(errorsList[1].errorString).toBe("Test Error2");
    });
    it('should include all errors passed in via errorList argument', () => {
        const testItem = {name:"Test Error3"};
        const errorsList = getErrorsFromHydratedElement(testObjectForGetErrorsFromHydratedElementFunction, [testItem]);
        expect(errorsList).toHaveLength(3);
        expect(errorsList).toContain(testItem);
    });
    it('should return an empty list if element contains no values with errors', () => {
        const errorsList = getErrorsFromHydratedElement(hydratedObject);
        expect(errorsList).toBeDefined();
        expect(errorsList).toHaveLength(0);
    });
});

describe('getValueFromHydratedItem function', () => {
    it('should return value for the item hydrated with error', () => {
        const value = getValueFromHydratedItem(hydratedObject.name);
        expect(value).toBe('testAssignmentName');
    });
    it('should return item if not hydrated with error', () => {
        const value = getValueFromHydratedItem(testObj.name);
        expect(value).toBe('testAssignmentName');
    });
});

describe('getErrorFromHydratedItem function', () => {
    it('should return error for the item hydrated with error', () => {
        const error = getErrorFromHydratedItem(testObjectForGetErrorsFromHydratedElementFunction.label);
        expect(error).toBe('Test Error2');
    });
    it('should return null if not hydrated with error', () => {
        const value = getErrorFromHydratedItem(testObj.name);
        expect(value).toBeNull();
    });
});