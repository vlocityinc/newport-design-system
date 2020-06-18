import { LightningElement, api } from 'lwc';
import { LABELS } from './welcomeMatBodyLabels';

export default class WelcomeMatBody extends LightningElement {
    @api processType;
    @api triggerType;
    @api createCallback;
    @api closeCallback;

    get labels() {
        return LABELS;
    }

    get freeformFeatureList() {
        return [
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.freeFormSupportedFeatureOne,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.freeFormSupportedFeatureTwo,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.freeFormSupportedFeatureThree,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.freeFormSupportedFeatureFour,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.freeFormUnsupportedFeatureOne,
                title: this.labels.unsupportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.freeFormUnsupportedFeatureTwo,
                title: this.labels.unsupportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.freeFormUnsupportedFeatureThree,
                title: this.labels.unsupportedFeatureTitle
            }
        ];
    }

    get autoFeatureList() {
        return [
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.autoLayoutSupportedFeatureOne,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.autoLayoutSupportedFeatureTwo,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.autoLayoutSupportedFeatureThree,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.supportedFeatureAltText,
                iconName: 'utility:check',
                iconVariant: 'success',
                label: this.labels.autoLayoutSupportedFeatureFour,
                title: this.labels.supportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.autoLayoutUnsupportedFeatureOne,
                title: this.labels.unsupportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.autoLayoutUnsupportedFeatureTwo,
                title: this.labels.unsupportedFeatureTitle
            },
            {
                altText: this.labels.unsupportedFeatureAltText,
                iconName: 'utility:close',
                iconVariant: 'error',
                label: this.labels.autoLayoutUnsupportedFeatureThree,
                title: this.labels.unsupportedFeatureTitle
            }
        ];
    }

    createFreeFormCanvas = () => {
        this.createCallback(this.processType, this.triggerType, false);
        this.closeCallback();
    };

    createAutoLayoutCanvas = () => {
        this.createCallback(this.processType, this.triggerType, true);
        this.closeCallback();
    };
}
