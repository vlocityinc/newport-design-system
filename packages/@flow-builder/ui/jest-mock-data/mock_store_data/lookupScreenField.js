// @ts-nocheck
export default {
    guid: '01c85adf-a224-43ce-a6af-72d999808aad',
    name: 'lookupScreenField',
    choiceReferences: [],
    dataType: 'LightningComponentOutput',
    defaultValue: '',
    defaultValueIndex: '9ba13d3e-c4ee-4b47-ad29-a56e501889de',
    validationRule: { formulaExpression: null, errorMessage: null },
    extensionName: 'c:lookup',
    fieldType: 'ComponentInstance',
    fieldText: '',
    helpText: '',
    inputParameters: [],
    isNewField: false,
    isRequired: true,
    outputParameters: [],
    scale: '0',
    type: {
        name: 'c:lookup',
        fieldType: 'ComponentInstance',
        genericTypes: [
            {
                description: 'Select the api name of the SObject this component is going to be looking for',
                fieldsToNull: [],
                label: 'Object API Name',
                name: 'T',
                superType: 'SOBJECT'
            }
        ],
        label: 'LWC Record Picker',
        icon: 'standard:lightning_component',
        category: 'Custom',
        description: 'A raptor recored picker',
        source: 'server'
    },
    elementType: 'SCREEN_FIELD',
    visibilityRule: {
        conditions: [],
        conditionLogic: 'no_conditions'
    },
    dynamicTypeMappings: [
        {
            typeName: 'T',
            typeValue: 'Asset'
        }
    ],
    storeOutputAutomatically: true
};
