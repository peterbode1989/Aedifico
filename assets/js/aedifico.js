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

            // Start the init process
            _.init();
        }
        return Aedifico;
    }());

    Aedifico.prototype.init = function() {
        var _ = this;

        // Clear children
        _.config.children = [];
        // Fill array with children of parent
        _.config.children = _.config.parent.children('div');

        // Add default row to rows
        _.config.rows.push({
            cells: [], // contains all added cells
            filled: 0, // the amount filled
            height: 0, // the total height of the row
        });

        // Start collecting data
        _.collect();
    }



    Aedifico.prototype.collect = function() {
        var _ = this;

        // Reset collection
        _.config.collection = [];

        // Loop through the children to start collecting data
        for(var i = 0; i < _.config.children.length; i++) {

            // Retrieve the relevant classname of element
            var getClassName = $(_.config.children[i]).attr('class').split(' ').filter(function(e) {
                return e.indexOf(_.options.className) > -1
            });

            // Put everything in a arbitrary object
            var bin = {
                target: _.config.children[i],
                parent: {},
                x: parseInt(getClassName[0].substring(_.options.className.length)),
                y: Math.round(parseInt($(_.config.children[i]).outerHeight())),
                p: false,
                rowIndex: 0,
                py: 0,
            };

            // Add object bin to collection
            _.config.collection.push(bin);
        }

        // Start adding elements to the row
        _.add();
    }

    Aedifico.prototype.add = function() {
        var _ = this;

        // Create shorthand to the collection
        var elms = _.config.collection;
        var rows = _.config.rows;

        // Create shorthand to the current row to write to
        var currRow = rows[rows.length-1];

        // Set while loop index
        // Warning! Everytime you add a cell, you need to increment this value
        var index = 0;
        while(index < elms.length) {
            var writeCell = false;
            var cell = {
                x: currRow.filled,
                y: 0,
                rowIndex: rows.length-1,
                py: 0,
            };

            var elm = elms.filter(function(elm) {
                return (!elm.p && (elm.x + currRow.filled <= _.options.colCount))
            });
            // console.log(elm);

            if(elm.length == 0) {
                writeCell = true;
                // find open spot below cell?
                cell = elms.filter(function(elm) {
                    return (elm.p && elm.rowIndex == rows.length-1 && ((currRow.height - elm.y) > 0))
                });

                if(cell.length > 0) {
                    cell = {
                        x: cell[0].parent.x,
                        y: cell[0].y + cell[0].parent.py,
                        py: cell[0].y + cell[0].parent.y,
                        rowIndex: cell[0].rowIndex,
                    };

                    var space = currRow.height - cell.y;
                    var elm = elms.filter(function(elm) {
                        return (!elm.p && (parseInt(elm.y) <= space))
                    });
                } else {
                    console.log('this happens');
                }
            }
            // console.log(elm);

            // var elm = elms[index];

            if(elm.length > 0) {
                elm = elm[0];

                if(elm.y > currRow.height) currRow.height = elm.y;
                elm.p = true;
                elm.rowIndex = cell.rowIndex;

                console.log(cell);

                elm.parent = cell;

                currRow.cells.push(elm);
                currRow.filled += elm.x;
            } else {
                // Add default row to rows
                _.config.rows.push({
                    cells: [], // contains all added cells
                    filled: 0, // the amount filled
                    height: 0, // the total height of the row
                });

                currRow = rows[rows.length-1];

                index--;
            }

            index++;
        }

        // console.table(elms);
        console.table(rows);

        _.apply();
    }

    Aedifico.prototype.apply = function() {
        var _ = this;

        var offsetY = 0;

        for(var i = 0; i < _.config.rows.length; i++) {
            var row = _.config.rows[i];



            for(var j = 0; j < row.cells.length; j++) {
                var child = row.cells[j];
                console.log(child);
                child.target.style.top = (offsetY + child.parent.py) + 'px';
                child.target.style.left = (child.parent.x > 0 ? (100 / (_.options.colCount / child.parent.x)) : 0) + '%';
                // child.target.style.height = child.y + 'px';

            }
            offsetY = row.height;
        }
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
