import { generateGuid } from 'builder_platform_interaction-store-lib';
import { mutateScreenField } from 'builder_platform_interaction-data-mutation-lib';

export function createEmptyScreenNode() {
    return {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        description: '',
        elementType: 'SCREEN',
        helpText: '',
        label: '',
        name: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        rules: [],
        fields: []
    };
}

export function createEmptyNodeOfType(type) {
    return mutateScreenField({
        guid:generateGuid(),
        isRequired: false,
        helpText: null,
        defaultValue:null,
        dataType: type.dataType,
        name: '',
        choiceReferences: [],
        defaultSelectedChoiceReference: null,
        fieldType: type.fieldType,
        inputParameters: [],
        fieldText: null,
        label: null,
        outputParameters: []
    });
}
