# reveal.js-wysiwyg-ish

A fine [reveal.js](https://github.com/hakimel/reveal.js/) hack to provide some kind of WYSIWYGness. Quick and dirty hack, full of jquery dark magic, but should do the job !

[A quick overview...](http://pldubouilh.github.io/Reveal.JS-WYSIWYG-ish/#/)

It can be used on its own, but a tiny node script can be run in order to automate the saving/[ilining](https://github.com/remy/inliner) process. Instead of downloading the entire webpage using your web browser, the app will instead connect to the script (if available) and send the webpage to it so it could be saved and inlined in the same folder.

To set this up :

```
git clone https://github.com/pldubouilh/Reveal.JS-WYSIWYG-ish.git
cd Reveal.JS-WYSIWYG-ish && npm install .
npm index
```

To export to PDF, I use [decktape](https://github.com/astefanutti/decktape).

### TODO
- Sometimes an error disables all control, solved calling dragging(). Can't seems to figure out what's triggering it... >> `uncaught Error: cannot call methods on draggable prior to initialization; attempted to call method 'destroy'`
