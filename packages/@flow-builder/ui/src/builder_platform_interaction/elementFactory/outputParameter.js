export function createOutputParameter(outputParameter = {}) {
    const { name, assignToReference } = outputParameter;

    return Object.assign({}, { name, assignToReference });
}

export function createOutputParameterMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('outputParameter is not defined');
    }

    return createOutputParameter(outputParameter);
}