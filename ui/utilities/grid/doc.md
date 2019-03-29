# Grid

The NDS grid, based on Flexbox, provides a flexible, mobile-first, device-agnostic scaffolding system. It includes helper classes that you can use to alter the look and behavior of your grid, such as alignment, order, flow, and padding helpers.

## Grid Wrapper

To use the grid system, add the class `nds-grid` to an element, component, or page layout. Each grid is independent of other nested grids. You can limit attributes of each grid to specific regions in the app. A grid style is <em>not</em> an all or nothing solution.

Adding the class `nds-wrap` causes the flow of your `nds-col` elements to wrap when they exceed 100% of their parent’s width.

You can easily change the flow direction of your grid by adding a modifier class to the `nds-grid` element. To stack your columns vertically instead of their default row behavior, use `nds-grid--vertical`. You can also reverse the left to right behavior by adding `nds-grid--reverse` or top to bottom by adding `nds-grid--vertical-reverse`.

If you want your application to fill 100% of the width and height of the viewport and nest other grids inside, use the top-level app helper class `nds-grid--frame`. An assortment of `nds-container` classes are available to contain your grids.

## Grid Items (Regions/Colums)

When you add the class `nds-col` to the grid items, no padding or gutters are added. They are simply divisions of their parent. If you want gutters, add one of the spacing utility classes such as `nds-p-horizontal--small`, `nds-p-horizontal--medium`, `nds-p-horizontal--large`, `nds-p-around--small`, `nds-p-around--medium` or `nds-p-around--large`. These will add different sized gutters to the left and right side of your column.

By default, the width of each column within a grid row is determined by the content within. Though this automatic sizing allows you to achieve most desired outcomes, you can add manual <a href="/components/utilities/sizing/">sizing classes</a> to the columns if you need specific column widths.

Using the manual sizing class helpers, you can specify a column span across the following grids &ndash;2, 3, 4, 5, 6, 7, 8 and 12. The grid supports up to 12 columns.

## Visual Glossary of Terminology

![](/assets/images/grid/grid-flex-diagram.svg)
