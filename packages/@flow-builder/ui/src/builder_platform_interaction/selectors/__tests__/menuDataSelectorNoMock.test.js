import { writableElementsSelector } from '../menuDataSelector';
import { apexCallAutomaticAnonymousStringOutput } from 'mock/storeData';

describe('writableElementsSelector', () => {
    it('returns anonymous string output', () => {
        const stateInstance = {
            elements: { apexCallAutomaticAnonymousStringOutput }
        };

        const result = writableElementsSelector(stateInstance);

        expect(result).toContain(apexCallAutomaticAnonymousStringOutput);
    });
});
