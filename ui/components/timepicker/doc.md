# Timepicker

A timepicker is an autocomplete text input to capture a time.

#### Implementation Notes and Requirements

The timepicker has the following markup requirements:

**Desktop**
- Add `.nds-is-open` to the element with `.nds-dropdown-trigger` to invoke the dropdown that contains the list of time options.
- The `.nds-has-focus` modifier class is required on the `.nds-listbox__option` element that has focus.
- The `.nds-is-selected` modifier class is required on the `.nds-listbox__option` element that has been selected.

**Mobile**
- When on mobile, we want to leverage the native timepicker by changing the `input` type from `text` to `time`
- When switching `input type="text"` to `input type="time"` for mobile, we need to remove the ARIA attributes. The native rendering doesn't require these.
  - On the element with the class `nds-combobox`, please remove `role="combobox"`, `aria-expanded`, and `aria-haspopup`.
  - On the `input` that we just added `type="time"` too, please remove `aria-controls`, `aria-autocomplete`, and `role="textbox"`.

#### Accessibility

Please follow the implementation guildelines found under [Combobox](/components/combobox)
