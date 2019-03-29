# Vertical Tabs

A component that shows groups of content, separated into tabs, and controlled by the tabs.

The Vertical Tabs component serves as a container to show groups of content,
divided into tabs. Each tab label should correspond with a block of related content.
Only one tab's contents are visible at any given time.

This component varies from the regular 'tabs' component, with the tabs arranged
on the left in a vertical space, instead of on the top in a horizontal space.

## Implementation Notes and Requirements

The Tab Component has the following markup requirements:

- The `.nds-is-active` modifier class is required on the `.nds-vertical-tabs__nav-item` element that is active (its content is being shown).
- The `.nds-has-focus` modifier class is required on the `.nds-vertical-tabs__nav-item` element that has focus.
- The `.nds-show` modifier class is required on the `.nds-vertical-tabs__content` element that is being shown (their tab label is selected).
- The `.nds-hide` modifier class is required on all `.nds-vertical-tabs__content` elements that are not being shown (their tab label is not selected).
- The `.nds-truncate` modifier class is optional on `.nds-vertical-tabs__link` elements if single-line truncation is desired for the tab labels.

## Accessibility

Vertical Tabbed UIs have three parts with specific*ARIA** role requirements:

- The tab list, which should have `role="tablist"`
- The tabs in that list, which should each be an `<a role="tab">` anchor wrapped in a `<li role="presentation">` li
- The tab panels, which display each tab's content and should each have `role="tabpanel"`

**Expected markup:**

- Selected tab’s anchor has `aria-selected="true"`, all other tabs’ anchors have `aria-selected="false"`
- Selected tab’s anchor has `tabindex="0"`, all other tabs have `tabindex="-1"`
- Each tab’s anchor has an `aria-controls` attribute whose value is the id of the associated `<div role="tabpanel">`
- Each tab panel has an `aria-labelledby` attribute whose value is the id of its associated `<a role="tab">`

**Expected keyboard interactions:**

- Arrow keys, when focus is on selected tab, cycle selection to the next or previous tab
- Tab key, when focus is before the tab list, moves focus to the selected tab
- Tab key, when focus is on selected tab, moves focus into the selected tab’s associated tab panel or to the next focusable element on the page if that panel has no focusable elements
- Shift+Tab keys, when focus is on first element in a tab panel, move focus to the selected tab
