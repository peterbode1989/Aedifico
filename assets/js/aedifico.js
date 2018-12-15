/**
 * Aedifico
 *
 * Aedifico is a lightweight Bootstrap gridslider
 *
 * @package     Aedifico
 * @version     1.0.0
 * @author      Peter Bode <peter@acfbentveld.nl>
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
    'use strict';
    var Aedifico = window.Aedifico || {};

    Aedifico = (function() {
        function Aedifico(element, settings) {
            var _ = this;

            _.defaults = {
                namespace: 'aedifico',
                colCount: 3, // deprecated
            };

            _.options = $.extend({}, _.defaults, settings);
            _.config = {
                parent: $(element).addClass(_.options.namespace),
                parentWidth: $(element).outerWidth(),
                children: [],
                collection: [],
                windowDelay: null,
            };

            console.log(_.config);

            $(window).on('resize.' + _.config.parent, $.proxy(_.resize, _));

            _.build();
        }
        return Aedifico;
    }());

    Aedifico.prototype.build = function() {
        var _ = this;
        _.config.children = [];
        _.config.children = _.config.parent.children('div');
        _.collect();
    }

    Aedifico.prototype.collect = function() {
        var _ = this;

        _.config.collection = [];
        for(var i = 0; i < _.config.children.length; i++) {
            var bin = {
                w: $(_.config.children[i]).outerWidth(),
                h: $(_.config.children[i]).outerHeight(),
                p: _.config.children[i]
            };

            _.config.collection.push(bin);
        }
        _.apply();
    }

    Aedifico.prototype.apply = function() {
        var _ = this;

        console.table(_.config.collection);
    }

    Aedifico.prototype.resize = function() {
        var _ = this;

        if ($(_.config.parent).outerWidth() !== _.parentWidth) {
            clearTimeout(_.config.windowDelay);
            _.config.windowDelay = window.setTimeout(function() {
                _.config.parentWidth = $(_.config.parent).outerWidth();
                console.log('resize?');
            }, 200);
        }
    }

    // Aedifico.prototype.__proto__ = {
    //
    //
    //     collect: function() {
    //
    //     },
    //
    //     apply: function() {
    //         var _ = this;
    //
    //         _.grid = [];
    //     	_.grid.push({
    //             minX: 0,
    //             maxX: _.config.parentWidth,
    //             y: 0,
    //         });
    //
    //         // IDEA: Refactor into multiple __proto__
    //         for(var i = 0; i < _.config.collection.length; i++) {
    //
    //             var elm = _.config.collection[i];
    //             console.log(elm);
    //
    //             console.table(_.grid);
    //
    //             var t = _.grid[0];
    //             function getSpot(elm) {
    //                 for(var spot in _.grid) {
    //                     var g = _.grid[spot];
    //                     if(g.minX + elm.w <= g.maxX) return _.grid[spot];
    //                 }
    //
    //                 return {
    //                     minX: 0,
    //                     maxX: _.config.parentWidth,
    //                     y: _.grid.reduce((min, b) => Math.max(min, b.y), _.grid[0].y),
    //                 };
    //             }
    //
    //             t = getSpot(elm);
    //
    //             console.log(t);
    //
    //             _.config.collection[i].p.style.top = t.y + 'px';
    //             _.config.collection[i].p.style.left = t.minX + 'px';
    //
    //
    //
    //
    //             // var y = t.y;
    //             // var w = (_.config.parentWidth / _.options.colCount);
    //             // var l = (t.x * 100);
    //             //
    //             // _.config.collection[i].p.style.top = y + 'px';
    //             // _.config.collection[i].p.style.left = l + '%';
    //             // _.config.collection[i].p.style.width = _.config.collection[i].w + 'px';
    //             // _.config.collection[i].p.style.height = _.config.collection[i].h + 'px'; //// FIXME: this spacing hotfix (-4 or +4 pixels shift from aspect-ratio calc)
    //             _.grid.push({
    //                 minX: Math.round(t.minX),
    //                 maxX: Math.round(t.minX + elm.w),
    //                 y: Math.round(t.y + elm.h),
    //             });
    //             t.minX += Math.round(elm.w);
    //
    //             // console.table(_.grid);
    //             // console.log(t);
    //             if(t.minX >= t.maxX) {
    //                 let currIndex = _.grid.map((item) => item).indexOf(t);
    //                 console.log(currIndex);
    //                 _.grid.splice(currIndex, 1);
    //             }
    //             console.log('\n\n\n\n');
    //
    //
    //
    //             //
    //             // _.grid.push({
    //             //     x: index / _.options.colCount,
    //             //     y: Math.round(_.config.collection[i].h + y),
    //             // });
    //
    //         }
    //     },
    //
    //     find: function(elm) {
    //         var _ = this;
    //
    //         return _.grid.reduce(function(prev, curr) {
    //             console.table({prev,curr, elm});
    //
    //             // if(prev.minX + elm.w <= prev.)
    //             // if (prev.y < curr.y || prev.x < curr.x) return prev;
    //             // if (prev.y > curr.y || prev.x > curr.x) return curr;
    //             // return 0;
    //         });
    //     }
    //
    //
    // }

    $.fn.aedifico = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].aedifico = new Aedifico(_[i], arguments[0]);
        }
        return _;
    };
}));
