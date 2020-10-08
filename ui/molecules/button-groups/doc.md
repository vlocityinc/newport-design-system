# Button Groups

Button groups are used to bunch together buttons with similar actions

Buttons in a group are surrounded by a parent with the `.nds-button-group` class, unless they are in a list (in which case they use `.nds-button-group-list`. If the last button is an icon, like the down triangle, use the `.nds-button_icon-border-filled` class when accompanying a `.nds-button_neutral` group.

If the last button in a group needs to be wrapped in another element (for example, a drop-down trigger), add the `.nds-button_last` class to the wrapper element to create proper spacing and borders.

## Accessibility

Unless you are using the list version, include the Aria role `role="group"` so that assistive technologies are alerted to the grouping.
