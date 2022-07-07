export const publish = () => {};

export const subscribe = () => {
    return {
        unsubscribe: () => {}
    };
};

export const showPrompt = () => {};

export const showPrompt2 = () => {};

export const getCSPTrustedSites = () => {
    return Promise.resolve(['https://trustedSite.com']);
};

export const canDisplayJustOnce = () => Promise.resolve(true);
export const canDisplayMultipleTimes = () => Promise.resolve(true);
export const airgapify = (url) => url;

export class Prompt {
    constructor(id, type, pznFeatureKey, pznPromptKey, componentDef, componentDefAttributes, family) {
        this.id = id;
        this.type = type;
        this.pznFeatureKey = pznFeatureKey;
        this.pznPromptKey = pznPromptKey;
        this.componentDef = componentDef;
        this.family = family;
        this.setComponentDefAttributes(componentDefAttributes);
    }
    canDisplay() {
        return Promise.resolve(true);
    }
    onCreate() {}
    onDisplay() {}
    onDestroy() {}
    setComponentDefAttributes(attrs) {
        this.componentDefAttributes = attrs || {};
    }
}
export class DockedComposer extends Prompt {
    constructor(id, pznFeatureKey, pznPromptKey, componentDefAttributes, family) {
        super(
            id,
            'dockedComposer',
            pznFeatureKey,
            pznPromptKey,
            'force:featureDiscoveryDocked',
            componentDefAttributes,
            family
        );
    }
}
export class FloatingPanel extends Prompt {
    constructor(id, pznFeatureKey, pznPromptKey, componentDefAttributes, family) {
        super(id, 'overlay', pznFeatureKey, pznPromptKey, 'one:floatingPanelPrompt', componentDefAttributes, family);
    }
}
export class Modal extends Prompt {
    constructor(
        id,
        pznFeatureKey,
        pznPromptKey,
        componentDef = 'one:featureDiscoveryModal',
        componentDefAttributes,
        family
    ) {
        super(id, 'modal', pznFeatureKey, pznPromptKey, componentDef, componentDefAttributes, family);
    }
}
export class Popover extends Prompt {
    constructor(id, pznFeatureKey, pznPromptKey, componentDefAttributes, family) {
        super(
            id,
            'popover',
            pznFeatureKey,
            pznPromptKey,
            'force:userAssistancePopovers',
            componentDefAttributes,
            family
        );
    }
}
export class Walkthrough extends Prompt {
    constructor(id, pznFeatureKey, pznPromptKey, componentDefAttributes, family) {
        super(
            id,
            'walkthrough',
            pznFeatureKey,
            pznPromptKey,
            'runtime_all_walkthroughs:orchestrationPlayerPrompt',
            componentDefAttributes,
            family
        );
    }
}
export class SingleUseFloatingPanel extends FloatingPanel {
    canDisplay(pageRef, pznHelper) {
        return canDisplayJustOnce(this.id, pznHelper, this.pznFeatureKey, this.pznPromptKey);
    }
}
export class SingleUsePopover extends Popover {
    canDisplay(pageRef, pznHelper) {
        return canDisplayJustOnce(this.id, pznHelper, this.pznFeatureKey, this.pznPromptKey).then((result) => {
            if (!result) {
                return false;
            }

            return super.canDisplay(pageRef, pznHelper);
        });
    }
}

export class PromptRegistration {
    constructor(id, classDefinition, constructorArgs) {
        this.id = id;
        this.classDefinition = classDefinition;
        this.constructorArgs = constructorArgs || [];
    }
}

export const PromptTypes = {
    isValid: () => true
};
