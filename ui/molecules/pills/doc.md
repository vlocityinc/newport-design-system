# Pills

A pill represents an object that can be viewed with or without an icon

To create a pill, apply the `.nds-pill` class on a `<span>`.

Depending on your context, you will either need a linked pill or a pill option inside of a listbox.

For linked pills, a modifier class of `nds-pill_link` needs to be added to the existing `<span>` with the classname of `nds-pill`. You need an `<a>` inside of the span with the `nds-pill_link` class. The `<a>` will get the classname of `nds-pill__action`. This will treat the interactions differently from an unlinked pill option inside of a listbox.

For both linked pills and unlinked pill options, a `<span>` with the classname of `nds-pill__label` should contain the string of text describing the pill object.

Note, that a linked pill should not be used as a pill option inside of a listbox.

Additionally, a pill can have an icon or image that sits to the left-hand side of the `.nds-pill__label`. That icon or image should receive the class `.nds-pill__icon_container`.

You may also want the functionality to remove the pill as a selection. An "X" icon is normally used and will sit to the right-hand side of the `.nds-pill__label`. That icon should receive the class `.nds-pill__remove`.

A `.nds-pill_container` can be used as a visual container for multiple pill(s).
