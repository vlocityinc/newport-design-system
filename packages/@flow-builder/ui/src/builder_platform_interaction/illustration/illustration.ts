import { api, LightningElement } from 'lwc';

const ILLUSTRATION = {
    GONE_CAMPING: 'goneCamping',
    LAKE_MOUNTAIN: 'lakeMountain'
};

/**
 * See illustration https://www.lightningdesignsystem.com/components/illustration/
 */
export default class Illustration extends LightningElement {
    @api
    title = '';
    @api
    body = '';
    @api
    illustration = '';

    @api
    get isGoneCampingIllustration() {
        return this.illustration === ILLUSTRATION.GONE_CAMPING;
    }

    @api
    get isLakeMountainIllustration() {
        return this.illustration === ILLUSTRATION.LAKE_MOUNTAIN;
    }
}
