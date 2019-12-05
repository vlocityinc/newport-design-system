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
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
        0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
        0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" disabled="" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Value 0 (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="0">
      <span class="nds-slider__value" aria-hidden="true">0</span>
    </div>
  </div>
</div>`);
  })
  .add('Value 25 (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="25">
      <span class="nds-slider__value" aria-hidden="true">25</span>
    </div>
  </div>
</div>`);
  })
  .add('Value 50 (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Value 75 (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="75">
      <span class="nds-slider__value" aria-hidden="true">75</span>
    </div>
  </div>
</div>`);
  })
  .add('Value 100 (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="100">
      <span class="nds-slider__value" aria-hidden="true">100</span>
    </div>
  </div>
</div>`);
  })
  .add('Min Max (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
        0 - 400
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" min="0" max="400" id="slider-id-01" class="nds-slider__range" value="200">
      <span class="nds-slider__value" aria-hidden="true">200</span>
    </div>
  </div>
</div>`);
  })
  .add('Steps (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 400
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider">
      <input type="range" step="100" min="0" max="400" id="slider-id-01" class="nds-slider__range" value="200">
      <span class="nds-slider__value" aria-hidden="true">200</span>
    </div>
  </div>
</div>`);
  })
  .add('Width X Small (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider nds-size_x-small">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Width Small (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider nds-size_small">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Width Medium (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider nds-size_medium">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Width Large (examples)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider nds-size_large">
      <input type="range" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
  </div>
</div>`);
  })
  .add('Error (examples)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <label class="nds-form-element__label" for="slider-id-01">
    <span class="nds-slider-label">
      <span class="nds-slider-label__label nds-slider-label__span">Slider Label</span>
      <span class="nds-slider-label__range nds-slider-label__span">
      0 - 100
      </span>
    </span>
  </label>
  <div class="nds-form-element__control">
    <div class="nds-slider nds-size_large">
      <input type="range" aria-describedby="error-message" id="slider-id-01" class="nds-slider__range" value="50">
      <span class="nds-slider__value" aria-hidden="true">50</span>
    </div>
    <div id="error-message" class="nds-form-element__help">There is a problem with this field</div>
  </div>
</div>`);
  });
