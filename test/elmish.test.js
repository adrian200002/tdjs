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

test('elmish.add_attributes applies class attribute to a node', function(t) {
    const root = document.createElement(id);
    let div = document.createElement('div');
    div.id = 'divid';
    div = elmish.add_attributes(['class=sss'], div);
    root.appendChild(div);
    const nodes = root.getElementsByClassName('sss');
    t.equal(nodes.length, 1, 'div class applied');
    t.end();
})

test('elmish.add_atributes applies placeholder on input element', function(t) {
    const root = document.getElementById(id);
    let input = document.createElement('input');
    input.id = 'new-todo';
    input = elmish.add_attributes(['placeholder=What needs to be done?'], input);
    root.appendChild(input);
    const placeholder = document.getElementById('new-todo').placeholder;
    t.equal(placeholder, 'What needs to be done?');
    t.end();
})

test('elmish.add_atributes should not add unvalid attribute', function(t) {
    let div = document.createElement('div');
    div.id = 'divid';
    const clone = div.cloneNode(true);
    
    div = elmish.add_attributes(['unknown=as'], div);
    t.deepEqual(clone, div, "<div> has not been altered");
    t.end();
})

test.only('elmish.add_atributes should add autofocus attribute on input', function(t) {
    document.getElementById(id).appendChild(
        elmish.add_attributes(['class=todo', 'autofocus', 'id=new'],
        document.createElement('input')
        )
    )

    t.equal(document.getElementById('new'), document.activeElement);
    elmish.empty(document)
    t.end();
})