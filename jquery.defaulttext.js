/*!
 * jQuery Default (placeholder) Text Plugin for inputs v1.4.1
 *
 * Date: Wed Jul 24 17:16:29 2013 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/


(function($){
  if ( typeof $.fn.defaulttext !== 'undefined' ) { return; }

  $.fn.defaulttext = function(options) {
    var $inputs = this.filter(':dtinput');
    if ( !$inputs.length ) {
      return this;
    }

    options = $.extend(true, $.fn.defaulttext.defaults, options || {});

    var focused,
        elText = {
      title: function(input) {
        return $(input).attr('title');
      },
      placeholder: function(input) {
        return $(input).attr('placeholder');
      },
      label: function(input) {
        return $('label[for=' + input.id +']').html();
      }
    },
    delay = 50, loadDelay = 100,
    $form = this.closest('form');

    if ( !$form.data('defaulttext') ) {
      $form.data('defaulttext', true);
    }

    $inputs.each(function() {

      var aniProps, textLabel,
          currProps = {},
          $input = $(this),
          opts = $.extend({}, $.fn.defaulttext.defaults, options, $.metadata ? $input.metadata() : $.meta ? $input.data() : {}),
          textType = opts.text;

      opts.prevClass = opts.defaultClass ? '.' + opts.defaultClass : '';


      // set the default text based on the value of the text option
      if (textType && opts.text.constructor === Function) {
        opts.text = opts.text.call(this);
      } else if (typeof opts.text === 'string') {
        if (textType === 'label') {
          opts.tag = 'label[for= '+ this.id + ']';
          // $().css({position: 'absolute', left: '-4000em'});
        }

        opts.text = (/(title|label|placeholder)/).test(opts.text) ? elText[opts.text](this) : opts.text;
      }

      if (!opts.text || ($.support.placeholder && this.placeholder && this.placeholder.length)) { return; }

      if ($input.parent().css('position') === 'static') {
        $input.parent().css({position: 'relative'});
      }

      textLabel = $(opts.tag).html(opts.text)
      .addClass(opts.defaultClass)
      .css({
        position: 'absolute',
        top: $input.position().top,
        left: $input.position().left,
        width: $input.width(),
        display: 'none'
      })
      .insertBefore($input);

      if (opts.aniProps) {
        aniProps = opts.aniProps || {};
        $.each(aniProps, function(prop) {
          currProps[prop] = textLabel.css(prop);
        });
        opts.currProps = currProps;
        opts.aniSpeed = ('aniSpeed' in opts) ? opts.aniSpeed : 400;
      }

      $input.data('dtInfo', opts);

      if ( opts.showOnHover ) {
        $input.parent().bind('mouseenter.dt mouseleave.dt', function(event) {
          var val = $.trim( $input.val() );
          if ( val !== '' && !$input.data('dtFocused') ) {
            $input.prev().toggle(event.type === 'mouseenter');
          }

        });
      }
    }); // end each

    // functions for showing/hiding placeholder text
    function focusText(event, skip) {
      clearTimeout(focused);
      var prevClass,
          tgt = event.target,
          $tgt = $(tgt),
          info = $tgt.data('dtInfo');

      // bail if this input hasn't been set up
      if ( !info ) {
        return false;
      }

      prevClass = info.prevClass || '';

      $tgt.data('dtFocused', true);

      if (info.aniProps && skip !== 'skip') {
        $tgt.prev(prevClass).show().animate(info.aniProps, info.aniSpeed, info.focusComplete);
      } else {
        $tgt.prev(prevClass).hide();
        if ( skip !== 'skip' ) {
          info.focusComplete.call(event.target);
        }
      }
    }

    function blurText(event, skip) {
      clearTimeout(focused);
      var $prev, prevClass, isBlank,
          $tgt = $(event.target),
          info = $tgt.data('dtInfo');

      // bail if this input hasn't been set up
      if ( !info) {
        return false;
      }

      prevClass = info.prevClass || '';
      $prev = $tgt.prev(prevClass);
      isBlank = $.trim($tgt.val()) === '';

      $tgt.removeData('dtFocused');
      if (info.currProps && skip !== 'skip') {
        $prev.animate(info.currProps, info.aniSpeed, info.blurComplete);
      } else if (skip !== 'skip') {
        info.blurComplete.call(event.target);
      }
      if ( isBlank ) {
        $prev.show();
      } else {
        $prev.hide();
      }
    }

    // bind handlers to inputs' events
    // but only if no placeholder support
    if (!$.support.placeholder) {
      $inputs.bind('focus.dt', focusText);
      $inputs.bind('blur.dt', blurText);
      $inputs.prev()
      .bind('click.dt', function() {
        $(this).next().trigger('focus.dt');
      });

      // custom events to programmatically show/hide:
      $(document)
      .bind('focusText.dt', focusText)
      .bind('blurText.dt', blurText);

      // trigger the focus and blur when the window has loaded
      // trigger is delayed to work around a race condition in Safari's autofill
      $(window).bind('load', function() {
        setTimeout(function() {
          $inputs.each(function() {

            focusText({
              target: this
            }, 'skip');

            blurText({
              target: this
            }, 'skip');

          });
        }, delay+loadDelay);
      });
    }

    return this;
  };

  $.noop = $.noop || function() {};

  $.fn.defaulttext.defaults = {
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

    // triggers focus/blur on mouseenter/mouseleave
    showOnHover: false
  };

  $.extend($.expr[':'], {
    dtinput: function(element) {
      var tag = element.nodeName.toLowerCase();
      return ( tag === 'input' && !(/hidden|file|checkbox|radio/i).test(element.type) ) || tag === 'textarea';
    }
  });

  var inp = document.createElement('input');
  $.extend($.support, {
    placeholder: 'placeholder' in inp
  });
  inp = null;
})(jQuery);
