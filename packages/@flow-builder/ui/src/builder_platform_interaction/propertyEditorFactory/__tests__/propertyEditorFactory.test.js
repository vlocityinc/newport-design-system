import { getElementForPropertyEditor } from '../propertyEditorFactory';
import {
    stringVariable,
    numberVariable,
    dateVariable,
    stringCollectionVariable1,
    accountSObjectVariable,
    stringConstant,
    textTemplate1,
    elementsForPropertyEditors
} from 'mock/storeData';
import { goldObjectMatchers } from 'builder_platform_interaction/builderTestUtils';

expect.extend(goldObjectMatchers);

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

describe('propertyEditorFactory', () => {
    describe('getElementForPropertyEditor', () => {
        it('returns expected hydrated elements', () => {
            const elements = [
                stringVariable,
                numberVariable,
                dateVariable,
                stringCollectionVariable1,
                accountSObjectVariable,
                textTemplate1,
                stringConstant
            ];
            const actualElementsForPropertyEditors = elements.reduce(
                (acc, element) => {
                    acc[element.name] = getElementForPropertyEditor(element);
                    return acc;
                },
                {}
            );
            expect(actualElementsForPropertyEditors).toEqualGoldObject(
                elementsForPropertyEditors,
                'elementsForPropertyEditors in mock_store_data/elementsForPropertyEditors.js'
            );
        });
    });
});
