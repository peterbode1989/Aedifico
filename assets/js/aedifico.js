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

    Aedifico.prototype.createRow = function (elm) {
        var _ = this;
        // Add default row to rows
        _.config.rows.push({
            cells: [], // contains all added cells
            content: 0,
            size: {
                w: elm ? elm.size.w : parseInt(_.options.cellCount),
                h: 0,
            },
            offset: {
                x: elm ? elm.offset.x : 0,
                y: elm ? (elm.size.h + elm.offset.y) : 0,
            },
        });
    }

    Aedifico.prototype.add = function() {
        var _ = this;

        // Create shorthand to the collection
        var elms = _.config.collection;


        var rows = _.config.rows;
        // Add default row to rows
        _.createRow();

        var index = 0;
        while(index < elms.length) {

            var elm = elms.filter(function(e) {
                return !e.parent
            });

            console.log(elm);

            if(elm.length > 0) {
                elm = elm[0];

                var currRows = rows.filter(function(r) {
                    // return (r.content < r.size.w) && ((r.size.w - r.content) >= elm.size.w)
                    return r.content < r.size.w
                });

                console.log(currRows);

                // currRows = rows.sort(function(a, b) {
                //     if (a.city === b.city) {
                //         // Price is only important when cities are the same
                //         return b.price - a.price;
                //     }
                //     return a.city > b.city ? 1 : -1;
                // });
                // console.log(currRows);
                if(currRows.length > 0) {
                    var currRow = currRows[0];

                    var lastCell = currRow.cells[currRow.cells.length-1];
                    if(lastCell) {
                        elm.offset.x = lastCell.offset.x + lastCell.size.w;

                        _.createRow(lastCell);
                    }

                    elm.parent = true;
                    currRow.content += elm.size.w

                    if(currRow.content >= currRow.size.w) {
                        _.createRow(elm);
                    }

                    currRow.cells.push(elm);

                } else {
                    console.log('No room in current row for: ');
                    console.log(elm);
                }
            }
            // console.log(rows);
            // if(index == 2) break;
            console.log('');


            index++;
        }
        _.apply();
    }

    Aedifico.prototype.apply = function() {
        var _ = this;

        for(var i = 0; i < _.config.rows.length; i++) {
            var row = _.config.rows[i];

            for(var j = 0; j < row.cells.length; j++) {
                var elm = row.cells[j];

                // if (!elm.target) {
                //
                //     // draw ghost cells
                //     var btn = document.createElement('div');
                //     btn.className = 'ghost ' + _.options.className + elm.size.w;
                //     _.config.parent.append(btn);
                //     elm.target = btn;
                //
                // }
                elm.target.style.top = row.offset.y + elm.offset.y + 'px';
                elm.target.style.left = 100 / (_.options.cellCount / (row.offset.x + elm.offset.x)) + '%';
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
