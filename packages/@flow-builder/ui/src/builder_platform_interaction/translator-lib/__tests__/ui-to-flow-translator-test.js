import { swapGUIDsForDevNames } from '../ui-to-flow-translator';

describe('UI to FLow Translator', () => {
    it('converts dev names to uids', () => {
        const elementGUIDMap = {'swapMe_12':{name:'swapMe'}};
        const object = {items:[{first:{targetReference:'swapMe_12'}}]};
        swapGUIDsForDevNames(elementGUIDMap, object);

        expect(object.items[0].first.targetReference).toEqual('swapMe');
    });

    // desired structure of the flow ui data model is still under discussion
    // connectors
});
