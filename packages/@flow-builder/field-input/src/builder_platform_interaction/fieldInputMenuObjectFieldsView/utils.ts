/**
 *
 * @param apiData TBD
 * @returns TBD
 */
export function getObjectFieldsViewSections(apiData: GetObjectInfoApiData): FieldInput.MenuSection[] {
    const menuItems: FieldInput.MenuItem[] = Object.values(apiData.fields).map((field) => ({
        ...field,
        type: field.dataType,
        name: field.apiName,
        value: field.apiName,
        viewType: 'None'
    }));

    return [{ items: menuItems, key: 'section-default', label: undefined }];
}
