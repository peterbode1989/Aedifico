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
                className: 'col-',
                colCount: 12,
            };

            _.options = $.extend({}, _.defaults, settings);
            _.config = {
                parent: $(element).addClass(_.options.namespace),
                parentWidth: $(element).outerWidth(),
                children: [],
                collection: [],
                rows: [],
                windowDelay: null,
            };

            $(window).on('resize.' + _.config.parent, $.proxy(_.resize, _));

            _.build();
        }
        return Aedifico;
    }());

    Aedifico.prototype.build = function() {
        var _ = this;
        _.config.children = [];
        _.config.children = _.config.parent.children('div');

        _.config.rows.push({
            cells: [],
            filled: 0,
            height: 0,
        })

        _.collect();
    }



    Aedifico.prototype.collect = function() {
        var _ = this;

        _.config.collection = [];
        for(var i = 0; i < _.config.children.length; i++) {
            // console.log($(_.config.children[i]).attr('class').split(' '));
            var className = $(_.config.children[i]).attr('class').split(' ').filter(function(e) {
                return e.indexOf(_.options.className) > -1
            });
            // One class only
            var cellAmount = className[0].substring(_.options.className.length);

            var bin = {
                // w: $(_.config.children[i]).outerWidth(),
                // h: $(_.config.children[i]).outerHeight(),
                // p: _.config.children[i],
                a: false,
                x: parseInt(cellAmount),
                y: parseInt($(_.config.children[i]).attr('data-h')),
            };


            _.config.collection.push(bin);
        }
        _.add();
    }

    Aedifico.prototype.add = function() {
        var _ = this;

        var elms = _.config.collection;
        console.table(elms);

        var rows = _.config.rows;
        var currentRow = rows[rows.length-1];
        var placed = elms.length;

        for(var i = 0; i < placed; i++) {
            var space = parseInt(_.options.colCount) - parseInt(currentRow.filled);

            var filtered = elms.filter(function(e) {
                return e.a == false
            });



            if(filtered.length > 0) {

                if((i < placed) && (currentRow.filled == _.options.colCount)) {
                    var found = filtered.filter(function(e) {
                        return e.y < currentRow.height
                    });
                    found = found[0];

                    if(!found) {
                        rows.push({
                            cells: [],
                            filled: 0,
                            height: 0,
                        });
                        currentRow = rows[rows.length-1];
                    }

                } else {
                    var found = filtered.find(function(e) {
                        return e.x <= space;
                    });
                }

                if(found) {
                    currentRow.filled += found.x;
                    currentRow.cells.push(found);
                    found.a = true;
                    placed += 1;
                    if(found.y > currentRow.height) currentRow.height = found.y;
                }







            } else {
                console.log('Done: all elements placed');
                break;
            }


        }

        console.table(rows);

    }



    Aedifico.prototype.resize = function() {
        var _ = this;

        if ($(_.config.parent).outerWidth() !== _.parentWidth) {
            clearTimeout(_.config.windowDelay);
            _.config.windowDelay = window.setTimeout(function() {
                _.config.parentWidth = $(_.config.parent).outerWidth();
                //console.log('resize?');
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
