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
            label: value.label,
            name: value.value,
            key: value.value,
            iconName: 'utility:text',
            iconSize: 'x-small'
        }))
    };
}
