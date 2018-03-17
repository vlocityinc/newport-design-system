import { valueChangedHelper } from '../expression-builder-utils';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-constant';

// get the constants for lhs, operator, and rhs using es6 object destructering
const { LEFT_HAND_SIDE: lhs, OPERATOR: operator, RIGHT_HAND_SIDE: rhs } = EXPRESSION_PROPERTY_TYPE;
// get the helper methods from the util
const { [lhs]: lhsValueChanged, [operator]: operatorValueChanged, [rhs]: rhsValueChanged } = valueChangedHelper;

/** Mock data **/
const mockItem = {
    [lhs]: {
        value: 'testLhsValue',
    },
    [operator]: {
        value: 'testOperatorValue',
    },
    [rhs]: {
        value: 'testRhsValue',
    },
};

/** HELPER FUNCTIONS **/

/**
 * Checks that the given helper function for the property type exists
 * @param  {String} propertyType the property type (lhs, operator, rhs)
 */
const checkProp = (propertyType) => {
    it(`has the ${propertyType} value changed helper function`, () => {
        expect(valueChangedHelper[propertyType]).toBeDefined();
    });
};

/**
 * Asserts that the helper function returns a new object after calling
 * the helper function based on the given property type
 * @param  {[type]} propertyType [description]
 */
const checkNewObjectReturned = (propertyType) => {
    const newItem = valueChangedHelper[propertyType](mockItem);
    expect(newItem).not.toBe(mockItem);
};

/** TESTS **/

describe('Value changed utils', () => {
    describe('Method sanity checks', () => {
        for (const property in EXPRESSION_PROPERTY_TYPE) {
            if (EXPRESSION_PROPERTY_TYPE.hasOwnProperty(property)) {
                checkProp(EXPRESSION_PROPERTY_TYPE[property]);
            }
        }
    });

    /** lhsValueChanged helper **/
    describe('lhsValueChanged helper', () => {
        it('returns a new item after calling lhsValueChanged', () => {
            checkNewObjectReturned(lhs);
        });

        it('returns item that still has values for operator & rhs when given an undefined lhs value', () => {
            // construct mock item with no lhs value
            const item = {
                [lhs] : {},
                [operator] : { value: 'testOperatorValue'},
                [rhs] : { value: 'testRhsValue' },
            };
            const newItem = lhsValueChanged(item);
            expect(newItem[operator].value).not.toBeNull();
            expect(newItem[rhs].value).not.toBeNull();
        });
    });

    /** operatorValueChanged helper **/
    describe('operatorValueChanged helper', () => {
        it('returns a new item after calling operatorValueChanged', () => {
            checkNewObjectReturned(operator);
        });

        it('returns item that still has values for rhs when given an undefined operator value', () => {
            // construct mock item with no lhs value
            const item = {
                [lhs] : {},
                [operator] : { },
                [rhs] : { value: 'testRhsValue' },
            };
            const newItem = operatorValueChanged(item);
            expect(newItem[rhs].value).not.toBeNull();
        });
    });

    /** rhsValueChanged helper **/
    describe('rhsValueChanged helper', () => {
        it('returns a new item after calling rhsValueChanged', () => {
            checkNewObjectReturned(rhs);
        });

        it('does not change rhs value when calling rhsValueChanged', () => {
            const newItem = rhsValueChanged(mockItem);
            expect(newItem[rhs].value).toEqual(mockItem[rhs].value);
        });

        it('returns item when given an undefined rhs value', () => {
            // construct mock item with no lhs value
            const item = {
                [lhs] : {},
                [operator] : { },
                [rhs] : { nonValueKey: 'testValue'},
            };
            const newItem = operatorValueChanged(item);
            expect(newItem[rhs]).toMatchObject({ nonValueKey: 'testValue'});
        });
    });
});
