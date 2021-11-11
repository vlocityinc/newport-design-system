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

And with that we've customized most of our fonts! On to the next step.

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

There's a few other small changes I want to make to fix up font sizes to look a little cleaner, so I open up `

Setting that gets our inputs like the design. Next up we're going to look at how we can make element specific changes. These are all going to take place in `ui/components/form-element/animate/_index.scss`. Firstly let's decrease the size of the font for input. in `.nds-input {` remove the `letter-spacing` and change the `font-size` to be `.75rem`. There's also a big gap below our input where the error message will be, so edit `.nds-has-error .nds-form-element__help` and change the `margin-top` to be `.125rem`. Similar we're going to adjust the margin on our `.nds-form-container` to be `.5rem 0` . And finally on our combobox's we're going to reset the left padding. So deleting `padding-left: 0;` from `.nds-combobox_container .nds-combobox__form-element.nds-form-element__control.nds-form-element__control-animated-label input[readonly]`.

That's our fonts, base colors and form inputs taken care of. Now let's clean up a few extra pieces.

## Hiding our next/previous buttons.

In our OmniScript we're using a little hack to be able to have the `Next` button appear in the middle of the form in different places. To achieve that we're using a little hack and using a Radio with a single option. On that option choose "Auto Advance". What that means is that when the user clicks that option it'll move straight to the next step. We've also set the Display Mode to be "Button Group" which gives us most of the styles we need for a button. With that in place, to hide our default Next and Previous buttons, open `ui/components/omniscript/base/_footer.scss` and add to the bottom:

```css
.omniscript-article > .nds-m-around_small {
  display: none;
}
```

This will target all the buttons at the bottom and hide them completely.

## Step specific styles

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

### Laying out our blocks

Back to the task at hand. Let's layout those 3 blocks that we saw. Given that we're modern browsers we have a really nice way to achieve this now with CSS Grid. We won't cover how grid works as there's lots of great articles out there already, so please read up if necessary to understand this.

> NOTE: we're not going through every single line/rule in the CSS but covering enough of the basics that if you look at the other parts it would all make sense.

Let's dive in with our css. We'll add to our `ui/components/omniscript/base/steps/_intro.scss` file:

```
[data-omni-key="intro"]:not(:empty) {
  .omniscript-step__body-nds {
    display: grid;
    grid-template-rows: auto;
    row-gap: 2rem;
    grid-template-columns: 1fr;
    grid-template-areas:
      "zen-intro"
      "zen-supporting";
    margin-top: 400px;
  
    @include mq-large-min() {
      margin-top: 0;
      grid-template-columns: 460px 1fr;
      grid-template-areas:
        "zen-intro zen-intro"
        "nav-sidebar ."
        "zen-supporting zen-supporting";
    }
  }

  [data-omni-key="zen-intro"] {
    grid-area: zen-intro;
  }

  [data-omni-key="zen-supporting"] {
    grid-area: zen-supporting;
  }
  
  [data-omni-key="nav-sidebar"] {
    grid-area: nav-sidebar;
  }
}
```

Let's break some of this down.

```css
[data-omni-key="intro"]:not(:empty)
```

The `:not(:empty)` part of the selector says that only apply the below styles if the contents of the intro step exist. If they don't exist then don't apply these styles. We need this because by default OmniScript renders all the step root elements, but only the active step has it's children there.

Within this we're using CSS Grid and the media query mixin to dictate the layout. `mq-large-min()` means the `min-width` must match what we class as `large`, i.e. desktop. So here we're saying for desktop create a 2 column grid and mobile stack the items, and on mobile we'll hide the `nav-sidebar` from the grid completely, hence it doesn't appear in the list of `grid-template-areas` in the default declarations. Notice we're following the pattern of mobile first. That means we define our mobile styles as the defaults and override those styles with the media queries.

### What media queries do we support?

We have 4 different sizes in both a min and max format that translate to the following:

 - `mq-small-min()` - targets phones and larger
 - `mq-small-max()` - targets phones and smaller
 - `mq-medium-min()` - targets tablets and larger
 - `mq-medium-max()` - targets tablets and smaller
 - `mq-large-min()` - targets desktops and larger
 - `mq-large-max()` - targets desktops and smaller
 - `mq-huge-min()` - targets large desktops, for example widescreen, and larger
 - `mq-huge-max()` - targets large desktops, for example widescreen, and smaller

These should cover all the different media query scenario's. As we stated above it's best to focus on mobile styling first, then work your way up through tablet styles to desktop and larger if needed. 

### Customizing backgrounds of a step

Each of our steps has a different background. This can be achieved quite easily with the targeted selectors we showed above. So for our `intro` step the styles are simply:

```css
[data-omni-key="intro"]:not(:empty) {

  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0;
  display: block;

  background-image: linear-gradient(to bottom,  rgba(71,175,255,1) 0%,rgba(79,183,255,1) 10%,rgba(102,206,255,1) 15%,rgba(140,242,255,1) 18%,rgba(153,255,255,1) 19%,rgba(158,255,250,1) 21%,rgba(172,255,238,1) 24%,rgba(197,255,218,1) 27%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%);

  @include mq-medium-min() {
    background-image: linear-gradient(to bottom,  rgba(71,175,255,1) 0%,rgba(79,183,255,1) 10%,rgba(102,206,255,1) 15%,rgba(140,242,255,1) 18%,rgba(153,255,255,1) 19%,rgba(158,255,250,1) 21%,rgba(172,255,238,1) 24%,rgba(197,255,218,1) 27%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%);
  }
  @include mq-large-min() {
    background-image: linear-gradient(to bottom, #47afff 0%, #4fb7ff 6%, #66ceff 15%, #8cf2ff 23%, #99ffff 27%, #9efffa 30%, #acffee 36%, #c5ffda 44%, white 60%, white 100%);
  }
}
```

Here we're providing a default gradient for the mobile size, then an override for the tablet and finally one for desktop.

### Adding animated images to our background

 All your images used by css should live in `assets/images`. The variable `$static-image-path` refers to this location for you. Let's add our animated floating Astro.

```css
[data-omni-key="intro"]:not(:empty) {

  >div::before {
    background-image: url($static-image-path + '/intro-extra.png');
    background-size: contain;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    text-align: center;
    z-index: 0;
    transform: translatey(0px);
    animation: float 6s ease-in-out infinite;
    content: '';
    height: 400px;
    left: -25px;
    width: 400px;
    top: 50px;

    @include mq-large-min() {
      right: 0;
      left: -680px;
      top: -60px;
    }
  }
}

@keyframes float {
  0% {
    transform: translatey(0px); }
  50% {
    transform: translatey(-40px); }
  100% {
    transform: translatey(0px); }
}
```


Here we're using a little trick to create a hidden DOM element that we can attach our Astro too without needing to modify the underlying HTML. If you look through all the changes in this theme you can see we use the `::before` and `::after` pseudo classes a lot to attach additional images. In this case we've attached out Astro image as a background to the pseudo element and we've added a little keyframe animation to have float up and down. We've also used a media query to position him differently. On mobile and tablet he'll be in the middle of the screen at the top, on desktop he'll be positioned to the left at the top.

### Rebranding the radio button to a regular button

As mentioned earlier we got rid of the next/previous buttons and are using a radio button to advance instead. We need to add some styles to fix this up to look a like a regular button. Here's how I achieved this. The name of my radio button is "contact-us"

```css
[data-omni-key="contact-us"] {
  .nds-radio_button__label {
    background: transparent;
  }
  .nds-radio_button-group {
    background: linear-gradient(180deg, #3f90e6 0%, #2c73bf 100%);
    border: 0;
    border-radius: .25rem;
    height: 4rem;
    width: 12rem;
    margin: 0 auto;
  }
  .nds-radio_faux {
    color: #fff;
    font-weight: 700;
    line-height: 4rem;
  }
}
```

This sets the background on the button to my new gradient, add the border-radius to all sides and a fixed height and width. Finally I set the font color and size to pop on the button label.
## Other common modifications

I won't go through all the other styling changes across the steps. They're all variations of grid layouts and setting background images, with little overrides for `<h3>`, `<p>` and `<ol>` elements on specific blocks. However there are a few common little bits of css that can be helpful to give a reasonable reset starting point.

### Widening the central column of the OmniScript

The default width on desktop of the Newport content is 66.6%. This is sometimes too small, to change this on a per step basis you can set:

```
[data-omni-key="intro"]:not(:empty) {
  @include mq-large-min() {
    >.nds-medium-size_8-of-12 {
      width: 80%;
      flex: 0 0 80%;
      max-width: 80%;
    }
  }
}
```

If you want to do this for all steps then:

```css
@include mq-large-min() {
  .omniscript-article>.nds-card__body>[data-omni-key]>.nds-medium-size_8-of-12 {
    width: 80%;
    flex: 0 0 80%;
    max-width: 80%;
  }
}
```

### Resetting indentation on blocks and form containers

By default blocks have a top and left margin and form element containers have extra padding around them. This can often throw up layout quirks when trying to create a theme from scratch. Luckily there's a few simple css rules you can add to reset them.

```css
.nds-form-container {
  padding: 0;
  margin: 0;
}
.nds-block_body>.nds-grid {
  min-height: auto !important;
  margin: 0;
}
.nds-block .nds-block_container>label~.nds-block_body  {
  padding: 0;
}
```

In addition sometimes you can to reset some of the other padding we include, so adding:

```css
.nds-p-around_small {
  padding-top: 0;
  padding-bottom: 0;
}
```

## Next steps

Hopefully you've seen enough to get started with your own theme modifications and how easy and powerful Newport can be to bring your brand to life.
