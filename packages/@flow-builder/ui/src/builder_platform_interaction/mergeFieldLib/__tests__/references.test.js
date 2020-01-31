import { loadReferencesIn } from '../references';
import { assignmentElement, stringVariable, numberVariable, textTemplate1 } from 'mock/storeData';
import { resolveReferenceFromIdentifier } from 'builder_platform_interaction/mergeFieldLib';

jest.mock('builder_platform_interaction/mergeFieldLib', () => ({
    resolveReferenceFromIdentifier: jest.fn().mockImplementation(() => Promise.resolve())
}));

describe('loadReferencesIn', () => {
    it('resolves references used in an element', async () => {
        await loadReferencesIn(assignmentElement);
        expect(resolveReferenceFromIdentifier.mock.calls[0][0]).toBe(stringVariable.guid);
        expect(resolveReferenceFromIdentifier.mock.calls[1][0]).toBe(numberVariable.guid);
    });
    it('resolves references in a text template', async () => {
        await loadReferencesIn(textTemplate1);
        expect(resolveReferenceFromIdentifier.mock.calls[0][0]).toBe(stringVariable.guid);
    });
    it('returns a rejected Promise if some references cannot be resolved because a server call failed', async () => {
        resolveReferenceFromIdentifier.mockImplementationOnce(() => Promise.reject('Server called failed'));
        await expect(loadReferencesIn(assignmentElement)).rejects.toEqual('Server called failed');
        // we resolve references anyway
        await resolveReferenceFromIdentifier.mock.results[1].value;
    });
});
