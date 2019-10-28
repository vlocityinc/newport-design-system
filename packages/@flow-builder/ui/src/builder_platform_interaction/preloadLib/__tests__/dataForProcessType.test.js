import { setPeripheralDataForPropertyEditor } from '../dataForProcessType';

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        setRules: jest.fn(),
        setOperators: jest.fn()
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        setEventTypes: jest.fn(),
        setEntities: jest.fn()
    };
});

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    return {
        setResourceTypes: jest.fn(),
        FEROV_DATA_TYPE: {},
        FLOW_DATA_TYPE: {
            APEX: '',
            SOBJECT: ''
        }
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        setProcessTypes: jest.fn(),
        setGlobalVariables: jest.fn(),
        setSystemVariables: jest.fn(),
        setSupportedFeatures: jest.fn()
    };
});

describe('setPeripheralDataForPropertyEditor function', () => {
    const {
        setRules,
        setOperators
    } = require('builder_platform_interaction/ruleLib');
    const {
        setResourceTypes
    } = require('builder_platform_interaction/dataTypeLib');
    const {
        setEntities,
        setEventTypes
    } = require('builder_platform_interaction/sobjectLib');
    const {
        setGlobalVariables,
        setSystemVariables
    } = require('builder_platform_interaction/systemLib');

    const rules = [
        {
            ruleType: 'assignment'
        }
    ];
    const operators = {};
    const resourceTypes = {};
    const eventTypes = {};
    const globalVariables = {};
    const systemVariables = [
        {
            devName: 'CurrentDate'
        }
    ];
    const entities = [
        {
            fields: null
        }
    ];

    beforeEach(() => {
        setPeripheralDataForPropertyEditor({
            rules,
            operators,
            resourceTypes,
            eventTypes,
            globalVariables,
            systemVariables,
            entities
        });
    });

    it('setRules has been called', () => {
        expect(setRules).toHaveBeenCalled();
    });

    it('setOperators has been called', () => {
        expect(setOperators).toHaveBeenCalled();
    });

    it('setResourceTypes has been called', () => {
        expect(setResourceTypes).toHaveBeenCalled();
    });

    it('setEventTypes has been called', () => {
        expect(setEventTypes).toHaveBeenCalled();
    });

    it('setGlobalVariables has been called', () => {
        expect(setGlobalVariables).toHaveBeenCalled();
    });

    it('setSystemVariables has been called', () => {
        expect(setSystemVariables).toHaveBeenCalled();
    });

    it('setEntities has been called', () => {
        expect(setEntities).toHaveBeenCalled();
    });
});
