# Vlocity Newport Design System

Welcome to the Vlocity Newport Design System brought to you by [Vlocity](https://vlocity.com).

Tailored for building Vlocity Newport apps: Using the Newport Design System markup and CSS framework results in UIs that reflect the Vlocity Newport look and feel. Includes Storybook.js previewer to help you customize and rebrand all of Vlocity's newport based templates in one place.

## Quick start

1. Clone the project with `git clone https://github.com/vlocityinc/newport-design-system.git`
2. Change into the `newport-design-system` folder using `cd newport-design-system`.
3. Switch to the right branch for your version of the package, for example `git checkout ins-106.0`
4. Run `npm install`.
5. Run `npm start` to launch storybook.

![Preview in Storybook](./docs/previewer.v1.png)

Having trouble getting these steps to work on your machine? Follow the [troubleshooting](#troubleshooting) guide below.

## Docs

For more indepth documentation please checkout the documentation section in storybook.

## Browser compatibility

We support the latest versions of all browsers and IE 11.

## Tasks

Install [gulp](http://gulpjs.com/) globally:

```bash
npm install --global gulp
```

### `npm start`

Start the Newport Design System storybook.

### `gulp lint`

Lint the code base for syntax and stylistic errors.

```bash
# Lint indentation, Sass, JavaScript files
gulp lint
```

### Compilation

### `npm run build && npm run dist`

Generate the Newport Design System into the `.dist` directory and generate a zipped up version to be uploaded into Salesforce in the `dist` folder.

If you also want to deploy it to an org then run it with the following env variables:

```bash
SF_USERNAME=myusername@email.com SF_PASSWORD=mypassword npm run dist
```

## Troubleshooting

### npm and Node.js

The Vlocity Newport Design System uses `npm` to manage dependencies. Please [install Node.js](https://nodejs.org), and try running `npm install` again.

If Node.js is already installed, make sure you’re running v8 or up.

### JavaScript and compilation issues

JavaScript dependencies sometimes get out of sync and inexplicable bugs start to happen. Follow these steps to give a fresh start to your development environment:

1. The installed `npm` version must be at least v3.10. You can update your npm with: `npm install npm -g` (`sudo` may be required).
2. Re-install dependencies: `rm -Rf node_modules && npm install`
3. `npm start`

If this did not work, try running `npm cache clean` and repeat the above steps.

## Licenses

- Originally forked from [Salesforce Lightning Design System](https://lightningdesignsystem.com).
- Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
- All icons and images are licensed under [Creative Commons Attribution-NoDerivatives 4.0](https://github.com/vlocityinc/newport-design-system/blob/master/LICENSE-icons-images.txt)
- The Lato font is licensed under the [SIL OPEN FONT LICENSE](https://github.com/vlocityinc/newport-design-system/blob/master/LICENSE-font.txt)

## Got feedback?

Please open a new <a href="https://github.com/vlocityinc/newport-design-system/issues">GitHub Issue</a>.
