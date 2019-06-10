import {
    createFormula,
    createFormulaForStore,
    createFormulaMetadataObject
} from '../formula';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const formulaMetadata = {
    dataType: 'String',
    expression: 'Hello {!guid}',
    name: 'Formula1',
    scale: 0
};

const formula = {
    name: 'Formula1',
    description: '',
    expression: 'Hello {!guid}',
    dataType: 'String',
    scale: 0,
    elementType: ELEMENT_TYPE.FORMULA
};

describe('Formula:', () => {
    describe('createFormula function', () => {
        it('returns a new formula object when no argument is passed', () => {
            const expectedResult = {
                name: '',
                description: '',
                expression: '',
                dataType: null,
                scale: 2,
                elementType: ELEMENT_TYPE.FORMULA
            };
            const actualResult = createFormula();
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('returns a new formula object with same value when an existing formula is passed', () => {
            const actualResult = createFormula(formula);
            expect(actualResult).toMatchObject(formula);
        });
    });
    describe('createFormulaForStore function', () => {
        it('return a new formula object in shape of store when formula metadata is passed', () => {
            const { elements } = createFormulaForStore(formulaMetadata);
            expect(Object.values(elements)[0]).toMatchObject(formula);
        });
    });
    describe('createFormulaMetadata function', () => {
        it('return a new metadata object when variable has default value of type string value', () => {
            const actualResult = createFormulaMetadataObject(formula);
            expect(actualResult).toMatchObject(formulaMetadata);
        });
    });
});
