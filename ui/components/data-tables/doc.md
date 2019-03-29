# Data Tables

Data tables are an enhanced version of an HTML table and are used to display tabular data.

To initialize a data table, apply the `nds-table` class to the
`table` element. This class creates a `table`
with formatted cells and allows you to use data table utilities.

## Accessibility
To create an accessible table, the top row of column headers (`th`)
are placed in a `thead`. Each one receives the `scope="col"`
attribute. The first non-actionable (meaning that doesn't contain a checkbox
or menu) column in each row should be marked as a `th` with a
`scope="row"` attribute.
