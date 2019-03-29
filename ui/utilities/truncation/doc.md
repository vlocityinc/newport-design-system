# Truncation

When applying truncation, place the full text in a title attribute so that it’s accessible on&nbsp;hover.

If problems occur when using truncation with elements that use flexbox, you might need to add the `.nds-has-flexi-truncate` class on the flexbox child node ( `.nds-col` or `.nds-col_padded` elements) that contains the truncated text.

**Note:** There is an iOS bug that is triggered when you add a component from Visualforce into S1 using an iFrame. The truncated element does not recognize its width.
