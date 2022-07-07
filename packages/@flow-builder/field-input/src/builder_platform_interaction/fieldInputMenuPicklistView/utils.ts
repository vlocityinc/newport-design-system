/**
 *
 * @param apiData TBD
 * @returns TBD
 */
export function getPicklistValuesViewSection(apiData: GetPicklistValuesApiData): FieldInput.MenuSection {
    return {
        name: 'PicklistValues',
        items: (apiData.values || []).map((value) => ({
            ...value,
            label: value.value,
            name: value.value,
            key: value.value,
            iconName: 'tbd',
            iconSize: 'x-small'
        }))
    };
}
