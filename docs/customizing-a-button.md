# Customizing a button

In this short example we'll look at the steps to take a Newport button from looking like:

![Newport Design System Brand Button](./docs/newport-brand-default-button.png)

to:

![Customised Newport Design System Brand Button](./docs/customised-newport-brand-default-button_png.png)

## Getting Started

You should be in the Storybook preview tool if you're reading this. In the left panel navigate to `ui/components/button/Simple`. You should see a simple button example load. We want to change the branded version of a button so at the bottom of your screen you'll see a section called `Knobs` which a set of `Theme` options. Click the `Brand` radio button and you should see the styles change to match the blue branded button. Stay on this screen. All the changes you make in your editor will cause the button to change in real time.

### Understanding the structure of files

Switch to your editor and in the project code you'll find all the files for `button` in `ui/components/buttons`. In this folder you'll see 2 sub folders:

- `base` - Which contains the core css rules for all buttons and specific tokens which override different parts of the button.
- `stateful` - This is what we call a variation and contains styles for the stateful variations of a button

Let's start with changing the border-radius to get rid of the rounded corners.

## Getting rid of the rounded corners

Open the file `ui/components/buttons/_tokens.scss` and look for the following line:

```
$button-border-radius: 0.25rem !default;
```

Since we want square buttons lets change the value to be `0`:

```
$button-border-radius: 0rem !default;
```

Save the file and check out the preview tool:

![Changing border radius of button](./docs/customize-button-border-radius.png)

You should see some nice square borders.

## Changing the blue color

Now we want to update the blue color to be our nicer pink. The rgb color value for our pink is `rgb(255, 170, 170)`.

Back in our `_tokens.scss` file. The variable we want to edit is called `$color-background-button-brand`. Right now it's value is `$science-blue`. This isn't a valid color value so what is it? This is a variable whose value is defined somewhere else!

### Design token variables

At this point it's worth taking a side journey to an important part of Newport's structure. If you think about a company brand and design there is usually a well defined set of colors in a color palette and instead of hardcoding HEX or RGB color values all over the place we try to _lift_ them to a more central location. This means it's easier to update the values in one place and re-use them.

So... where is `$science-blue` defined? It's in the `ui/variables/_colors.scss` file. If you open that file you'll see a long list of colors defined which we use throughout newport.

Now we could edit the value of `$science-blue` to be our pink rgb value... but that doesn't make sense _pink is not BLUE_! In this situation it's better to start adding well defined color value names for your own colors. So let's add a new value for our pink. I suggest the name `$newport-pink-background`, let's append to the file:

```
$newport-pink-background: rgb(255, 170, 170);
```

And now let's also update the `ui/components/buttons/base/_tokens.scss` file to use our new variable:

```
$color-background-button-brand: $newport-pink-background !default;
```

Hit save and go to the previewer:

![Changing background of button](./docs/customize-button-background.png)

### Changing the border-color

Now the last step for this example is to change that blue border to be the same as the background pink of the button. The variable for this is in `ui/components/buttons/base/_tokens.scss` called `$button-color-border-brand-primary`. Update the value of this to be:

```
$button-color-border-brand-primary: $newport-pink-background !default;
```

Save your changes and checkout the previewer:

![Changing border color of a button](./docs/customize-button-border-color.png)

### Next steps...

As you've seen the steps are relatively simple. Nearly all the properties are controlled by the token file in each component. You will come across some components or properties which are not. In that case you will need to edit the .scss file directly or any related mixin files, but most common properties are available in token files.

As a remaining exercise for you, hover over our beautiful salmon pink buttons... they're blue on hover! Now update the button to be a dark shade of pink on hover - try using `rgb(212, 106, 106)`.
