# Breadcrumbs

Use breadcrumbs to note the path of a record and help the user to navigate back to the parent.

Breadcrumbs are typically constructed with an `ol` because their order
matters. You mark up breadcrumbs with classes from the horizontal list
utility. When you add the `.nds-breadcrumb` class, the separators are
automatically generated.

## Accessibility

Place the breadcrumb in a `nav` element with `role="navigation"`.
The `nav` element is also marked-up with `aria-label="Breadcrumbs"` to
describe the type of navigation.
