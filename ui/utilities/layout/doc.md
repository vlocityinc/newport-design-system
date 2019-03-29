# Layout

Layout utility classes will help you to achieve various common layouts.

## Magnets

The magnet utilities are used to vertically attach adjacent card-like components.

The components/utilities that provide a card-like look are the following:

* [Cards](/components/cards/)
* [Page Headers](/components/page-headers)
* [Box](/utilities/box)

If you need a card-like component to appear flush to the card-like component below, you can add the classes  `nds-has-bottom-magnet` and `nds-has-top-magnet`.

```html
<div className="nds-grid nds-grid_pull-padded">
  <div className="nds-col nds-p-horizontal_medium">
    <strong>Before</strong>
    <CodeView>
      <div className="nds-card">
        <div className="nds-p-around_medium">My First Component</div>
      </div>
      <div className="nds-card">
        <div className="nds-p-around_medium">My Second Component</div>
      </div>
    </CodeView>
  </div>
  <div className="nds-col nds-p-horizontal_medium">
    <strong>After</strong>
    <CodeView>
      <div className="nds-card nds-has-bottom-magnet">
        <div className="nds-p-around_medium">My First Component</div>
      </div>
      <div className="nds-card nds-has-top-magnet">
        <div className="nds-p-around_medium">My Second Component</div>
      </div>
    </CodeView>
  </div>
</div>
```

In the after example, you'll notice the component's top and bottom side are flattened out and appear connected.
