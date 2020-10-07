import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import { withKnobs, radios } from '@storybook/addon-knobs';
import {
    withExample,
    withDocs,
    commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

const label = 'Open Sections';
const options = {
    None: '',
    One: 'One',
    Two: 'Two',
    Three: 'Three'
};
const defaultValue = '';

storiesOf(`${base}`, module)
    .addDecorator(withKnobs)
    .addDecorator(commentToHTML(scss))
    .addDecorator(withDocs(notes))
    .add('Default', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero nds-hero-large" alt="Cityscape" src="assets/images/communities/cityscape.svg"
    title="Community Hero"/>
    <img class="nds-hero nds-hero-small" alt="Cityscape" src="assets/images/communities/cityscape-mobile.svg"
    title="Community Hero"/></div>`);
    })
    .add('Claims Details', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero nds-hero-large" alt="Small Community" src="assets/images/communities/smallcommunity.svg" title="Claims"/>
        <img class="nds-hero nds-hero-small" alt="Small Community" src="assets/images/communities/smallcommunity-mobile.svg" title="Claims"/></div>`);
    })
    .add('Billing', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero nds-hero-large" alt="Billing" src="assets/images/communities/billing.svg" title="Billing"/>
        <img class="nds-hero nds-hero-small" alt="Billing" src="assets/images/communities/billing-mobile.svg" title="Billing"/></div>`);
    })
    .add('Multiline Shopper Page', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero" alt="Cityscape Image" src="assets/images/communities/cityscape2.svg"
        title="Cityscape"/></div>`);
    })
    .add('Multiline Shopper Overview', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero" alt="Cityscape Image" src="assets/images/communities/cityscape3.svg"
            title="Cityscape"/></div>`);
    })
    .add('Multiline Shopper Page', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero nds-hero-large" alt="Shopper Image" src="assets/images/communities/shopper.svg"
            title="Community Hero"/><img class="nds-hero nds-hero-small" alt="Shopper Image" src="assets/images/communities/shopper-mobile.svg"
            title="Community Hero"/></div>`);
    })
    .add('Multiline Overview', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero" alt="Shopper" src="assets/images/communities/multilineoverview.svg"
            title="Shopper"/></div>`);
    })
    .add('Multiline Details', () => {
        const value = radios(label, options, defaultValue);
        return withExample(`<div class="nds-hero-container"><img class="nds-hero nds-hero-large" alt="Auto" src="assets/images/communities/autohero.svg"
            title="Auto"/><img class="nds-hero nds-hero-small" alt="Auto" src="assets/images/communities/autohero-mobile.svg"
            title="Auto"/></div>`);
    });