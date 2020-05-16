// @ts-nocheck
export class ContextDataProvider {}
export class RuleFactory {}
export class RuleFactoryItem {}
export class Rule {}

export class ContextInfo {
    constructor(context, scope, additionalDataContexts) {
        this._context = context;
        this._scope = scope;
        this.additionalDataContexts = additionalDataContexts;
    }
}

export class Meta {
    constructor(contextInfo, name, title, description, owner, rule, tags, scaleInfos) {
        this._contextInfo = contextInfo;
        this._name = name;
        this._title = title;
        this._description = description;
        this._owner = owner;
        this._rule = rule;
        this._tags = tags ? tags : [];
        this._scaleInfos = scaleInfos;
    }
}
export class Data {
    constructor(id, children) {
        this.id = id;
        this.children = children;
    }
}

export class Result {
    constructor(data, messageParams, scaleValues) {
        this.data = data;
        this.messageParams = messageParams;
        this.scaleValues = scaleValues;
    }
}
