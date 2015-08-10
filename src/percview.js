/**
 * https://github.com/jscheel/percview.js
 *
 * @license The MIT License (MIT)
 *
 * Copyright (c) 2015 Jared A. Scheel
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


(function(window, document, undefined){
  'use strict';

  var nextFrame = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  function(callback){ window.setTimeout(callback, 1000/60); };

  var doc, _instance;
  var percview = {
    init: function(options) {
      return _instance || new PercView(options);
    },
    get: function() {
      return _instance;
    }
  };

  function PercView(options) {
    _instance = this;
    doc = document.documentElement;
    options = options || {};
    if (options.elements instanceof Array) {
      // Ensure it is an array, even if it's really a NodeList
      _instance.elements = Array.prototype.slice.call(options.elements);
    }
    else if (options.elements instanceof Node) {
      _instance.elements = [options.elements];
    }
    else if (typeof options.elements === 'string') {
      _instance.elements = Array.prototype.slice.call(doc.getElementsByClassName(options.elements));
    }
    else {
      _instance.elements = Array.prototype.slice.call(doc.getElementsByClassName('percview'));
    }
    if (typeof options.callback === 'function') {
      _instance.callback = options.callback;
    }

    _instance.elementOffsets = {};
    _instance.calculateOffsets();
    window.addEventListener('resize', _instance._handleResize);
    window.addEventListener('scroll', _instance._handleScroll);

    return _instance;
  }

  PercView.prototype._handleResize = function() {
    nextFrame(_instance.calculateOffsets);
  };

  PercView.prototype._handleScroll = function() {
    nextFrame(_instance.calculatePositions);
  };

  PercView.prototype.calculateOffsets = function() {
    for (var i = _instance.elements.length - 1; i >= 0; i--) {
      _instance.elementOffsets[_instance.elements[i]] = getOffset(_instance.elements[i]);
    }
  };

  PercView.prototype.calculatePositions = function() {
    var retVal = {};
    for (var i = _instance.elements.length - 1; i >= 0; i--) {
      retVal[_instance.elements[i]] = _instance.calculatePosition(_instance.elements[i]);
    }
    if (_instance.callback) {
      _instance.callback.apply(_instance, [retVal]);
    }
  };

  PercView.prototype.calculatePosition = function(element) {
    var scrollOffsetY = getScrollOffsetY();
    var scrollOffsets = {
      top: scrollOffsetY,
      bottom: scrollOffsetY + window.innerHeight
    };
    var offsets = _instance.elementOffsets[element];
    // console.log(offsets.top + ',' + offsets.bottom + ',' + scrollOffsets.top + ',' + scrollOffsets.bottom);
    if ((offsets.top <= scrollOffsets.top && offsets.bottom >= scrollOffsets.bottom) || (offsets.top >= scrollOffsets.top && offsets.bottom <= scrollOffsets.bottom)) {
      // fully in view
      return 100;
    }
    else if (offsets.top >= scrollOffsets.bottom || offsets.bottom <= scrollOffsets.top) {
      // out of view
      return 0;
    }
    else if (offsets.top <= scrollOffsets.bottom && offsets.top >= scrollOffsets.top){
      // partially in view from bottom
      return ((scrollOffsets.bottom - offsets.top) / offsets.height) * 100;
    }
    else if (offsets.top <= scrollOffsets.top && offsets.bottom >= scrollOffsets.top) {
      // partially in view from top
      return ((offsets.bottom - scrollOffsets.top) / offsets.height) * 100;
    }
    else {
      console.log('no idea');
      // no idea
      return 0;
    }
  };

  function getOffset(element) {
    /**
     * @license This method is modified from the original, which is licensed under the MIT License, Copyright (c) 2010-2015 Google, Inc. http://angularjs.org
     */
    var box = {top: 0, left: 0};
    if (typeof element.getBoundingClientRect !== undefined) {
      box = element.getBoundingClientRect();
    }
    var scrollOffsetY = getScrollOffsetY();
    return {
      top: box.top + scrollOffsetY,
      bottom: box.bottom + scrollOffsetY,
      height: box.height
    };
  }

  function getScrollOffsetY() {
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  if(typeof define === 'function' && define.amd) {
    define([], function () {
      return percview;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = percview;
  } else {
    window.percview = percview;
  }
}(window, document));