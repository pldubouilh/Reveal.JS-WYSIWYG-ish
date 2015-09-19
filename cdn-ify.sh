#! /bin/bash

if [ "$#" -ne 1 ]; then
    echo ""
    echo "CDN-ify your slides"
    echo "Find and replace all local deps by their CDNd Cloud(c)(r) equivalent"
    echo ""
    echo "Usage  : ./cdn-ify.sh myUberSlides.html"
    echo ""
    exit
fi


prefix='cdn-'
cat "$1" | sed -e 's/<link rel=\"stylesheet\" href=\"/<link rel=\"stylesheet\" href=\"https:\/\/cdn.rawgit.com\/pldubouilh\/Reveal.JS-WYSIWYG-ish\/gh-pages\//g' | sed -e 's/<script src=\"/<script src=\"https:\/\/cdn.rawgit.com\/pldubouilh\/Reveal.JS-WYSIWYG-ish\/gh-pages\//g' > "$prefix$1"
