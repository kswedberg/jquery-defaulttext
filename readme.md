# Default Text jQuery Plugin

This is a simple jQuery plugin that overlays a span on top of the matched set of input elements with text that can come from the input's label, a static string, the return value of a function, or some attribute of the input itself, such as the title or placeholder.

The placeholder attribute will always take precedence, if the browser supports it and if the author has added the attribute to the input in the markup.

Unlike many "placeholder" plugins, this one doesn't set the input's value. Instead, it take a less obtrusive approach, showing and hiding the placeholder text in a separate element (unless, of course, the placeholder attribute is chosen).

The plugin comes with three options. Here are the defaults, which as is typical can be overriden:

    {
      tag: '<span></span>',     // tag for the "default text" overlay.
      defaultClass: 'default-text',
      text: 'placeholder'       // 'placeholder' uses HTML5 "placeholder" attribute
                                // 'label' uses text of input's label
                                // 'title' uses input's title attribute
                                // 'placeholder' uses HTML5 "placeholder" attribute
                                //  otherwise, use some other string or return a value from a function
    }
