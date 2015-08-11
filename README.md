# percview.js
This plugin will calculate the visible percentage of elements as the page is scrolled. It it still in
active development and doesn't really do a good job of reflecting an abstracted case yet. But, I needed
it for some scrolling behaviors, so this is what you get. Will document once I settle on how this
plugin actually needs to behave for users. I will also distribute to bower at that point.

## Initializing
You can initialize percview.js with one of three element selections:

* class name (without dot)
* list of elements
* single element

The callback will be called each time the window is scrolled.
```html
  <script src="percview.min.js"></script>
  <script>
    var pv = percview.init({
      elements: [String | NodeList | Node],  // You can pass a class name, list of elements, or single element
      callback: [function]                   // This function is called when the user scrolls the window
    });

    // or, if you are using require.js

    require(['percview'], function(percview){
      var pv = percview.init({
        elements: [String | NodeList | Node],
        callback: [function]
      });
    });

    // to destroy an instance
    percview.destroy(pv);
  </script>
```

## Callback
A hash keyed to the elements you are observing is returned. This is obviously not optimal, since javascript
doesn't actually support using objects as keys :\ I'll update this later to work differently.

There are three pieces of data returned on each callback:

* __percentageVisible__ - The percent amount of the element that is currently visible in the viewport.
* __percentageTraversed__ - The percent amount of the viewport the element has traversed, based on it's current direction.
* __direction__ - The current direction the element is traversing. _Only updates when the element moves into the visible range right now. Will fix this later._

```javascript
function(elementsHash) {
  var data = elementsHash[element];
  console.log(data);
}
```