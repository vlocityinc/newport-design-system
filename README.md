# Vlocity Newport Design System

Welcome to the [Vlocity Newport Design System] brought to you by [Vlocity](https://vlocity.com).

* Tailored for building Vlocity Newport apps: Using the Newport Design System markup and CSS framework results in UIs that reflect the Vlocity Newport look and feel.
* Based on the [Salesforce Lightning Design System](https://lightningdesignsystem.com).

## Quick start

Before getting started ensure you have 

1. Clone the project with `git clone https://github.com/vlocityinc/newport-design-system.git`
2. Change into the `newport-design-system` folder using `cd newport-design-system`.
3. Run `npm install`. 
4. Run `npm start` to launch the Previewer.
5. Visit http://localhost:3003/local/preview

Having trouble getting these steps to work on your machine? Follow the [troubleshooting](#troubleshooting) guide below.


## Previewer

<img src="docs/previewer.v1.jpg" alt="previewer component/variant/modifier selection" width="600px"/>

The previewer is an interactive tool for creating components.

It runs at the designated url on startup and is the primary means of viewing your work - it will live update as you make changes.

You can choose the component, variant, and modifiers to preview as well as background color and screen size. It also previews the sass docs.

Everything in the design system is driven by [annotations](#annotations) and the previewer is no different. **To see any work in the previewer, you must add annotations to your code.**


## Annotations

Annotations are the metadata that describe the entire system.

The most intriguing part is the `@selector/@restrict` pair. Each CSS selector should have a corresponding selector describing where it can be applied. Both are normal CSS selectors that will behave like a DOM query.

For example:

```SCSS
/**
 * @selector .nds-button
 * @restrict button, a, span
 */
.nds-button {
  ...
}

/**
 * @selector .nds-button_brand
 * @restrict .nds-button
 */
.nds-button_brand {
  ...
}
```

In this example we can see that `.nds-button_brand` must be applied to a `.nds-button`, which, in turn, must be applied to a `button, a, span`.

It's important to know that `nds-button_brand` will only be associated to the button component via this `@restrict` chain. Each rule uses its `@restrict` to declare its place in the hierarchy - **it is not the the file that tells us to which component a selector belongs**

For a more complex example, see: https://github.com/salesforce-ux/design-system-internal/blob/summer-17/ui/components/combobox/base/_index.scss

While there is a handful of annotations used throughout the codebase, you'll only need to know a few to get started:

* `@base`: creates a new component
* `@variant`: a component implementation with corresponding markup
* `@modifier`: a class that alters appearance when applied to existing markup


The markup for a `@variant` will be required from the `/ui/:component/:variant/example.jsx`.

For example:

```SCSS
/**
 * @name advanced
 * @selector .nds-table_fixed-layout
 * @restrict .nds-table
 * @variant
 */

```

**Folder Structure:**

```
ui/
└── components/
    └── data-tables/
        ├── _doc.scss
        ├── _doc.mdx
        └── advanced/
            └── example.jsx
            └── _index.scss

```

All other selectors which are not `@base/@variant/@modifier` are considered child elements of a component.

For more information see the [Full annotation docs](https://github.com/salesforce-ux/design-system-internal/wiki/Documentation-Styleguide)



## Tasks

Install [gulp](http://gulpjs.com/) globally:

```bash
npm install --global gulp
```

### `npm start`

Start the Lightning Design System preview app.

### `gulp lint`

Lint the code base for syntax and stylistic errors.

```bash
# Lint indentation, Sass, JavaScript files
gulp lint

# Lint languages independently
gulp lint:sass
gulp lint:js
gulp lint:js:test
gulp lint:spaces
gulp lint:html
gulp lint:vnu (optional: --component "{trees_base_with*,trees_base_deep*}")
```

### Compilation

### `npm run build && npm run dist`

Generate the Lightning Design System into the `.dist` directory.

### `gulp styles`

Compile Sass to CSS into `.assets/styles`.

### `gulp clean`

Delete temporary build and local files.

### Stats

`npm run stats`: Useful stats about the project's deliverables.

### Tests

`npm test`: run all tests

## Troubleshooting

### npm and Node.js

The Vlocity Newport Design System uses `npm` to manage dependencies. Please [install Node.js](https://nodejs.org), and try running `npm install` again.

If Node.js is already installed, make sure you’re running v6 or up.

### JavaScript and compilation issues

JavaScript dependencies sometimes get out of sync and inexplicable bugs start to happen. Follow these steps to give a fresh start to your development environment:

1. The installed `npm` version must be at least v3.10. You can update your npm with: `npm install npm -g` (`sudo` may be required).
2. Re-install dependencies: `rm -Rf node_modules && npm install`
3. `npm start`

If this did not work, try running `npm cache clean` and repeat the above steps.

## Contributing to the code base

See <a href="CONTRIBUTING.md">CONTRIBUTING.md</a>.

## Licenses

* Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
* All icons and images are licensed under [Creative Commons Attribution-NoDerivatives 4.0](https://github.com/salesforce-ux/licenses/blob/master/LICENSE-icons-images.txt)
* The Salesforce Sans font is licensed under our [font license](https://github.com/salesforce-ux/licenses/blob/master/LICENSE-font.txt)

## Got feedback?

Please open a new <a href="https://github.com/salesforce-ux/design-system/issues">GitHub Issue</a>.
