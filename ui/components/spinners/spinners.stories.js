import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="demo-only" style="height: 9rem;">
  <div role="status" class="nds-spinner nds-spinner_medium">
    <span class="nds-assistive-text">Loading</span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
      </circle>
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
      </circle>
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
      </circle>
    </svg>
  </div>
</div>`);
  })
  .add('Without Container (examples)', () => {
    return withExample(`<div class="demo-only demo--inverse" style="height: 9rem;">
  <div role="status" class="nds-spinner nds-spinner_medium">
    <span class="nds-assistive-text">Loading</span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
      </circle>
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
      </circle>
      <circle cy="50">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
      </circle>
    </svg>
  </div>
</div>`);
  })
  .add('With Container (examples)', () => {
    return withExample(`<div class="demo-only demo--inverse" style="height: 9rem;">
  <div class="nds-spinner_container">
    <div role="status" class="nds-spinner nds-spinner_medium">
      <span class="nds-assistive-text">Loading</span>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
        </circle>
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
        </circle>
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
        </circle>
      </svg>
    </div>
  </div>
</div>`);
  })
  .add('Fixed Container (examples)', () => {
    return withExample(`<div class="demo-only demo--inverse" style="height: 9rem;">
  <div class="nds-spinner_container nds-is-fixed">
    <div role="status" class="nds-spinner nds-spinner_medium">
      <span class="nds-assistive-text">Loading</span>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
        </circle>
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
        </circle>
        <circle cy="50">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
        </circle>
      </svg>
    </div>
  </div>
</div>`);
  });
