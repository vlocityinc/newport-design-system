# Media Object

When you need text and a figure next to each other, use a media object.

Placing text next to an image, icon, figure, or video is common for many applications. The figure can be either on the right, left, or both. The text can start at the top of the image or be centered next to it. The width of the media object is controlled either by the parent container or a secondary module class.

The `.nds-media` object can be used as a container on any element. Inside are the two required elements. The figure (typically an image or an icon) should be placed inside an element with the `.nds-media__figure` class. Next to it is typically some text that should be placed in an element with the `.nds-media__body` class.

By default, the text starts at the top of the figure. Center the body and the figure by applying the `.nds-media_center` class to `.nds-media`.

To position the figure on the other side of the body, apply the `.nds-media__figure_reverse` to the figure.

You may also position figures on both sides of the body at the same time using `.nds-media__figure` and `.nds-media__figure_reverse`.
