

!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var FlipPanel = function (element, options) {
    this.init('flippanel', element, options)
  }

  FlipPanel.prototype = {
    constructor: FlipPanel,
    init: function (type, element, options) {
      var eventIn
        , eventOut
      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true
      this.$element.addClass('flip-panel');
      this.contents = this.$element.html();
      this.$element.html(this.options.template);
      this.setCurrent(this.contents);
    },
    setCurrent: function(current) {
      this.current = current;
      this.$element.find('.current').each(function() {
        $(this).html(current);
      })
    },
    setNext: function(next) {
      this.next = next;
      this.$element.find('.next').each(function() {
        $(this).html(next);
      })      
    },
    change: function(newValue, speed) {
      if (!speed) {
        speed = this.options.speed
      }
      console.log("speed= " + speed)
      
      if (this.next == newValue) { return; }
      
      this.setNext(newValue);
      var txtime = speed / 1000;
      
      this.$element.find('.layer.top')      
        .css('-moz-transition', 'all ' + txtime + 's ease-out')
        .css('-webkit-transition', 'all ' + txtime + 's ease-out')
        .css('transition', 'all ' + txtime + 's ease-out');
        
      this.$element.find('.layer.top')
        .css('-webkit-transform', 'rotateX(-180deg)');

      var _this = this;
      window.setTimeout(function() {
        _this.$element.find('.layer.top')      
          .css('-moz-transition', 'none')
          .css('-webkit-transition', 'none')
          .css('transition', 'none')
        _this.setCurrent(newValue);
        _this.$element.find('.layer.top')
          .css('-webkit-transform', 'rotateX(0deg)');
      }, speed)
            
    },
    run: function(values) {
      var timeIncrement = (1000/(values.length));      
      var that = this;
      var index = 0;
      var delayChange = function() {
        window.setTimeout(function() {
          console.log("change to "  + values[index])
          that.change(values[index], timeIncrement);
          if (index < values.length) {
            index = index + 1;
            delayChange();
          }
        }, timeIncrement)
      }
      delayChange();
    },
    getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      return options
    }
  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.flippanel = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('flippanel')
        , options = typeof option == 'object' && option
      if (!data) $this.data('flippanel', (data = new FlipPanel(this, options)))
      if (typeof option == 'string') data.change(option)
      if (typeof option == 'object') data.run(option)
    })
  }

  $.fn.flippanel.Constructor = FlipPanel

  $.fn.flippanel.defaults = {
    template: '<span class="layer top"><span class="back side bottom-half next"></span><span class="side top-half current"></span></span><span class="layer middle"><span class="side top-half next"></span></span><span class="layer bottom current"></span>',
    speed: 350
  }

}(window.jQuery);