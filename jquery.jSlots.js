/*
 * Based on jQuery jSlots Plugin
 * http://matthewlein.com/jslot/
 * Copyright (c) 2011 Matthew Lein
 * Version: 1.0.2 (7/26/2012)
 * Dual licensed under the MIT and GPL licenses
 * Requires: jQuery v1.4.1 or later
 *
 * https://github.com/dmgdwd
 * I added
 *  -responsive capabilities
 *      this requires @media directives to change font-size and ul height
 *  _stop spinners left to right or right to left Not based on the end number
 *  -the ability to use a number input as an option
 */
(function($){
    $.jSlots = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("jSlots", base);
        base.init = function() {
            base.options = $.extend({},$.jSlots.defaultOptions, options);
            base.setup();
            base.bindEvents();
        };

        // --------------------------------------------------------------------- //
        // DEFAULT OPTIONS
        // --------------------------------------------------------------------- //
        $.jSlots.defaultOptions = {
            number : 3,          // Number: number of slots
            winnerNumber : 0,    // Number or Array: list item number(s) upon which to trigger a win
            spinner : '',        // CSS Selector: element to bind the start event to
            spinEvent : 'click', // String: event to start slots on this event
            onStart : $.noop,    // Function: runs on spin start,
            onEnd : $.noop,      // Function: run on spin end. It is passed (finalNumbers:Array). finalNumbers gives the index of the li each slot stopped on in order.
            onWin : $.noop,      // Function: run on winning number. It is passed (winCount:Number, winners:Array)
            easing : 'swing',    // String: easing type for final spin
            time : 7000,         // Number: total time of spin animation
            loops : 6,            // Number: times it will spin during the animation
            displayOrder : "DESC",   // Stop spinner rotation ASC is Right to Left  DESC is Left to right
            winningNumArray : Array(),  // This allows a specific number to be the winner
        };
        // --------------------------------------------------------------------- //
        // HELPERS
        // --------------------------------------------------------------------- //
        base.randomRange = function(low, high) {
            return Math.floor( Math.random() * (1 + high - low) ) + low;
        };
        // --------------------------------------------------------------------- //
        // VARS
        // --------------------------------------------------------------------- //
        base.isSpinning = false;
        base.spinSpeed = 0;
        base.winCount = 0;
        base.doneCount = 0;
        base.$liHeight = 0;
        base.$liWidth = 0;
        base.walkIt = 0;
        base.winners = [];
        base.allSlots = [];
        // --------------------------------------------------------------------- //
        // FUNCTIONS
        // --------------------------------------------------------------------- //

        base.setup = function() {
            // set sizes
            var $list = base.$el;
            var $li = $list.find('li').first();
            base.$liHeight = $li.outerHeight();
            base.$liWidth = $li.outerWidth();
            base.liCount = base.$el.children().length;
            base.listHeight = base.$liHeight * base.liCount;
            base.increment = (base.options.time / base.options.loops) / base.options.loops;
            base.displayOrder = Array();
            for(_i=(base.options.number+1);_i>0;_i--) { base.displayOrder.push(_i) }
            if(base.options.displayOrder == "ASC") { base.displayOrder.reverse(); }
            $list.css('position', 'relative');
            $li.clone().appendTo($list);
            base.$wrapper = $list.wrap('<div class="jSlots-wrapper text-center"></div><div class="clear-fix"></div>').parent();
            // remove original, so it can be recreated as a Slot
            base.$el.remove();
            // clone lists
            for (var i = base.options.number - 1; i >= 0; i--){
                base.allSlots.push( new base.Slot() );
            }
        };
        base.bindEvents = function() {
            $(base.options.spinner).bind(base.options.spinEvent, function(event) {
                if (!base.isSpinning) {
                    base.playSlots();
                }
            });
        };
        // Slot constructor
        base.Slot = function() {
            this.spinSpeed = 0;
            this.el = base.$el.clone().appendTo(base.$wrapper)[0];
            this.$el = $(this.el);
            this.loopCount = 0;
            this.number = 0;
        };

        base.Slot.prototype = {
            // do one rotation
            spinEm : function() {
                var that = this;
                that.$el
                    .css( 'top', -base.listHeight )
                    .animate( { 'top' : '0px' }, that.spinSpeed, 'linear', function() {
                        that.lowerSpeed();
                    });
            },
            lowerSpeed : function() {
                this.spinSpeed += base.increment;
                this.loopCount++;
                if ( this.loopCount < base.options.loops ) {
                    this.spinEm();
                } else {
                    this.finish();
                }
            },
            // final rotation
            finish : function() {
                var that = this;
                if(base.options.winningNumArray.length > 0) {
                    var endNum = base.options.winningNumArray[base.walkIt]; 
                }
                else{
                   var endNum = base.randomRange( 0, base.liCount );
               }
                var finalPos = - ( (base.$liHeight * endNum) );
                var finalSpeed = ( (this.spinSpeed * 0.5) * (base.liCount) ) / base.displayOrder[base.walkIt];
                
                that.$el
                    .css( 'top', -base.listHeight )
                    .animate( {'top': finalPos}, finalSpeed, base.options.easing, function() {
                        base.checkWinner(endNum, that);
                    });
                $(window).resize(function() {
                   base.viewportchange(endNum, that);
                });
                base.walkIt += 1;
            }
        };
        // The view port changed
        base.viewportchange = function(endNum, slot) {
            var that = slot;
            base.$liHeight = $('.slot li').outerHeight();
            finalPos = - ( (base.$liHeight * endNum) - base.$liHeight );
            finalSpeed = ( (this.spinSpeed * 0.5) * (base.liCount) ) / endNum;
            that.$el
                .css( 'top', -base.listHeight )
                .animate( {'top': finalPos}, finalSpeed, base.options.easing, function() {
                });
        };
        base.checkWinner = function(endNum, slot) {
            base.doneCount++;
            // set the slot number to whatever it ended on
            slot.number = endNum;
            // if its in the winners array
            if (
                ( $.isArray( base.options.winnerNumber ) && base.options.winnerNumber.indexOf(endNum) > -1 ) ||
                endNum === base.options.winnerNumber
                ) {
                // its a winner!
                base.winCount++;
                base.winners.push(slot.$el);
            }
            if (base.doneCount === base.options.number) {
                var finalNumbers = [];
                $.each(base.allSlots, function(index, val) {
                    finalNumbers[index] = val.number;
                });
                if ( $.isFunction( base.options.onEnd ) ) {
                    base.options.onEnd(finalNumbers);
                }
                if ( base.winCount && $.isFunction(base.options.onWin) ) {
                    base.options.onWin(base.winCount, base.winners, finalNumbers);
                }
                base.isSpinning = false;
            }
        };

        base.playSlots = function() {
            base.isSpinning = true;
            base.winCount = 0;
            base.doneCount = 0;
            base.walkIt = 0;
            base.winners = [];
            if ( $.isFunction(base.options.onStart) ) {
                base.options.onStart();
            }
            $.each(base.allSlots, function(index, val) {
                this.spinSpeed = 0;
                this.loopCount = 0;
                this.spinEm();
            });
        };

        base.onWin = function() {
            if ( $.isFunction(base.options.onWin) ) {
                base.options.onWin();
            }
        };

        // Run initializer
        base.init();
    };

    // --------------------------------------------------------------------- //
    // JQUERY FN
    // --------------------------------------------------------------------- //
    $.fn.jSlots = function(options){
        if (this.length) {
            return this.each(function(){
                (new $.jSlots(this, options));
            });
        }
    };
})(jQuery);
