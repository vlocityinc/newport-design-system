# Customizing Newport for the Salesforce Imagery Look & Feel

This article explains the main steps taken to rebrand Newport into the "Salesforce Imagery" version of Newport. This is version of Newport is not intended to be used in production, but it aims to provide an example of how different customizations can be made to Newport with some guidance and best practices.

> NOTE: Some of the CSS techniques used here are advanced. We won't cover the semantics of different selectors. We recommend a site like https://css-tricks.com/ to learn more about those.

## What are we aiming for?

Here's a short video of what we want to achieve. As you can see there's animated Astro's and hot air balloons, lots of imagery, different styled buttons, a form that has customized inputs, each step has a different background too.

![Animated overview of our Zen Garden goal](./docs/zen-garden-goal.gif)

In addition it needs to be responsive too:

![Animated demo of the responsive Zen Garden](./docs/zen-garden-responsive.gif)

There's a sample OmniScript in the Zen Garden project branch for you to import which we'll walk through in a minute but here's a short video of our starting point:

![The unstyles OmniScript we'll use](./docs/raw-zen-garden.gif)

As you can see we're starting with a very blank canvas so let's get started!

## Checking out the code

The code for the zen garden is available in a branch called `#css-zengarden-1`. Let's check it out of git first:

```
git checkout css-zengarden-1
```

Now you'll have all the files used to create this theme. In the root of this project you'll find what we call a DataPack in a file called `OSZenGarden.json`. This contains the definition for the OmniScript we saw above that we'll be theming. Let's import it into your Salesforce org.

Go to the OmniStudio application in Lightning and choose "OmniScripts". On the home page click "Import" and either drag/drop the `OSZenGarden.json` file on to the screen or click the "Browse" button and select it from file chooser. Click the "Next" button until you get all the way to end of the flow. After the modal closes and the table reloads, find the OmniScript with the type "Newport", sub type "ZenGarden" and language "English". Expand the row and click the "OSZenGarden" name underneath to open it in the designer.

![Finding the import button in OS Home page](./docs/os-import.png)

Now you can explore the OmniScript structure. We will do most of our theming work in the "Preview" tab. Click that in the header, then change the Theme to be "Newport Storybook" (you'll need to be on the Winter '21 release to see this feature.).

Now switch back to Newport project in your terminal and run the standard `npm start` command. This will kick off the compile and our OmniStudio Preview will update with the whole theme!

Let's talk through the changes that were made to achieve this.
## Hiding the step chart

We recommend creating a new `scss` file to help manage the structure of the code, so we created a new file in `ui/components/omniscript/base` called `_header.scss` and added the following line into the top of `ui/components/omniscript/base/_index.scss`:

```css
@import "header";
```

In our designs we want to completely hide the step chart. This can be done on a per OmniScript basis inside the OmniStudio designer, but in our case we never want to be shown so let's hide it in our css:

```css
[data-omni-key="omniscriptStepChart"] {
  display: none;
}
```

The `data-omni-key` attribute we'll be using a lot more of shortly. This looks for the step chart element and set's it to be completely hidden in the DOM.

## Starting with fonts and colors

Next we customized

## Changing the background of the OmniScript

In a lot of situations the challenge is finding the right hooks and css selctors in order to achieve our look and feel. Starting with the background is a nice place because it's needed from the root of our OmniScript. The root classes of the OmniScript are:

```css
.via-nds .omniscript-article
```



Let's first provide a linear gradient that will go from blue sky to green ground and finally to white:

```css
.via-nds .omniscript-article {
  overflow: hidden;
  background-image: linear-gradient(to bottom,  rgba(71,175,255,1) 0%,rgba(79,183,255,1) 10%,rgba(102,206,255,1) 15%,rgba(140,242,255,1) 18%,rgba(153,255,255,1) 19%,rgba(158,255,250,1) 21%,rgba(172,255,238,1) 24%,rgba(197,255,218,1) 27%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%);
  background-repeat:no-repeat;
  background-size: contain;
  background-position: 0;
}
```

This gives a nice gradient. Next up we want to provide the clouds on top of this. We can achieve this nicely using the `::before` selector which will allows us to create the equivalent of an invisible DOM element and set it's background to be our clouds image:

```css
.via-nds .omniscript-article {
  ...
  &::before {
    background-image: url($static-image-path + '/clouds-background.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position-x: center;
    background-position-y: 0px;
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
  }
}
```

#### Using Images in your CSS

Here you can see we've added an image. All your images used by css should live in `assets/images`. The variable `$static-image-path` refers to this location for you.

### Adding an image of mountains to our background

One of the other requirements from the design team was that we have a nice mountain background image on top of our gradient.

![](./docs/newport-zen-garden-mountains0.png)

A cool feature of css is that you can apply multiple backgrounds to the same element. So to achieve this we'll update our original `.omniscript-article` declaration:

```css
.via-nds .omniscript-article {
  overflow: hidden;
  background-image: url($static-image-path + "/winter-background.png"), linear-gradient(to bottom,  rgba(71,175,255,1) 0%,rgba(79,183,255,1) 10%,rgba(102,206,255,1) 15%,rgba(140,242,255,1) 18%,rgba(153,255,255,1) 19%,rgba(158,255,250,1) 21%,rgba(172,255,238,1) 24%,rgba(197,255,218,1) 27%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%);
  background-repeat: no-repeat, no-repeat;
  background-size: contain, contain;
  background-position: 0 15%, 0;
}
```

Above you can see we have our original linear-gradient but before it we've added the mountains image. We've also said `background-position: 0 10%, 0;`. The `0 10%` tells the browser to move the image to 10% of the way down our page. That way the mountains appear where the blue gradient is and ends with the green gradient, so it looks like the mountains sit on the sky and end with grass below.

### Adding an animated floating Astro

Our beloved Astro needs to now float at the top of the page. We're going to target the child element of the `omniscript-article` to do this and use the `::before` selector to add this child. This is very similar to how we added the clouds:

```css
  >.nds-card__body::before {
    background-image: url($static-image-path + '/intro-extra.png');
    background-size: contain;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    right: 0;
    text-align: center;
    z-index: 0;
    transform: translatey(0px);
    animation: float 6s ease-in-out infinite;
    content: '';
    height: 400px;
    left: -680px;
    width: 400px;
    top: -60px;
  }
```

In addition we need to define the `float` animation which we'll add below in this file:

```css
@keyframes float {
  0% {
    transform: translatey(0px); 
  }
  50% {
    transform: translatey(-40px); 
  }
  100% {
    transform: translatey(0px); 
  }
}
```

### Hiding the step chart



## Changing the font's and text

Our first screenshot above has a lot of rich text in it, but our out of the box Newport styles don't match what the design team have put together. So let's see how to customize the fonts.

The best way to see the current output of text is to look at the "Text Block" story. As we edit the styles we can see them updated here.

All these styles live in one file `ui/components/rich-text-editor/base/_index.scss`. Around 120 lines down in that file is where we want to start:

```css
.slds-rich-text-editor__output,
.nds-rich-text-editor__textarea,
.nds-rich-text-editor__output {
```

Everything within here will apply to our fonts. So let's start with the most complicated. The H1 heading:

```css
  h1 {
    font-size: 4em;
    line-height: 1.2em;
    color: #fff;
    font-weight: bold;
    font-family: sans-serif;
    position: relative;
    text-shadow: 0 1px 0 #ccc,
                  0 2px 0 #c9c9c9,
                  0 3px 0 #bbb,
                  0 4px 0 #b9b9b9,
                  0 5px 0 #aaa,
                  0 6px 1px rgba(0,0,0,.1),
                  0 0 5px rgba(0,0,0,.1),
                  0 1px 3px rgba(0,0,0,.3),
                  0 3px 5px rgba(0,0,0,.2);
    z-index: 60;
    text-align: center;
  }
```

The most complex piece here is the `text-shadow`, where we're applying multiple levels of shadow to give a cool raised text affect.

I won't cover all the other changes for each kind of heading and tag here, but I will highlight some key changes.

### Changing the default fonts

Newport ships with the Lato font. However Salesforce now uses the default browser fonts, so we want to remove the use of a custom font here and instead use browser defaults. 

Open `ui/variables/_fonts.scss`, scroll to the bottom and update the `$sans-serif` value to be:

```css
$sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
```

This is the recommended way to use the browsers default font.

### Customizing font colors

Whilst you can change a font color in the `ui/components/rich-text-editor/base/_index.scss` file, this will typically only apply to text rendered in Text Blocks. If you want to change a font color across the whole website then open up `ui/design-tokens/_text-color.scss` and here you can tweak them. In our case we're going to adjust `$color-blue-font`:

```css
$color-blue-font: #444444 !default;
```

We can create a variable of this color so it can be re-used elsewhere but for now I'll just hard code it.

And with that we've customized most of our fonts! On to the next step

## Customizing the form inputs

We want our inputs to look like:

![](./docs/newport-zengarden-form.png)

So let's see how to achieve that.

### Disabling the animated labels

Firstly let's disable the animated labels that live in the text area and slide out. This can be done very simply in `ui/_config.scss`. Scroll down to the bottom and look for `$enable-animated-inputs` and set it to false.

```css
$enable-animated-inputs: false !default;
```

Next up we need to add borders and padding our around our inputs. Again there's a super simple switch in `ui/_config.scss`. Change that to be:

```css
$enable-simple-underlined-inputs: $enable-animated-inputs or false !default;
```

This property will only work correctly when the `$enabled-animated-inputs` is false. If it's true then the behaviour of the UI won't look quite right.

Setting that gets our inputs like the design time. Next up we're going to look at how we can make element specific changes.

## Targetting specific elements

We've been give a design for the content of a single specific OmniScript. As a part of this design the designers want different blocks on our OmniScript to be positioned in very custom specific places. Revisting our initial design:

![](./docs/preview-os-zen-garden.png)

We can create each one of those sections as different named blocks in the designer. Here's the overview of what we've done for this in the designer. On the left you can see the tree of names:

![](./docs/newport-zengarden-designer.png)

And here you can see how the top half of the page is mapped to those named blocks:

![](./docs/preview-os-zen-garden-annotated.png)

So let's first discuss the recommended directory structure to manage these kind of customizations. 

### Folder structure for element specific changes

Create the following file: `ui/components/omniscript/base/steps/_index.scss`. You'll need to create the `steps` folder as that won't exist yet.

Inside of `ui/components/omniscript/base/_index.scss` add the following line:

```css
@import "steps/index";
```

And now we can create any number of step specific overrides in their own files and `@import` them into `ui/components/omniscript/base/steps/_index.scss`. For example let's say we steps named `intro`, `form` and `confirmation`, we'd create the following files: `_intro.scss`. `_form.scss` and `_confirmation.scss`. Then add them into `ui/components/omniscript/base/steps/_index.scss` as:

```css
@import "intro";
@import "form";
@import "confirmation";
```

> Note: this is just our recommended approach to keep it easy to locate changes, but it's entirely up to you if you have a better structure that makes sense for your team. Another modification is to have the `type_subtype_language` be another sub folder with a similar structure if you plan to override many steps across multiple OmniScripts.

### The basics of element specific overrides

Before start customizing these blocks let's discuss the technique we'll use.

In OmniScript every element has a unique `Name` property. We add this into the DOM as:

```html
data-omni-key="element-name"
```

Where `element-name` is the value in the `Name` property. This means we can use the following CSS selector to override styles for that specific element:

```css
[data-omni-key="element-name"]
```

What's more is that if you follow a naming convention you can start style groups of elements. For example let's say that we have 4 Text inputs where we want to make the label much larger, but the remaining Text inputs should match our default style. In this case lets make a naming convention where we append `_lg-label` to the names of those elements. We can now target all elements with that suffix using:

```css
[data-omni-key$="_lg-label"]
```

Amazing! There's more options for these attribute selectors, so establishing a naming convention of prefixes, suffixes or keywords can help you extend the base styles nicely inside of OmniScript. For more details see: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors

### Layouting out our blocks

Back to the task at hand. Let's layout those 3 blocks that we saw. Given that we're modern browsers we have a really nice way to achieve this now with CSS Grid. We won't cover how grid works as there's lots of great articles out there already, so please read up if necessary to understand this.

Let's dive in with our css. We'll add to our `ui/components/omniscript/base/steps/_intro.scss` file:

```
[data-omni-key$="intro"] {

  
}
