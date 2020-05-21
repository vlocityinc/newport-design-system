// @ts-nocheck
export const mockRegistryAddDataProvider = jest.fn();
export const mockRegistryRegisterRules = jest.fn();

export class Registry {
    addDataProvider = mockRegistryAddDataProvider;
    registerRules = mockRegistryRegisterRules;
}

export class RuleFilterBasic {}

export const mockEngineExecute = jest.fn();
export class Engine {
    execute = mockEngineExecute;
}
