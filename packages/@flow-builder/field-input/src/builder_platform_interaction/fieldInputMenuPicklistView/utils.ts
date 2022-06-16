/**
 *
 * @param apiData TBD
 * @returns TBD
 */
export function getPicklistViewSection(apiData: GetPicklistValuesApiData): FieldInput.MenuSection {
    return {
        key: 'section-default',
        items: (apiData.values || []).map((value) => ({
            ...value,
            label: value.value,
            name: value.value,
            key: value.value
        }))
    };
}
