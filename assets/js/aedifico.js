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
                colCount: 3, // the amount of cols to scroll when moving
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

                _.config.collection.push({
                    w: w,
                    h: (oh / ow) * w,
                    p: _.config.children[i],
                });
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

            var index = 0;
            for(var i = 0; i < _.config.collection.length; i++) {
                var y = _.grid[0].y;
                console.log(y);
                var w = (_.config.parentWidth / _.options.colCount);
                var l = (_.grid[0].x * 100);

                _.config.collection[i].p.style.top = y + 'px';
                _.config.collection[i].p.style.width = _.config.collection[i].w + 'px';
                _.config.collection[i].p.style.left = l + '%';


                _.grid.push({
                    x: index / _.options.colCount,
                    y: _.config.collection[i].h + y,
                });
                if(_.grid.length > _.options.colCount) {
                    _.grid = _.grid.slice(-_.options.colCount);
                }

                index++;
                if(index === 3) index = 0;
            }
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
