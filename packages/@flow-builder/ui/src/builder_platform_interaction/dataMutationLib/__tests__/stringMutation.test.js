import { capitalizeFirstLetter } from '../stringMutation';

describe('String Mutation Library', () => {
    describe('string capitalization', () => {
        it('when a word {string} with all CAPITAL Letters are passed in should capitalize only the first letter of the word {string}', () => {
            const string = capitalizeFirstLetter('ASSIGNMENT');
            expect(string).toEqual('Assignment');
        });
        it('when a two word {string} with all CAPITAL Letters are passed in should capitalize only the first letter of the each word {string}', () => {
            const string = capitalizeFirstLetter('ASSIGNMENT ONE');
            expect(string).toEqual('Assignment One');
        });
        it('when a word {string} with all small Letters are passed in should capitalize only the first letter of the word {string}', () => {
            const string = capitalizeFirstLetter('assignment');
            expect(string).toEqual('Assignment');
        });
        it('when a NULL is passed in should return a NULL', () => {
            const string = capitalizeFirstLetter(null);
            expect(string).toBeNull();
        });
        it('when a Number as {string} is passed in should return a NULL', () => {
            const string = capitalizeFirstLetter(123);
            expect(string).toBeNull();
        });
    });
});
