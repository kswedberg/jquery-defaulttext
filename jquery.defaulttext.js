/***************************************
* Default Text Plugin for inputs
* @author Karl Swedberg
* @version 1.0 (03/30/2009)
* @requires jQuery v1.3+ 
************************************** */



(function($){
		
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
        selector = this.selector,
        $form = this.parents('form:first');

    $form
    .bind('blurText.dt', function(event) {
      var $tgt = $(event.target),
          prevClass = $tgt.data('dtInfo').prevClass;
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
    });
    
    this.filter(':dtinput').each(function() {
      var $input = $(this);
        var opts = $.extend({}, $.fn.defaulttext.defaults, options || {}, $.metadata ? $input.metadata() : $.meta ? $input.data() : {});
        // set the default text based on the value of the text option
        if (opts.text.constructor === Function) {
          $input.data('defaultText', opts.text(this));
        } else if (opts.text && opts.text.constructor === String){
          $input.data('dtInfo', {
            text: ((/(title|label)/).test(opts.text) ? elText[opts.text](this) : opts.text)
          });
          if (opts.text === 'label') {
            $('label[for= '+ this.id + ']').css({position: 'absolute', left: '-4000em'});
          }
        } 
        if (!$input.data('dtInfo').text) {return $input.removeData('dtInfo');}
        
        $input.data('dtinfo', {prevClass: opts.defaultClass ? '.' + opts.defaultClass : ''});
        
        if ($input.parent().css('position') == 'static') {
          $input.parent().css({position: 'relative'});
        }
        $(opts.tag).html($input.data('dtInfo').text)
          .addClass(opts.defaultClass)
          .css({
            position: 'absolute',
            top: $input.position().top,
            left: $input.position().left,
            display: 'none'
          })
          .insertBefore($input);

        // hide default text on focus
        $input.bind('focus', function(event) {
          $input.trigger('focusText.dt', event.target);
        });
        $input.prev($input.data('dtInfo').prevClass).bind('click', function(event) {
          $input.trigger('focusText.dt', event.target);
        });
        
        // conditionally show default text on input blur
        $input.bind('blur', function(event) {
          $(this).trigger('blurText.dt');
        });
        
        // trigger the focs and blur when the window has loaded
        $(window).bind('load', function() {
          $input.trigger('focusText.dt', $input);
          $input.trigger('blurText.dt');
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
    text: 'label'            // 'label' uses text of input's label; 'title' uses input's title attribute. 
                              //  otherwise, use some other string or function
  };


  $.extend($.expr[':'], {
    dtinput: function(element, index, matches, set) {
      return (/text|password/i).test(element.type) || element.nodeName.toLowerCase() === 'textarea';
    }
  });
  
})(jQuery);
