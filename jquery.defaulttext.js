/***************************************
* Default Text Plugin for inputs
* @author Karl Swedberg
* @version 1.2 (March 29, 2010)
* @requires jQuery v1.3+ 
************************************** */

(function($){
		
  $.fn.defaulttext = function(options) {
    
    var elText = { 
      title: function(input) {
        return $(input).attr('title');
      },
      placeholder: function(input) {
        return $(input).attr('placeholder');
      },
      label: function(input) {
        return $('label[for=' + input.id +']').text();
      }
    },
    delay = 50, loadDelay = 100,
    selector = this.selector,
    $form = this.closest('form');

    $form
    .bind('blurText.dt', function(event) {
      var $tgt = $(event.target),
          prevClass = $tgt.data('dtInfo') && $tgt.data('dtInfo').prevClass || '';
      if ($.trim($tgt.val()) === '') {
        $tgt.prev(prevClass).show();
      } else {
        $tgt.prev(prevClass).hide();
      }
    })
    .bind('focusText.dt', function(event, el) {
      var tgt = event.target;
      $(tgt).prev().hide();
      if (!$(el).is(':dtinput')) {
        tgt.focus();
      }         
    })
    .bind('keyupText.dt', function(event) {
      
    });
    
    this.filter(':dtinput').each(function() {
      
      var $input = $(this);
      var opts = $.extend({}, $.fn.defaulttext.defaults, options || {}, $.metadata ? $input.metadata() : $.meta ? $input.data() : {});
 
      // set the default text based on the value of the text option
      if (opts.text.constructor === Function) {
        opts.text = opts.text.call(this);
      } else if (opts.text && opts.text.constructor === String) {
        if (opts.text === 'label') {
          $('label[for= '+ this.id + ']').css({position: 'absolute', left: '-4000em'});
        }
        opts.text = (/(title|label|placeholder)/).test(opts.text) ? elText[opts.text](this) : opts.text;
      } 
      if (!opts.text) {return;}

      if ('placeholder' in this) {
        return this.placeholder = opts.text;
      }

      $input.data('dtInfo', {text: opts.text, prevClass: opts.defaultClass ? '.' + opts.defaultClass : ''});
      
      if ($input.parent().css('position') == 'static') {
        $input.parent().css({position: 'relative'});
      }
      $(opts.tag).html($input.data('dtInfo').text)
      .addClass(opts.defaultClass)
      .css({
        position: 'absolute',
        top: $input.position().top,
        left: $input.position().left,
        width: $input.width(),
        display: 'none'
      })
      .insertBefore($input);

      // hide default text on focus
      var focused;
      $input
      .bind('focus', function(event) {
        
        $input.trigger('focusText.dt', event.target);
        focused = setTimeout(function() {
          $input.trigger('focusText.dt', event.target);
        }, delay);
      });
      $input.prev($input.data('dtInfo').prevClass)
      .bind('click', function(event) {
        $input.trigger('focusText.dt', event.target);
      });
      
      // conditionally show default text on input blur
      $input
      .bind('blur', function(event) {
        clearTimeout(focused);
        $input.trigger('blurText.dt');
      });
      
      // trigger the focus and blur when the window has loaded
      // trigger is delayed to work around a race condition in Safari's autofill
      $(window).bind('load', function() {
        setTimeout(function() {
          $input.trigger('focusText.dt', $input);
          $input.trigger('blurText.dt');
        }, delay+loadDelay);
      });
    });

    function dtHide(el) {
      el.prev().hide();
    }
    
    return this;
  };

  $.fn.defaulttext.defaults = {
    tag: '<span></span>',
    defaultClass: 'default-text',
    text: 'label'             // 'label' uses text of input's label
                              // 'title' uses input's title attribute
                              // 'placeholder' uses HTML5 "placeholder" attribute
                              //  otherwise, use some other string or return a value from a function
  };


  $.extend($.expr[':'], {
    dtinput: function(element, index, matches, set) {
      var tag = element.nodeName.toLowerCase();
      return ( tag === 'input' && !(/file|checkbox|radio/i).test(element.type) ) || tag === 'textarea';
    }
  });
  
})(jQuery);
