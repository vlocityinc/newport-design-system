import { hydrateWithErrors, dehydrate } from '../elementDataMutation';

const testObj = {
    assignmentItems : [{
        operator: 'Assign',
        valueType: '',
        leftHandSide: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
        // After discussion with Derek, we are not sure if right Hand side is going to look like something like this or a simple string value.

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
        rightHandSide: 'xyz',
        inputDataType: ''
    }],
    description : '',
    elementType : 'ASSIGNMENT',
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElemen : true,
    label : 'testAss',
    locationX : 358,
    locationY : 227,
    name : 'testAss'
};

const hydratedObject = {
    assignmentItems : [{
        operator: {value: 'Assign', error: null},
        valueType: {value: '', error: null},
        leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
        rightHandSide: {value: 'xyz', error: null},
        inputDataType: {value: '', error: null}
    }],
    description : '',
    elementType : {value: 'ASSIGNMENT', error: null},
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElemen : true,
    label : {value: 'testAss', error:null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testAss', error: null}
};

/**
 * @param {string[]} listOfFields - list of field names to run test on
 */
function expectFieldsToHaveValueAndErrorProperty(listOfFields) {
    listOfFields.forEach((field) => {
        it(`${field.value} needs to have an error and value property`, () => {
            expect(field).toHaveProperty('value');
            expect(field).toHaveProperty('error');
            expect(field.error).toBeNull();
        });
    });
}

/**
 * @param {string[]} listOfFields - list of field names to run test on
 */
function expectCleanObjectWithNoErrors(listOfFields) {
    listOfFields.forEach((field) => {
        it(`${field} should not have the error or value property on itself`, () => {
            expect(field).not.toHaveProperty('value');
            expect(field).not.toHaveProperty('error');
        });
    });
}

describe('hydrateWithErrors function test', () => {
    const blackListFields = ['guid', 'description'];
    const resultObj = hydrateWithErrors(testObj, blackListFields);
    expectFieldsToHaveValueAndErrorProperty([
        resultObj.name,
        resultObj.label,
        resultObj.assignmentItems[0].leftHandSide,
        resultObj.assignmentItems[0].operator,
        resultObj.assignmentItems[0].rightHandSide
    ]);

    expectCleanObjectWithNoErrors([resultObj.guid, resultObj.description]);
});

describe('dehydrate function test', () => {
    const dehydratedObj = dehydrate(hydratedObject);
    expectCleanObjectWithNoErrors([
        dehydratedObj.name,
        dehydratedObj.label,
        dehydratedObj.assignmentItems[0].leftHandSide,
        dehydratedObj.assignmentItems[0].operator,
        dehydratedObj.assignmentItems[0].rightHandSide
    ]);
});
