# Datetime Picker

A datetime picker is used to select a day and a time.

## Implementation Notes and Requirements

The datetime picker has the following markup requirements:

**Desktop**
- Add `.nds-is-open` to the element with `.nds-dropdown-trigger` to invoke the dropdown that contains the datepicker and the list of time options.
- On the timepicker, the `.nds-has-focus` modifier class is required on the `.nds-listbox__option` element that has focus.
- On the timpicker, the `.nds-is-selected` modifier class is required on the `.nds-listbox__option` element that has been selected.
- On the datepicker, the `.nds-is-selected` modifier class is required on the `td` element that has the selected day.
- On the datepicker, the `.nds-is-today` modifier class is required on the `td` element that is the current day.

**Mobile**
- When on mobile, we want to leverage the native datetime picker by changing the `input` type from `text` to `datetime-local`
- The `input type="datetime-local"` will create an input field allowing a date and time to be easily entered — this includes year, month, day, hours, and minutes.
- When switching `input type="text"` to `input type="datetime-local"` for mobile, we need to remove the ARIA attributes. The native rendering doesn't require these.
  - On the element with the class `nds-combobox`, please remove `role="combobox"`, `aria-expanded`, and `aria-haspopup.
  - On the `input` that we just added `type="datetime-local"` to, please remove `aria-controls`, `aria-autocomplete`, and `role="textbox"`.
