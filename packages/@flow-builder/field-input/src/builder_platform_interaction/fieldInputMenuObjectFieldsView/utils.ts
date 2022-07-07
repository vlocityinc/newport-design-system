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
        iconName: 'tbd',
        iconSize: 'x-small'
    }));

    return [{ items: menuItems, name: 'ObjectFields', label: undefined }];
}
