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
!function(t,e,o){"use strict";function n(t,e){var o=this;return this.uid=e,t=t||{},this.elements=t.elements instanceof Array?Array.prototype.slice.call(t.elements):t.elements instanceof Node?[t.elements]:Array.prototype.slice.call("string"==typeof t.elements?r.getElementsByClassName(t.elements):r.getElementsByClassName("percview")),"function"==typeof t.callback&&(this.callback=t.callback),this.viewportOffset="number"==typeof t.viewportOffset?t.viewportOffset:0,this.elementOffsets={},this.positions={},this.windowHeight,this.calculateOffsets=this.calculateOffsets.bind(o),this.calculatePositions=this.calculatePositions.bind(o),setTimeout(function(){o.calculateOffsets(),o.calculatePositions()},1),this}function i(t){/**
     * @license This method is modified from the original, which is licensed under the MIT License, Copyright (c) 2010-2015 Google, Inc. http://angularjs.org
     */
var e={top:0,left:0};typeof t.getBoundingClientRect!==o&&(e=t.getBoundingClientRect());var n=s();return{top:e.top+n,bottom:e.bottom+n,height:e.height}}function s(){return(t.pageYOffset||r.scrollTop)-(r.clientTop||0)}function l(){for(var t in m)a(m[t])}function a(t){p(function(){t.calculateOffsets.apply(t),t.calculatePositions.apply(t)})}var r,c,p=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.msRequestAnimationFrame||t.oRequestAnimationFrame||function(e){t.setTimeout(e,1e3/60)},m={},u=0,f={init:function(i){r===o&&(r=e.documentElement);var s=new n(i,"uid_"+ ++u);return 0===Object.keys(m).length&&(t.addEventListener("resize",l),t.addEventListener("scroll",l),c=setInterval(l,800)),m[s.uid]=s,s},destroy:function(e){m[e.uid]!==o&&delete m[e.uid],0===Object.keys(m).length&&(t.removeEventListener("resize",l),t.removeEventListener("scroll",l),clearInterval(c))}};n.prototype.calculateOffsets=function(){for(var e=this.elements.length-1;e>=0;e--)this.elementOffsets[this.elements[e]]=i(this.elements[e]);this.windowHeight=t.innerHeight},n.prototype.calculatePositions=function(){for(var t=this.elements.length-1;t>=0;t--)this.positions[this.elements[t]]=this.calculatePosition(this.elements[t]);this.callback&&this.callback.apply(this,[this.positions])},n.prototype.calculatePosition=function(t){var e=s(),n=this.windowHeight-this.viewportOffset,i={top:e+this.viewportOffset,bottom:e+n},l=this.elementOffsets[t],a={top:l.top-i.top+this.viewportOffset,bottom:i.bottom-l.bottom+this.viewportOffset},r=this.positions[t],c={percentageVisible:0,percentageTraversed:0,direction:r?r.direction:o};return l.top<i.top||l.bottom>i.bottom?l.top>i.top||l.bottom<i.bottom?l.top<i.bottom&&l.bottom>i.top?l.top>i.bottom||l.top<i.top?l.top>i.top||l.bottom<i.top?(c.percentageVisible=0,c.percentageTraversed=0):(c.percentageVisible=(l.bottom-i.top)/l.height*100,r===o||0===r.percentageVisible||"down"===r.direction?(c.direction="down",c.percentageTraversed=100-a.bottom/n*100):c.percentageTraversed=(n-a.top)/n*100):(c.percentageVisible=(i.bottom-l.top)/l.height*100,r===o||0===r.percentageVisible||"up"===r.direction?(c.direction="up",c.percentageTraversed=(n-a.top)/n*100):c.percentageTraversed=100-a.bottom/n*100):(c.percentageVisible=0,c.percentageTraversed=0):(c.percentageVisible=100,c.percentageTraversed=100):(c.percentageVisible=100,c.percentageTraversed=r&&"up"===r.direction?(n-a.top)/n*100:r&&"down"===r.direction?100-a.bottom/n*100:0),c.percentageTraversed=Math.min(100,Math.max(0,c.percentageTraversed)),c},"function"==typeof define&&define.amd?define([],function(){return f}):"undefined"!=typeof module&&module.exports?module.exports=f:t.percview=f}(window,document);