# Menus

A Menu offers a list of actions or functions that a user can access.

The unordered menu list with `[role="menu"]` should be contained in a `<div>`
with the class `.nds-dropdown`. The exception to this is the*Action
Overflow for Touch**, which not a dropdown menu.

The target HTML element and dropdown need to be wrapped in the class `.nds-dropdown-trigger dropdown-trigger_click`.

By default, dropdown menus do not display a nubbin (the little cute triangle
pointing at your target). If you want to apply one, you can add the class
that defines the nubbin position and `.nds-nubbin_top` to the `.nds-dropdown`
HTML element.

Positioning helpers allow the developer to position a dropdown menu. The default location is **top** and **center**. When the dropdown is activated, it is at the center base of the target and expands down.

A dropdown may also be positioned with the bottom above its target using `nds-dropdown_bottom`. Horizontal modifiers can be added to either top or bottom positioned dropdowns using `nds-dropdown_left` or `nds-dropdown_right`.

## Accessibility

The main thing that distinguishes menus from other popover blocks is keyboard
navigation: elsewhere, users press the Tab key to navigate through actionable
items, but in a menu, users press the arrow keys to navigate.

**Expected markup:**

- Menu trigger is a focusable element (`<a>` or `<button>`) with `aria-haspopup="true"`
- Menu has `role="menu"` and an `aria-labelledby` attribute whose value is the id of the menu trigger
- Menu items have `role="menuitem"`, `role="menuitemcheckbox"`, or `role="menuitemradio"`

**Expected keyboard interactions:**

- Arrow keys cycle focus through menu items (you should use JS to disable focus for any disabled items)
- Tab key closes menu and moves focus to the next focusable element on the page
- Esc key closes menu and moves focus back to the menu trigger
- Any character key moves focus to the next menu item that starts with that character, if applicable
