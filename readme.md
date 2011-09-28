# Default Text jQuery Plugin

This is a simple jQuery plugin that overlays a span on top of the matched set of input elements with text that can come from the input's label, a static string, the return value of a function, or some attribute of the input itself, such as the title or placeholder.

The placeholder attribute will always take precedence, if the browser supports it and if the author has added the attribute to the input in the markup.

Unlike many "placeholder" plugins, this one doesn't set the input's value. Instead, it take a less obtrusive approach, showing and hiding the placeholder text in a separate element (unless, of course, the placeholder attribute is chosen).

## Options

The plugin comes with a few options. Here are the defaults, all of which can be overridden per call ( `.defaulttext(perCallObject)` ) or globally ( `$.fn.defaulttext[oneOfTheOptoins] = 'something else'` ):

```javascript
{
  tag: '<span></span>',
  defaultClass: 'default-text',

  // 'placeholder' uses HTML5 "placeholder" attribute
  // 'label' uses text of input's label
  // 'title' uses input's title attribute
  // 'placeholder' uses HTML5 "placeholder" attribute
  //  otherwise, use some other string or return a value from a function
  text: 'placeholder',

  // apply some kind of effect on focus/blur
  // aniProps: {marginTop: '-16px'},
  // aniSpeed: 400,

  // functions called after focus and blur
  focusComplete: $.noop,
  blurComplete: $.noop,

  // trigges focus/blur on mouseenter/mouseleave
  showOnHover: false
}
```
## Styles

To adjust the placement of the text in relation to the input, set `margin` or `padding` for the `defaultClass` in your stylesheet. Don't try to set `left` and `right` properties; it won't work.