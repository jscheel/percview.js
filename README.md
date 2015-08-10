# percview.js

This plugin will calculate the visible percentage of elements as the page is scrolled. It it still in
active development and doesn't really do a good job of reflecting an abstracted case yet. But, I needed
it for some scrolling behaviors, so this is what you get. Will document once I settle on how this
plugin actually needs to behave for users.

## Initializing

```
percview.init({
  elements: [string | NodeList | Node]
  callback: [function]
});
```

## Callback

```
  function(elementsHash) {
    var percentVisible = elementsHash[element];
  }
```