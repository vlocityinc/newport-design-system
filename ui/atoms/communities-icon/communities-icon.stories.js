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
return withExample(`<img class="nds-icon nds-icon_x-large" alt="auto" src="./assets/images/communities/auto.svg"
    title="Auto" />`);
})
.add('Icon With Background', () => {
const value = radios(label, options, defaultValue);
return withExample(`
<img class="nds-icon nds-icon_x-large nds-is-absolute" alt="auto" src="./assets/images/communities/auto.svg"
    title="Auto" />
<img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg" title="Ellipse" />`);
})
.add('All Icons', () => {
const value = radios(label, options, defaultValue);
return withExample(`
<p>Sizes:</p>
<p>
    small:
    <img class="nds-icon nds-icon_small" alt="auto" src="./assets/images/communities/auto.svg" title="Auto" />
    medium:
    <img class="nds-icon nds-icon_medium" alt="auto" src="./assets/images/communities/auto.svg" title="Auto" />
    large:
    <img class="nds-icon nds-icon_large" alt="auto" src="./assets/images/communities/auto.svg" title="Auto" />
    x-large:
    <img class="nds-icon nds-icon_x-large" alt="auto" src="./assets/images/communities/auto.svg" title="Auto" />
</p>
<div class="nds-grid nds-wrap nds-size_1-of-1">
    <div class="nds-size_1-of-1">Other icons:</div>
    <div class="nds-size_2-of-3">
        <img class="nds-icon nds-icon_x-large" alt="auto" src="./assets/images/communities/auto.svg" title="Auto" />
        <img class="nds-icon nds-icon_x-large" alt="barn" src="./assets/images/communities/barn.svg" title="Barn" />
        <img class="nds-icon nds-icon_x-large" alt="boat" src="./assets/images/communities/boat.svg" title="Boat" />
        <img class="nds-icon nds-icon_x-large" alt="claim" src="./assets/images/communities/claim.svg" title="Claim" />
        <img class="nds-icon nds-icon_x-large" alt="computer" src="./assets/images/communities/computer.svg"
            title="Computer" />
        <img class="nds-icon nds-icon_x-large" alt="creditcard" src="./assets/images/communities/creditcard.svg"
            title="Credit Card" />
        <img class="nds-icon nds-icon_x-large" alt="denied" src="./assets/images/communities/denied.svg" title="Denied" />
        <img class="nds-icon nds-icon_x-large" alt="files" src="./assets/images/communities/files.svg" title="Files" />
        <img class="nds-icon nds-icon_x-large" alt="flooding" src="./assets/images/communities/flooding.svg"
            title="Flooding" />
        <img class="nds-icon nds-icon_x-large" alt="glass" src="./assets/images/communities/glass.svg" title="Glass" />
        <img class="nds-icon nds-icon_x-large" alt="health" src="./assets/images/communities/health.svg" title="Health" />
        <img class="nds-icon nds-icon_x-large" alt="homeowners" src="./assets/images/communities/homeowners.svg"
            title="Homeowners" />
        <img class="nds-icon nds-icon_x-large" alt="images" src="./assets/images/communities/images.svg" title="Images" />
        <img class="nds-icon nds-icon_x-large" alt="incident" src="./assets/images/communities/incident.svg"
            title="incident" />
        <img class="nds-icon nds-icon_x-large" alt="jewelry" src="./assets/images/communities/jewelry.svg"
            title="jewelry" />
        <img class="nds-icon nds-icon_x-large" alt="message" src="./assets/images/communities/message.svg"
            title="message" />
        <img class="nds-icon nds-icon_x-large" alt="raft" src="./assets/images/communities/raft.svg" title="raft" />
        <img class="nds-icon nds-icon_x-large" alt="shield" src="./assets/images/communities/shield.svg" title="shield" />
        <img class="nds-icon nds-icon_x-large" alt="signature" src="./assets/images/communities/signature.svg"
            title="signature" />
        <img class="nds-icon nds-icon_x-large" alt="steeringwheel" src="./assets/images/communities/steeringwheel.svg"
            title="steeringwheel" />
        <img class="nds-icon nds-icon_x-large" alt="stethoscope" src="./assets/images/communities/stethoscope.svg"
            title="stethoscope" />
        <img class="nds-icon nds-icon_x-large" alt="success" src="./assets/images/communities/success.svg"
            title="success" />
        <img class="nds-icon nds-icon_x-large" alt="syringe" src="./assets/images/communities/syringe.svg"
            title="syringe" />
        <img class="nds-icon nds-icon_x-large" alt="tooth" src="./assets/images/communities/tooth.svg" title="tooth" />
        <img class="nds-icon nds-icon_x-large" alt="toothbrush" src="./assets/images/communities/toothbrush.svg"
            title="toothbrush" />
        <img class="nds-icon nds-icon_x-large" alt="umbrella" src="./assets/images/communities/umbrella.svg"
            title="umbrella" />
        <img class="nds-icon nds-icon_x-large" alt="vision" src="./assets/images/communities/vision.svg" title="vision" />
    </div>
    <div class="nds-size_1-of-1">Icons with background</div>
    <div class="nds-size_2-of-3 nds-grid nds-wrap">
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="auto" src="./assets/images/communities/auto.svg"
                title="Auto" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="barn" src="./assets/images/communities/barn.svg"
                title="Barn" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="boat" src="./assets/images/communities/boat.svg"
                title="Boat" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="claim" src="./assets/images/communities/claim.svg"
                title="Claim" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="computer"
                src="./assets/images/communities/computer.svg" title="Computer" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="creditcard"
                src="./assets/images/communities/creditcard.svg" title="Credit Card" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="denied"
                src="./assets/images/communities/denied.svg" title="Denied" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="files" src="./assets/images/communities/files.svg"
                title="Files" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="flooding"
                src="./assets/images/communities/flooding.svg" title="Flooding" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="glass" src="./assets/images/communities/glass.svg"
                title="Glass" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="health"
                src="./assets/images/communities/health.svg" title="Health" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="images"
                src="./assets/images/communities/images.svg" title="Images" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="homeowners"
                src="./assets/images/communities/homeowners.svg" title="Homeowners" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="incident"
                src="./assets/images/communities/incident.svg" title="incident" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="jewelry"
                src="./assets/images/communities/jewelry.svg" title="jewelry" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="message"
                src="./assets/images/communities/message.svg" title="message" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="raft" src="./assets/images/communities/raft.svg"
                title="raft" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="shield"
                src="./assets/images/communities/shield.svg" title="shield" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="signature"
                src="./assets/images/communities/signature.svg" title="signature" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="steeringwheel"
                src="./assets/images/communities/steeringwheel.svg" title="steeringwheel" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="stethoscope"
                src="./assets/images/communities/stethoscope.svg" title="stethoscope" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="success"
                src="./assets/images/communities/success.svg" title="success" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="syringe"
                src="./assets/images/communities/syringe.svg" title="syringe" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="tooth" src="./assets/images/communities/tooth.svg"
                title="tooth" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="toothbrush"
                src="./assets/images/communities/toothbrush.svg" title="toothbrush" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="umbrella"
                src="./assets/images/communities/umbrella.svg" title="umbrella" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>

        <div class="nds-size_1-of-12">
            <img class="nds-icon nds-icon_x-large nds-is-absolute" alt="vision"
                src="./assets/images/communities/vision.svg" title="vision" />
            <img class="nds-icon nds-icon_x-large" alt="ellipse" src="./assets/images/communities/ellipse.svg"
                title="Ellipse" />
        </div>
    </div>
</div>`);
});