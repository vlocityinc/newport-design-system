import { generateGuid } from '../guidGenerator';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Guid Generator', () => {
    it('return guids', () => {
        expect(generateGuid()).toMatch(uuidRegex);
    });
});
