export const getExpectedMapItems = (outputFields, inputFields, currentItemGuid) => {
    const expectedMapItems: any[] = [];
    Object.keys(outputFields).forEach((contractField) => {
        const contractValue = outputFields[contractField];
        if (contractValue.creatable && contractValue.required) {
            const found = Object.keys(inputFields).find((inputKey) => inputKey === contractField);
            expectedMapItems.push({
                leftHandSide: { value: 'Contract.' + contractField, error: null },
                operator: { value: 'Assign', error: null },
                rightHandSide: { value: found ? currentItemGuid + '.' + contractField : '', error: null },
                rightHandSideDataType: { value: found ? 'reference' : '', error: null }
            });
        }
    });
    return expectedMapItems;
};
