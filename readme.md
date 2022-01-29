# Default Text jQuery Plugin

**NOTE:** This plugin is no longer maintained, and it is _unnecessary_ unless you still need to support Internet Explorer < 9 for some reason (and I'd love to know what that reason might be).

This is a simple jQuery plugin that overlays a span on top of the matched set of input elements with text that can come from the input's label, a static string, the return value of a function, or some attribute of the input itself, such as the title or placeholder.

The placeholder attribute will always take precedence, if the browser supports it and if the author has added the attribute to the input in the markup.

Unlike many "placeholder" plugins, this one doesn't set the input's value. Instead, it takes a less obtrusive approach, showing and hiding the placeholder text in a separate element (unless, of course, the placeholder attribute is chosen).

This plugin only works for inputs (but not hidden, file, checkbox, or radio inputs) and textareas. Even if you call it with `$('form *').defaulttext()`, it will filter out any element that isn't an input or textarea.

## Options

The plugin comes with a few options. Here are the defaults, all of which can be overridden per element ( `<input data-text="hello there">` ) or per call ( `.defaulttext(perCallObject)` ) or globally ( `$.fn.defaulttext[oneOfTheOptions] = 'something else'` ):

```js
$.fn.defaulttext = {

  // The element to use for the "default text." 
  // If the text option is "label", the label is used for the default text,
  // regardless of this option’s value
  tag: '<span></span>',
  defaultClass: 'default-text',

  // 'placeholder' uses HTML5 "placeholder" attribute
  // 'label' uses text of input's label
  // 'title' uses input's title attribute
  //  otherwise, use some other string or return a value from a function
  text: 'placeholder',

  // apply some kind of effect on focus/blur
  // aniProps: {marginTop: '-16px'},
  // aniSpeed: 400,
  
  // functions called after focus and blur
  focusComplete: $.noop,
  blurComplete: $.noop,

  // triggers focus/blur on mouseenter/mouseleave
  showOnHover: false
}
```
## Styles

To adjust the placement of the text in relation to the input, set `margin` or `padding` for the `defaultClass` in your stylesheet. Don't try to set `left` and `right` properties; it won't work.
