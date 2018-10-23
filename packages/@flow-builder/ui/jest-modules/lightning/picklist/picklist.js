/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning picklist component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 218
 */
export default class LightningPicklist extends LightningElement {
    @api label;
    @api options;
    @api value;
    @api fieldLevelHelp;
    @api required;

}