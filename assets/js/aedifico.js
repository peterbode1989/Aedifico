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
                cellCount: 12,
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
            minCells: 0, // the min-amount of cells
            maxCells: parseInt(_.options.cellCount), // the max amount of cells
            mheight: 0, // the min height of the row
            height: 0, // the max height of the row
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
            // REFACTOR!!!!

            var elm = _.config.children[i];

            // Retrieve the relevant classname of element
            var getClassName = $(elm).attr('class').split(' ').filter(function(e) {
                return e.indexOf(_.options.className) > -1
            });

            // Put everything in a arbitrary object
            var bin = {
                parent: null,
                child: false,
                target: elm,
                size: {
                    w: parseInt(getClassName[0].substring(_.options.className.length)),
                    h: Math.round(parseInt($(elm).outerHeight())),
                },
                offset: {
                    x: 0,
                    y: 0,
                },
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
            // Find the first DOM-element
            var elm = elms.filter(function(e) {
                return (!e.parent
                     && (e.size.w + currRow.minCells) <= currRow.maxCells)
            });

            // Check if any cells fit in the current row
            if(elm.length > 0) {
                // Get the first element
                elm = elm[0];

                // Update current element
                elm.offset.x = currRow.minCells;
                elm.parent = true;

                // Insert/update the row information
                currRow.minCells += elm.size.w;
                currRow.cells.push(elm);

                // If the new element has a greater height then the row,
                // update the current row
                if(elm.size.h < currRow.mheight) {
                    currRow.mheight = elm.size.h;
                }
                if(elm.size.h > currRow.height) {
                    if(currRow.mheight == 0) currRow.mheight = elm.size.h;
                    currRow.height = elm.size.h;
                }
            } else {
                // Find the a open spot
                var xs = elms.filter(function(e) {
                    return (e.parent && !e.child
                         && (currRow.mheight == (e.size.h + e.offset.y)))
                });

                if(xs.length > 0) {
                    xs = xs[0];

                    var elm = elms.filter(function(e) {
                        return (!e.parent && (e.size.w <= xs.size.w))
                    });
                    console.log(elm);

                    if(elm.length > 0) {
                        elm = elm[0];


                        elm.offset.y = xs.offset.y + xs.size.h;
                        elm.offset.x = xs.offset.x;
                        elm.parent = true;
                        currRow.cells.push(elm);

                        if(elm.size.w < xs.size.w) {
                            // Create/add ghost cell
                            var temp = {
                                offset: {
                                    x: elm.size.w + xs.offset.x,
                                    y: xs.offset.y + xs.size.h,
                                },
                                size: {
                                    w: xs.size.w - elm.size.w,
                                    h: elm.size.h,
                                },
                                parent: true,
                                child: false,
                                target: null,
                            };
                            currRow.cells.push(temp);
                        }

                        xs.child = true;

                        if((elm.offset.y + elm.size.h) > currRow.mheight) {
                            currRow.mheight = (elm.offset.y + elm.size.h);
                        }


                        // break;
                    } else {
                        console.warn('BREAK Y');
                    }
                } else {
                    console.warn('BREAK X');
                }


            }



            index++;
        }

        // console.table(elms);
        // console.table(rows);

        _.apply();
    }

    Aedifico.prototype.apply = function() {
        var _ = this;

        for(var i = 0; i < _.config.rows.length; i++) {
            var row = _.config.rows[i];

            for(var j = 0; j < row.cells.length; j++) {
                var elm = row.cells[j];

                if (!elm.target) {

                    // draw ghost cells
                    var btn = document.createElement('div');
                    btn.className = 'ghost ' + _.options.className + elm.size.w;
                    _.config.parent.append(btn);
                    elm.target = btn;

                }
                elm.target.style.top = elm.offset.y + 'px';
                elm.target.style.left = 100 / (row.maxCells / elm.offset.x) + '%';
                elm.target.style.height = elm.size.h + 'px';



            }
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

    $.fn.aedifico = function() {
        var _ = this;
        for (let i = 0; i < _.length; i++) {
            _[i].aedifico = new Aedifico(_[i], arguments[0]);
        }
        return _;
    };
}));
