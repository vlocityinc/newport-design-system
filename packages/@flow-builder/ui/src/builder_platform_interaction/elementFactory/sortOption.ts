import { generateGuid } from 'builder_platform_interaction/storeLib';
import { SORT_ORDER } from 'builder_platform_interaction/sortEditorLib';

export function createSortOption(sortOption?) {
    let newSortOption;

    if (sortOption) {
        const sortField = sortOption.sortField;
        const sortOrder = sortOption.sortOrder;
        const nullsLast = sortOption.nullsLast;
        const rowIndex = generateGuid();
        newSortOption = Object.assign({}, { sortField, sortOrder, nullsLast, rowIndex });
    } else {
        newSortOption = {
            sortField: null,
            sortOrder: SORT_ORDER.ASC,
            nullsLast: true,
            rowIndex: generateGuid()
        };
    }
    return newSortOption;
}

export function createSortOptionMetadataObject(sortOption?) {
    if (!sortOption) {
        throw new Error('sortOption is not defined');
    }

    const sortField = sortOption.sortField;
    const sortOrder = sortOption.sortOrder;
    const nullsLast = sortOption.nullsLast;

    const newSortOption = Object.assign({}, { sortField, sortOrder, nullsLast });

    return newSortOption;
}
