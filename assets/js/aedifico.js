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
                colCount: 3,
            };

            _.options = $.extend({}, _.defaults, settings);
            _.config = {
                parent: $(element).addClass(_.options.namespace),
                parentWidth: $(element).outerWidth(),
                children: [],
                collection: [],
            };

            _.build();
        }
        return Aedifico;
    }());

    Aedifico.prototype.__proto__ = {
        build: function() {
            var _ = this;
            _.config.children = _.config.parent.children('div');
            _.collect();
        },

        collect: function() {
            var _ = this;

            for(var i = 0; i < _.config.children.length; i++) {
                var ow = $(_.config.children[i]).outerWidth();
                var oh = $(_.config.children[i]).outerHeight();
                var w = (_.config.parentWidth / _.options.colCount);

                var bin = {
                    w: w,
                    h: Math.round((oh / ow) * w),
                    p: _.config.children[i],
                };

                _.config.collection.push(bin);
            }
            _.apply();
        },

        apply: function() {
            var _ = this;

            _.grid = [];
            for(var i = 0; i < _.options.colCount; i++) {
            	_.grid.push({
                    x: i / _.options.colCount,
                    y: 0,
                });
            }

            // IDEA: Refactor into multiple __proto__
            var index = 0;
            for(var i = 0; i < _.config.collection.length; i++) {
                let t = _.find();

                var y = t.y;
                var w = (_.config.parentWidth / _.options.colCount);
                var l = (t.x * 100);

                _.config.collection[i].p.style.top = y + 'px';
                _.config.collection[i].p.style.left = l + '%';
                _.config.collection[i].p.style.width = _.config.collection[i].w + 'px';
                // _.config.collection[i].p.style.height = _.config.collection[i].h + 'px'; //// FIXME: this spacing hotfix (-4 or +4 pixels shift from aspect-ratio calc)


                // console.table(_.grid);
                // console.log(t);
                let currIndex = _.grid.map((item) => item).indexOf(t);
                // console.log(currIndex);
                _.grid.splice(currIndex, 1);

                _.grid.push({
                    x: index / _.options.colCount,
                    y: Math.round(_.config.collection[i].h + y),
                });


                index++;
                if(index === _.options.colCount) index = 0;
            }
        },

        find: function() {
            var _ = this;

            return _.grid.reduce(function(prev, curr) {
                if (prev.y < curr.y || prev.x < curr.x) return prev;
                if (prev.y > curr.y || prev.x > curr.x) return curr;
                return 0;
            });
        }
    }

    $.fn.aedifico = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].aedifico = new Aedifico(_[i], arguments[0]);
        }
        return _;
    };
}));
