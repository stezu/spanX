/**
 * SpanX.js
 * Stephen Zuniga
 * MIT License
 */
(function () {

    /**
     * Class for reducing the depth of your website
     *
     * @class SpanX
     */
    function SpanX (options) {
        this.set(options);
    }

    // Shortcuts
    var proto = SpanX.prototype;

    /**
     * Default options for every SpanX instance
     */
    proto._defaultOptions = {
        maxDepth: 100
    };

    /**
     * Return the object containing options
     * If one doesn't exist, set them to the default
     *
     * @return {object} Options currently available for this instance
     */
    proto.getOptions = function () {
        return this._options;
    };

    /**
     * Loop through the stylesheets on the page and find any rules that style the z-index
     * Add the selector to an array with the index at the corresponding z-index
     *
     * @return {array} Selectors sorted by z-index
     */
    proto.getSelectors = function () {
        var stylesheets = document.styleSheets,
            selectors = [];

        // Loop through the pages stylesheets
        for (var i = 0; i < stylesheets.length; i++) {
            var rules = stylesheets[i].rules;

            // If the stylesheet doesn't contain any rules, go to the next one
            if (!rules) {
                continue;
            }

            for (var j = 0; j < rules.length; j++) {

                // If the current rule doesn't style the z-index, go to the next one
                if (!rules[j].style || !rules[j].style.zIndex) {
                    continue;
                }

                // If the z-index is a new one, add it to the selectors array
                if (!selectors[rules[j].style.zIndex]) {
                    selectors[rules[j].style.zIndex] = [];
                }
                selectors[rules[j].style.zIndex].push(rules[j].selectorText);
            }
        }

        return selectors;
    };

    /**
     * Get the selectors sorted by z-index and scale them to the optional limit
     */
    proto.init = function () {
        var options = this.getOptions(),
            selectors = this.getSelectors(),
            output = '',
            zIndex = 1;

        // Generate the css that will scale back the z-indices
        for (var i = 0; i < selectors.length; i++) {

            if (!selectors[i]) {
                continue;
            }

            var selectorString = selectors[i].join(', ');

            // Ensure that the z-index doesn't go above the max depth so it can fit in the device
            if (zIndex > options.maxDepth) {
                zIndex = options.maxDepth;
            }

            output += selectorString + ' { z-index: ' + zIndex + ' !important } ';
            zIndex++;
        }

        // Create a style element with the above styles
        var spanXStyle = document.createElement('style');
        spanXStyle.type = 'text/css';
        spanXStyle.id = 'spanX';
        spanXStyle.innerHTML = output;
        document.head.appendChild(spanXStyle);
    };

    /**
     * Update the options with the passed parameter(s)
     * If the options global is not set, set it to the default options
     * If the first parameter is an object, pass any new parameters to the options global
     * If the first parameter is a string, and the second parameter exists, update the option using the first parameter as a key
     *
     * @param {object|string} Object of options, or string of an option key
     * @param {mixed} Value to set if the first parameter is a string
     */
    proto.set = function (prop, value) {
        var objProp;

        // Set the options to the defaults if they aren't currently set
        if (!this._options) {
            this._options = this._defaultOptions;
        }

        // if an object is passed as the first parameter, loop through it
        if (typeof prop === 'object') {
            for (objProp in prop) {
                this.set(objProp, prop[objProp]);
            }
        }

        // otherwise assume we were given a property and update it
        else {
            this._options[prop] = value;
        }
    };

    // Expose the class via the global object
    this.SpanX = SpanX;
}.call(this));
