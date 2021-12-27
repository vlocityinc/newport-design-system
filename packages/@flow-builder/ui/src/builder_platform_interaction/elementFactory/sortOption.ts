import { SORT_ORDER } from 'builder_platform_interaction/sortEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * @param sortOption
 */
export function createSortOption(sortOption?) {
    let newSortOption;

    if (sortOption) {
        const sortField = sortOption.sortField;
        const sortOrder = sortOption.sortOrder;
        const doesPutEmptyStringAndNullFirst = sortOption.doesPutEmptyStringAndNullFirst;
        const rowIndex = generateGuid();
        newSortOption = Object.assign({}, { sortField, sortOrder, doesPutEmptyStringAndNullFirst, rowIndex });
    } else {
        newSortOption = {
            sortField: null,
            sortOrder: SORT_ORDER.ASC,
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: generateGuid()
        };
    }
    return newSortOption;
}

/**
 * @param sortOption
 */
export function createSortOptionMetadataObject(sortOption?) {
    if (!sortOption) {
        throw new Error('sortOption is not defined');
    }

    const sortField = sortOption.sortField;
    const sortOrder = sortOption.sortOrder;
    const doesPutEmptyStringAndNullFirst = sortOption.doesPutEmptyStringAndNullFirst;

    const newSortOption = Object.assign({}, { sortField, sortOrder, doesPutEmptyStringAndNullFirst });

    return newSortOption;
}
