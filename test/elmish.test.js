const test = require('tape');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
require('jsdom-global')(html);
const elmish = require('../lib/elmish.js');
const id = 'test-app';


test('elmish.empty function should empty the content of node', function(t) {
    const exampleNode = document.createElement('div');
    const firstChild = document.createElement('a');
    exampleNode.appendChild(firstChild);
    const txt = document.createTextNode('a');
    firstChild.appendChild(txt);
    t.equal(firstChild.textContent, 'a', 'text content of added child should be a');
    elmish.empty(exampleNode);
    t.equal(exampleNode.childNodes.length, 0, 'node childs should be equal to 0 after emlish.empty');
    exampleNode.appendChild(firstChild);
    const secondChild = document.createElement('p');
    exampleNode.appendChild(secondChild);
    elmish.empty(exampleNode);
    t.equal(exampleNode.childNodes.length, 0);
    t.end();
})