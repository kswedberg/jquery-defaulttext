/***************************************
* Default Text Plugin for inputs
* @author Karl Swedberg
* @version 1.0 (03/30/2009)
* @requires jQuery v1.3+ 
************************************** */
 
(function($) {
  $.fn.defaulttext = function(options) {
    
    var elText = { 
      title: function(input) {
        return $(input).attr('title');
      },
      label: function(input) {
        return $('label[for=' + input.id +']').text();
      }
    },
    defaultText,
    selector = this.selector;

    return this.each(function() {
      var $input = $(this);
      if (this.type === 'text' || this.nodeName.toLowerCase() === 'textarea') {
        var opts = $.extend({}, $.fn.defaulttext.defaults, options || {}, $.metadata ? $input.metadata() : $.meta ? $input.data() : {});
        // set the default text based on the value of the text option
        if (opts.text.constructor === Function) {
          defaultText = opts.text(this);
        } else if (opts.text && opts.text.constructor === String){
          defaultText = (/(title|label)/).test(opts.text) ? elText[opts.text](this) : opts.text;
          if (opts.text === 'label') {
            $('label[for= '+ this.id + ']').css({position: 'absolute', left: '-4000em'});
          }
        } 
        if (!defaultText) {return;}

        if ($input.parent().css('position') == 'static') {
          $input.parent().css({position: 'relative'});
        }
        $(opts.tag).html(defaultText)
          .addClass(opts.defaultClass)
          .css({
            position: 'absolute',
            top: $input.position().top,
            left: $input.position().left,
            display: 'none'
          })
          .insertBefore($input);

        // hide default text on focus
        $input.focus(function() {
          dtHide($input);
        });
        var prevClass = opts.defaultClass ? '.' + opts.defaultClass : '';
        $input.prev(prevClass).click(function() {
          dtHide($input);
          $input.focus();
        });

        // conditionally show default text on ready and input blur
        
        $input.bind('blur', function(event, init) {
          if ($.trim($(this).val()) == '') {
            $(this).prev(prevClass).show();
          } else {
            $(this).prev(prevClass).hide();
          }
          if (!init) {
            $(selector).not($input).triggerHandler('blur');
          }
        })
        .triggerHandler('blur', true);
      }
    });

    function dtHide(el) {
      el.prev().hide();
    }
  };
  $.fn.defaulttext.defaults = {
    tag: '<span></span>',
    defaultClass: 'default-text',
    text: 'label'            // 'label' uses text of input's label; 'title' uses input's title attribute. 
                              //  otherwise, use some other string or function
  };
})(jQuery);