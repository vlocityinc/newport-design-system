import { getElementByDevName } from '../storeQuery';
import { assignmentElementName } from 'mock-store-data';

describe('getElementByDevName', () => {
    it('returns element in a case-insensitive way by default', () => {
        const element = getElementByDevName(assignmentElementName.toUpperCase());
        expect(element).not.toBeUndefined();
        expect(element.name).toEqual(assignmentElementName);
    });
    it('returns undefined if called with caseSensitive parameter set to true and devName has not the same case', () => {
        const element = getElementByDevName(assignmentElementName.toUpperCase(), true);
        expect(element).toBeUndefined();
    });
    it('returns undefined if there is no element with given name', () => {
        const element = getElementByDevName('notExistingName');
        expect(element).toBeUndefined();
    });
});