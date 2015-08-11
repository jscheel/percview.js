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

  var doc;
  var intervalId;
  var instances = {};
  var uidCounter = 0;

  var percview = {
    init: function(options) {
      if (doc === undefined) {
        doc = document.documentElement;
      }
      var instance = new PercView(options, 'uid_' + ++uidCounter);
      if (Object.keys(instances).length === 0) {
        window.addEventListener('resize', updateAllInstances);
        window.addEventListener('scroll', updateAllInstances);
        intervalId = setInterval(updateAllInstances, 800);
      }
      instances[instance.uid] = instance;
      return instance;
    },
    destroy: function(instance) {
      if (instances[instance.uid] !== undefined) {
        delete instances[instance.uid];
      }
      if (Object.keys(instances).length === 0) {
        window.removeEventListener('resize', updateAllInstances);
        window.removeEventListener('scroll', updateAllInstances);
        clearInterval(intervalId);
      }
    }
  };

  function PercView(options, uid) {
    var _this = this;
    this.uid = uid;
    options = options || {};
    if (options.elements instanceof Array) {
      // Ensure it is an array, even if it's really a NodeList
      this.elements = Array.prototype.slice.call(options.elements);
    }
    else if (options.elements instanceof Node) {
      this.elements = [options.elements];
    }
    else if (typeof options.elements === 'string') {
      this.elements = Array.prototype.slice.call(doc.getElementsByClassName(options.elements));
    }
    else {
      this.elements = Array.prototype.slice.call(doc.getElementsByClassName('percview'));
    }
    if (typeof options.callback === 'function') {
      this.callback = options.callback;
    }
    if (typeof options.viewportOffset === 'number') {
      this.viewportOffset = options.viewportOffset;
    }
    else {
      this.viewportOffset = 0;
    }
    this.elementOffsets = {};
    this.positions = {};
    this.windowHeight;

    this.calculateOffsets = this.calculateOffsets.bind(_this);
    this.calculatePositions = this.calculatePositions.bind(_this);

    setTimeout(function(){
      _this.calculateOffsets();
      _this.calculatePositions();
    }, 1);

    return this;
  }

  PercView.prototype.calculateOffsets = function() {
    for (var i = this.elements.length - 1; i >= 0; i--) {
      this.elementOffsets[this.elements[i]] = getOffset(this.elements[i]);
    }
    this.windowHeight = window.innerHeight;
  };

  PercView.prototype.calculatePositions = function() {
    for (var i = this.elements.length - 1; i >= 0; i--) {
      this.positions[this.elements[i]] = this.calculatePosition(this.elements[i]);
    }
    if (this.callback) {
      this.callback.apply(this, [this.positions]);
    }
  };

  PercView.prototype.calculatePosition = function(element) {
    var scrollOffsetY = getScrollOffsetY();
    var windowHeight = this.windowHeight - this.viewportOffset;
    var scrollOffsets = {
      top: scrollOffsetY + this.viewportOffset,
      bottom: scrollOffsetY + windowHeight
    };
    var offsets = this.elementOffsets[element];
    var relativeOffsets = {
      top: offsets.top - scrollOffsets.top + this.viewportOffset,
      bottom: scrollOffsets.bottom - offsets.bottom + this.viewportOffset
    };
    var lastVal = this.positions[element];
    var retVal = {
      percentageVisible: 0,
      percentageTraversed: 0,
      direction: lastVal ? lastVal.direction : undefined
    };
    // console.log(offsets.top + ',' + offsets.bottom + ',' + scrollOffsets.top + ',' + scrollOffsets.bottom);
    if ((offsets.top >= scrollOffsets.top && offsets.bottom <= scrollOffsets.bottom)) {
      // fully in view
      retVal.percentageVisible = 100;
      if (lastVal && lastVal.direction === 'up') {
        retVal.percentageTraversed = ((windowHeight - relativeOffsets.top) / windowHeight) * 100;
      }
      else if (lastVal && lastVal.direction === 'down') {
        retVal.percentageTraversed = 100 - ((relativeOffsets.bottom / windowHeight) * 100);
      }
      else {
        retVal.percentageTraversed = 0;
      }
    }
    else if (offsets.top <= scrollOffsets.top && offsets.bottom >= scrollOffsets.bottom) {
      // fills more than view
      retVal.percentageVisible = 100;
      retVal.percentageTraversed = 100;
    }
    else if (offsets.top >= scrollOffsets.bottom || offsets.bottom <= scrollOffsets.top) {
      // out of view
      retVal.percentageVisible = 0;
      retVal.percentageTraversed = 0;
    }
    else if (offsets.top <= scrollOffsets.bottom && offsets.top >= scrollOffsets.top){
      // partially in view from bottom
      retVal.percentageVisible = ((scrollOffsets.bottom - offsets.top) / offsets.height) * 100;
      // if last value was out of view
      if (lastVal === undefined || lastVal.percentageVisible === 0 || lastVal.direction === 'up') {
        retVal.direction = 'up';
        retVal.percentageTraversed = ((windowHeight - relativeOffsets.top) / windowHeight) * 100;
      }
      else {
        retVal.percentageTraversed = 100 - ((relativeOffsets.bottom / windowHeight) * 100);
      }
    }
    else if (offsets.top <= scrollOffsets.top && offsets.bottom >= scrollOffsets.top) {
      // partially in view from top
      retVal.percentageVisible = ((offsets.bottom - scrollOffsets.top) / offsets.height) * 100;
      if (lastVal === undefined || lastVal.percentageVisible === 0 || lastVal.direction === 'down') {
        retVal.direction = 'down';
        retVal.percentageTraversed = 100 - ((relativeOffsets.bottom / windowHeight) * 100);
      }
      else {
        retVal.percentageTraversed = ((windowHeight - relativeOffsets.top) / windowHeight) * 100;
      }
    }
    else {
      // no idea
      retVal.percentageVisible = 0;
      retVal.percentageTraversed = 0;
    }
    retVal.percentageTraversed = (Math.min(100, Math.max(0, retVal.percentageTraversed)));

    return retVal;
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

  function updateAllInstances() {
    for (var instance_uid in instances) {
      updateInstance(instances[instance_uid]);
    }
  }

  function updateInstance(instance) {
    nextFrame(function(){
      instance.calculateOffsets.apply(instance);
      instance.calculatePositions.apply(instance);
    });
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