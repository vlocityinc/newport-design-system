import { elementPropertyEditorSelector } from "../elementPropertyEditorSelector";

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        deepCopy: element => {
            return element;
        }
    };
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    return {
        mutateEditorElement: element => {
            element.name += '_mutated';
            return element;
        },
        hydrateWithErrors: element => {
            element.name += '_hydrated';
            return element;
        }
    };
});

describe('elementPropertyEditorSelector function', () => {
    it('should select and return element from the store', () => {
        const state = {
            elements: { element1: { name: 'elementName' } }
        };
        expect(elementPropertyEditorSelector(state, 'element1')).toEqual({
            name: 'elementName_mutated_hydrated'
        });
    });

    it('should not blow up when trying to select an element with an invalid guid', () => {
        const state = {
            elements: { element1: { name: 'elementName' } }
        };
        expect(elementPropertyEditorSelector(state, 'foo')).toBeUndefined();
    });
});
