// @ts-nocheck
import { getElementForPropertyEditor } from '../propertyEditorFactory';
import {
    stringVariable,
    numberVariable,
    dateVariable,
    stringCollectionVariable1,
    accountSObjectVariable,
    stringConstant,
    textTemplate1,
    textTemplate2,
    elementsForPropertyEditors,
    emailScreenField,
    emailScreenFieldAutomaticOutput,
    deleteAccountWithFilters,
    deleteAccount
} from 'mock/storeData';
import { goldObjectMatchers } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

expect.extend(goldObjectMatchers);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('propertyEditorFactory', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('getElementForPropertyEditor', () => {
        it('returns expected hydrated elements', () => {
            const elements = [
                stringVariable,
                numberVariable,
                dateVariable,
                stringCollectionVariable1,
                accountSObjectVariable,
                textTemplate1,
                textTemplate2,
                stringConstant,
                emailScreenField,
                emailScreenFieldAutomaticOutput,
                deleteAccountWithFilters,
                deleteAccount
            ];
            const actualElementsForPropertyEditors = elements.reduce((acc, element) => {
                acc[element.name] = getElementForPropertyEditor(element);
                return acc;
            }, {});
            expect(actualElementsForPropertyEditors).toEqualGoldObject(
                elementsForPropertyEditors,
                'elementsForPropertyEditors in mock_store_data/elementsForPropertyEditors'
            );
        });
    });
});
