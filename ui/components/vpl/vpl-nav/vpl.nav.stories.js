import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-subnav__wrapper">
  <div class="nds-grid nds-subnav__inner cards-container nds-grid_vertical-stretch np-subnav-dropdown">
    <a class="nds-subnav__theme nds-subnav__overview-card">
      <section class="nds-subnav__active nds-subnav__overview nds-subnav__tabSelected">
        <div class="nds-subnav__cardtop nds-text-align_center">
          <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
            <img src="/assets/images/VPL/speedometer.svg">
          </div>
          <div class="nds-subnav__cardValues">
            <h2>Overview</h2>
          </div>
        </div>
      </section>
    </a>
    <div class="nds-subnav__fullWidth nds-scrollable_x">
      <div class="nds-grid">
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/auto.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Auto Policy</h2>
              </div>
            </div>
          </section>
        </div>
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/owned.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Business Owners Policy</h2>
              </div>
            </div>
          </section>
        </div>
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/rent.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Renters Policy</h2>
              </div>
            </div>
          </section>
        </div>
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/general_insurance.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Pet Policy</h2>
              </div>
            </div>
          </section>
        </div>
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/life-policy.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Boat Owners</h2>
              </div>
            </div>
          </section>
        </div>
        <div class="nds-subnav__theme">
          <section class="nds-subnav__active nds-subnav__tabNotSelected">
            <div class="nds-text-align_center">
              <div class="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                <img src="/assets/images/VPL/home.svg">
              </div>
              <div class="nds-subnav__cardValues">
                <h2>Add Home Owners</h2>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</div>`);
  });
