# Bookmarklets

A collection of Bookmarklets.

### What are Bookmarklets??

A bookmarklet is a bookmark stored in a web browser that contains JavaScript commands that add new features to the browser.

### How to use Bookmarklets??

* Create a bookmark.
* Write a javascript function with `javascript:` at the beginning. in the URL location.
* Press the created bookmark where you want to use.

### How to create Bookmarklets??

typescript --[browserify]--> javascript(node.js) -> javascript(browser)

```sh

# TypeScript --> JavaScript(Node.js)

$ npx tsc

# Javascript(Node.js) --> Javascript(Browser)

$ browserify main.js -o app.js
``
