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

test('elmish.add_atributes should add autofocus attribute on input', function(t) {
    document.getElementById(id).appendChild(
        elmish.add_attributes(['class=todo', 'autofocus', 'id=new'],
        document.createElement('input')
        )
    )
    setTimeout(() => {
        t.equal(document.getElementById('new'), document.activeElement);
        t.end();
    }, 200);
})

test('elmish.add_attributes set data-id attribute on <li> element', function(t) {
    const root = document.getElementById(id);
    let li = document.createElement('li');
    li.id = 'liid';
    li = elmish.add_attributes(['data-id=123'], li);
    root.appendChild(li);
    const data_id = document.getElementById('liid').getAttribute('data-id');
    t.equal(data_id, '123', 'data-id should be set on element');
    t.end();
})

test('elmish.add_attributes should add attribute for=togle-all for <label>', function(t) {
    const root = document.getElementById(id);
    let label = document.createElement('label');
    label.id = 'labelid'
    label = elmish.add_attributes(['for=toggle-all'], label);
    root.appendChild(label);
    const forAttr = document.getElementById('labelid').getAttribute('for');
    t.equal(forAttr, 'toggle-all', 'for attribute should be equal to for=togle-all')
    t.end();
})

test('elmish.add_attributes should add type=checkbox on input element', function(t) {
    const root = document.getElementById(id);
    let input = document.createElement('input');
    input.id = 'inputid';
    input = elmish.add_attributes(['type=checkbox'], input);
    root.appendChild(input);
    const check = document.getElementById('inputid').getAttribute('type');
    t.equal(check, 'checkbox', 'type = checkbox');
    t.end();
})

test('elmish.add_attributes should add inline styles', function(t) {
    const root = document.getElementById(id);
    let div = document.createElement('div');
    div.id = 'divid';
    div = elmish.add_attributes(['style=display:block;color:white'], div);
    const display = div.style.display;
    const color = div.style.color;
    t.equal(display, 'block', 'element should have inline style display block');
    t.equal(color, 'white', 'element should have inline style color white');
    t.end();
})

test('elmish.add_attributes checked=true on "done" item', function (t) {
    const root = document.getElementById(id);
    elmish.empty(root);
    let input = document.createElement('input');
    input = elmish.add_attributes(["type=checkbox", "id=item1", "checked=true"],
      input);
    root.appendChild(input);
    const checked = document.getElementById('item1').checked;
    t.equal(checked, true, '<input type="checkbox" checked=true>');
    t.end();
  });


test('elmish.add_attributes <a href="#/active">Active</a>', function (t) {
    const root = document.getElementById(id);
    elmish.empty(root);
    root.appendChild(elmish.add_attributes(
        ['href=#/active', 'id=active'],
        document.createElement('a')
    ));

    console.log('jsdom window.location.href', window.location.href);
    const href = document.getElementById('active').href.replace('about:blank', '');

    t.equal(href, "#/active")
    t.end();
})

test('elmish append_childnodes appends child DOM nodes to parent', function(t) {
    const root = document.getElementById(id);
    elmish.empty(root);
    const p = document.createElement('p');
    const sec = document.createElement('section');
    const a = document.createElement('a');
    elmish.append_childnodes([p, sec, a], root);

    t.equal(root.childNodes.length, 3, 'root should have 3 childnodes');
    elmish.empty(root);
    t.end();
})

test('elmish.section creates <section> html element', function(t) {
    const p = document.createElement('p');
    p.id = 'para';
    const txt = document.createTextNode('test');
    p.appendChild(txt);
    const section = elmish.section(['class=new-todo'], [p])
    document.getElementById(id).appendChild(section);
    t.equal(document.getElementById('para').textContent, 'test', '<section> <p>', 'test', '</p></section> works as expected!');
    elmish.empty(document.getElementById(id));
    t.end();
})

test('elmish creates <header> view using html element functions', function(t) {
    const {append_childnodes, section, header, input, h1, text } = elmish;
    append_childnodes(
        [
          section(['class=todoapp'], [
            header(['class=header'], [
                h1([], [text('todos')]),
                input(['id=new',
                     'class=new-todo',
                      'placeholder=What needs to be done?'],
                       [])
            ])
          ])  
        ], document.getElementById(id)
    );

    const place = document.getElementById('new').getAttribute('placeholder');
    t.equal(place, 'What needs to be done?', 'placeholder should be added');
    t.equal(document.querySelector('h1').textContent, 'todos', 'correct h1 title');
    elmish.empty(document.getElementById(id));
    t.end();
})

test('elmish creates <main> view using html element functions', function(t) {
    const { append_childnodes, text, main, div, input, label, ul, li, button } = elmish;

    append_childnodes([
        main(['class=main'], [
            div(['class=toggle-all-container'], [
                input(['class=toggle-all', 'type=checkbox'], []),
                label(['class=toggle-all-label', 'for=toggle-all'], [])
            ]),
            ul(['class=todo-list'], [
                li(['class=completed', 'data-id=first-todo'], [
                    div(['class=view'], [
                        input(['class=toggle', 'type=checkbox'], []),
                        label(['id=textlabel'], [text('Learn Elm Architecture')]),
                        button(['class=destroy'], [])
                    ])
                ])
            ])
        ]) //main
    ], document.getElementById(id));

    const completed = document.querySelectorAll('.completed')[0].textContent.trim();
    t.equal(completed, 'Learn Elm Architecture');
    const bol = document.querySelector('button').classList.contains('destroy');
    t.equal(bol, true,'appended button should have destroy class');
    elmish.empty(document.getElementById(id));
    t.end();
})

test.only('elmish creates <footer> view using html element functions', function(t) {
    const {append_childnodes, span, ul, footer, li, a, button, text, strong } = elmish;

    append_childnodes([footer(['class=footer'], [
        span(['class=count'], [
            strong('1 '),
            text('item left')
        ]),
        ul(['class=filters'], [
            li([], [
                a(['href=#/', 'class=selected'], [text('All')])
            ]),
            li([], [
                a(['href=#/active'], [text('Active')])
            ]),
            li([], [
                a(['href=#/completed'], [text('Completed')])
            ])
        ]),
        button(["class=clear-completed", "style=display:block;"],
            [text("Clear completed")])
    ])], document.getElementById(id));

    const left = document.querySelector('.count').textContent;
    t.equal(left, '1 item left', 'there is 1 todo item left');
    const clear = document.querySelector('.clear-completed').textContent;
    t.equal(clear, 'Clear completed', 'button inner text is Clear completed');
    const selected = document.querySelectorAll('.selected')[0].textContent;
    t.equal(selected, 'All', 'All is selected by default');
    elmish.empty(document.getElementById(id));
    t.end();
})
