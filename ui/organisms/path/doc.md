# Path

A process component communicates to the user the progress of a particular process.

## Accessibility

This component importantly changes role depending on what state it is in. If a Path comes with Stage Coaching information, this pattern lends itself perfectly to being a traditional Tab Set. As you navigate the Path Stages, it&rsquo;s associated content changes with it.

On the other hand, if a Path doesn&rsquo;t have Path Stage Coaching information, we can no longer use the Tab Set role, as we would effectively be misleading our users because each Tab has no associated content. This may lead to users trying to find absent content. In this situation, this component is much more suited to being a Listbox component.

The markup structure is identical, just some attributes change their values.

|  DOM Node        | Without Coaching  | With Coaching  |
|------------------|-------------------|----------------|
| .nds-path__nav  | role="listbox"    | role="tabset"  |
| .nds-path__link | role="option"     | role="tab"     |



**Notable Attributes - Without Coaching**
- `aria-orientation="horizontal"` should be applied to the `nds-path__nav` element to indicate to the screen reader to use horizontal navigation
- `aria-selected="true"` should be applied to the selected Stage of the Path as you navigate through the Stages

**Notable Attributes - With Coaching**
- When the Path Stage Coaching is not visible, `aria-expanded="false"` should be set on each `nds-path__link` Tab
- When the Path Stage Coaching is visible, `aria-expanded` should be set to `true`
- `aria-selected="true"` is used to describe the currently active `nds-path__link` Tab, not the Stage the Path is currently set to

**Keyboard navigation**
- For both with and without Path Stage Coaching variants, the following keyboard navigation applies
- `left` and `right` arrow keys move focus _and_ selection, with `aria-selected="true"`

**Responsive path**
When the Path needs to be placed in a more narrow column on desktop (between 360px and 564px) the class `.nds-region_small` should be placed on the container so it can adapt. If the container is between 565px and 1280px, the class `.nds-region_medium` should be applied.
