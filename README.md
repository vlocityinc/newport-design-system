# Vlocity Newport Design System

Welcome to the Vlocity Newport Design System brought to you by [Vlocity](https://vlocity.com).

* Tailored for building Vlocity Newport apps: Using the Newport Design System markup and CSS framework results in UIs that reflect the Vlocity Newport look and feel.
* Based on the [Salesforce Lightning Design System](https://lightningdesignsystem.com).

## Quick start

Before getting started ensure you have

1. Clone the project with `git clone https://github.com/vlocityinc/newport-design-system.git`
2. Change into the `newport-design-system` folder using `cd newport-design-system`.
3. Run `npm install`.
4. Run `npm start` to launch the Storybook.

Having trouble getting these steps to work on your machine? Follow the [troubleshooting](#troubleshooting) guide below.


## Docs

For more indepth documentation please see the [Wiki](https://github.com/vlocityinc/newport-design-system/wiki).


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


## Licenses

* Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
* All icons and images are licensed under [Creative Commons Attribution-NoDerivatives 4.0](https://github.com/vlocityinc/newport-design-system/blob/master/LICENSE-icons-images.txt)
* The Lato font is licensed under the [SIL OPEN FONT LICENSE](https://github.com/vlocityinc/newport-design-system/blob/master/LICENSE-font.txt)

## Got feedback?

Please open a new <a href="https://github.com/vlocityinc/newport-design-system/issues">GitHub Issue</a>.
