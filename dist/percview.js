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
!function(e,t,o){"use strict";function n(o){return a=this,s=t.documentElement,o=o||{},a.elements=o.elements instanceof Array?Array.prototype.slice.call(o.elements):o.elements instanceof Node?[o.elements]:Array.prototype.slice.call("string"==typeof o.elements?s.getElementsByClassName(o.elements):s.getElementsByClassName("percview")),"function"==typeof o.callback&&(a.callback=o.callback),a.elementOffsets={},a.calculateOffsets(),e.addEventListener("resize",a._handleResize),e.addEventListener("scroll",a._handleScroll),a}function l(e){/**
     * @license This method is modified from the original, which is licensed under the MIT License, Copyright (c) 2010-2015 Google, Inc. http://angularjs.org
     */
var t={top:0,left:0};typeof e.getBoundingClientRect!==o&&(t=e.getBoundingClientRect());var n=i();return{top:t.top+n,bottom:t.bottom+n,height:t.height}}function i(){return(e.pageYOffset||s.scrollTop)-(s.clientTop||0)}var s,a,c=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||e.oRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)},r={init:function(e){return a||new n(e)},get:function(){return a}};n.prototype._handleResize=function(){c(a.calculateOffsets)},n.prototype._handleScroll=function(){c(a.calculatePositions)},n.prototype.calculateOffsets=function(){for(var e=a.elements.length-1;e>=0;e--)a.elementOffsets[a.elements[e]]=l(a.elements[e])},n.prototype.calculatePositions=function(){for(var e={},t=a.elements.length-1;t>=0;t--)e[a.elements[t]]=a.calculatePosition(a.elements[t]);a.callback&&a.callback.apply(a,[e])},n.prototype.calculatePosition=function(t){var o=i(),n={top:o,bottom:o+e.innerHeight},l=a.elementOffsets[t];return l.top<=n.top&&l.bottom>=n.bottom||l.top>=n.top&&l.bottom<=n.bottom?100:l.top<n.bottom&&l.bottom>n.top?l.top>n.bottom||l.top<n.top?l.top>n.top||l.bottom<n.top?(console.log("no idea"),0):(l.bottom-n.top)/l.height*100:(n.bottom-l.top)/l.height*100:0},"function"==typeof define&&define.amd?define([],function(){return r}):"undefined"!=typeof module&&module.exports?module.exports=r:e.percview=r}(window,document);