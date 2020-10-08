# Spinner

Spinners are CSS loading indicators that should be shown when retrieving data or performing slow computations. In some cases, the first time a parent component loads, a stencil is preferred to indicate network activity.

To use the spinner in a component, the parent of the spinner should be set to `position:relative`. You can use the utility class `.nds-is-relative` or add the declaration to your custom component CSS. If you are using the spinner in an `iframe` and dynamically loading DOM nodes after the page has loaded, it is recommended that you set the `.nds-spinner_container` to `position:fixed` so that it remains centered in the viewport.

The background overlay for the spinner is an optional element.

#### Accessibility

A spinner should have the Aria `role="status"` and contain assistive text that explains what is currently happening.
