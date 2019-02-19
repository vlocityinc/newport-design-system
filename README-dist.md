# Vlocity Newport Design System

Welcome to the Vlocity Newport Design System brought to you by [Vlocity](https://www.vlocity.com).

* Tailored for building Vlocity Newport apps: Using the Newport Design System markup and CSS framework results in UIs that reflect the Vlocity Newport look and feel.
* Based on the [Salesforce Lightning Design System](https://lightningdesignsystem.com).


## Contents

* assets/
  - fonts/ - the Lato font
  - icons/ - PNG, SVG and SVG spritemap versions of icons
  - images/ - including spinners
  - styles/
    - salesforce-lightning-design-system.css (regular CSS — which should not be used within a component that already has access to the NDS CSS within the platform — please use the scoping tool mentioned below)
    - salesforce-lightning-design-system.min.css (minified CSS)
    - (The scoped files for -vf and -ltng have been removed from the download. If you still need a scoped file, a custom scoped file should be built using [the file scoping tool](https://tools.lightningdesignsystem.com/css-customizer))
* design-tokens/dist/ - the Design Tokens, usable in all formats

## Licenses

* Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
* All icons and images are licensed under [Creative Commons Attribution-NoDerivatives 4.0](https://github.com/salesforce-ux/licenses/blob/master/LICENSE-icons-images.txt)
* The Salesforce Sans font is licensed under our [font license](https://github.com/salesforce-ux/licenses/blob/master/LICENSE-font.txt)
