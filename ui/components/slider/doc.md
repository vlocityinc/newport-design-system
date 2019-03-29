# Slider

An input range slider lets the user specify a numeric value which must be between two specified values.

The slider component is built using a native input form element with the
attribute type of "range".

## Implementation Notes and Requirements

- `nds-slider` should be applied to the div containing both the `<input>` and the `<span>` that holds the value of the `<input>`
- `nds-slider__range` should be applied to the `<input>` element
  - The `<input>` should have a unique ID that matches the `for` attribute on the form element `<label>`
- The `nds-slider__range` element can accept 4 atrributes that describe the input range:
  -*value**: Current value of the input range
  -*min**: Minimum value of a specified range
  -*max**: Maximum value of a specified range
  -*step**: Indicates the granularity that is expected by limiting the allowed values
- The `nds-slider__value` span should be updated with the current value of the `<input>`
- The `nds-slider__value` element must have `aria-hidden=true` to hide from screen readers as they understand that value already from the `<input>`
- The class `nds-assistive-text` can be placed on the `<label>`, or either `<span>` within the `<label>`, to visually hide the either value (or both).
