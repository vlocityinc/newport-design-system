/**
 *
 * @param apiData TBD
 * @returns TBD
 */
export function getObjectFieldsViewSections(apiData: GetObjectInfoApiData): FieldInput.MenuSection[] {
    const menuItems: FieldInput.MenuItem[] = Object.values(apiData.fields).map((field) => ({
        ...field,
        view:
            field.dataType === 'Picklist'
                ? {
                      type: 'PicklistValues',
                      fieldApiName: `${field.sobjectName}.${field.apiName}`,
                      recordTypeId: 'dummy'
                  } // recordTypeId can't be retrieved until we switch to UI-API
                : undefined,
        type: field.dataType,
        name: field.apiName,
        value: field.apiName,
        iconName: field.dataType === 'Picklist' ? 'utility:picklist_type' : 'utility:text',
        iconSize: 'x-small'
    }));

    return [{ items: menuItems, name: 'ObjectFields', label: undefined }];
}
