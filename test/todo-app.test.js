const test = require('tape');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
require('jsdom-global')(html);
const app = require('../lib/todo-app.js');
const id = 'test-app';
const elmish = require('../lib/elmish.js')

test('todo `model` (Object) has desired keys', function (t) {
    const keys = Object.keys(app.model);
    t.deepEqual(keys, ['todos', 'hash'], "`todos` and `hash` keys are present.");
    t.true(Array.isArray(app.model.todos), "model.todos is an Array")
    t.end();
  });

test('todo `update` default case should return model unmodified', function (t) {
    const model = JSON.parse(JSON.stringify(app.model));
    const unmodified_model = app.update('UNKNOWN_ACTION', model);
    t.deepEqual(model, unmodified_model, "model returned unmodified");
    t.end();
});

test('add new todo to model.todos Array via update', function(t) {
    const model = JSON.parse(JSON.stringify(app.model));
    t.equal(model.todos.length, 0, 'initial model todos.length is 0');
    const modified_model = app.update('ADD', model, 'Add todo List Item');
    const expected = { id: 1, title: 'Add todo List Item', done: false };
    t.equal(modified_model.todos.length, 1, 'updated model.todos is 1');
    t.deepEqual(modified_model.todos[0], expected, 'todo list item added');
    t.end();
})

test('Toggle todo item from done=false to done=true', function(t) {
    const model = JSON.parse(JSON.stringify(app.model));
    const model_with_todo = app.update('ADD', model, 'toggle todo');
    const item = model_with_todo.todos[0];
    const model_todo_done = app.update('TOGGLE', model_with_todo, item.id);
    const expected = {id: 1, title: 'toggle todo', done: true };
    t.deepEqual(model_todo_done.todos[0], expected);
    const model_second_item = app.update('ADD', model_todo_done, 'toggle todo2');
    t.equal(model_second_item.todos.length, 2, 'model should have 2 todo items');
    const model_todo_undone = app.update('TOGGLE', model_second_item, item.id);
    const undone = {id: 1, title: 'toggle todo', done: false };
    t.deepEqual(model_todo_undone.todos[0], undone);
    t.end();
})

test('render_item HTML for a single Todo item', function(t) {
    const model = {
        todos: [
            { id: 1, title: 'first todo', done: true }
        ],
        hash: '#/'
    }

    document.getElementById(id).appendChild(app.render_item(model.todos[0]));
    const done = document.querySelectorAll('.completed')[0].textContent;
    t.equal(done, 'first todo');
    
    const checked = document.querySelectorAll('input')[0].checked;
    t.equal(checked, true, 'Done ' + model.todos[0].title + 'is done=true');

    elmish.empty(document.getElementById(id));
    t.end();
})

test('render main view elmish html dom functions' , function(t) {
    const model = {
        todos: [
            { id: 1, title: "Learn Elm Architecture", done: true },
            { id: 2, title: "Build Todo List App",    done: false },
            { id: 3, title: "Win the Internet!",      done: false }
        ],
        hash: '#/'
    }

    document.getElementById(id).appendChild(app.render_main(model));

    document.querySelectorAll('.view').forEach((item, index) => {
        t.equal(item.textContent, model.todos[index].title)
    })

    const inputs = document.querySelectorAll('input');

    [true, false, false].forEach((bol, index) => {
        t.equal(inputs[index + 1].checked, bol)
    })

    elmish.empty(document.getElementById(id));
    t.end();
})

test('render footer view using elmish html dom functions', function(t) {
    const model = {
        todos: [
          { id: 1, title: "Learn Elm Architecture", done: true },
          { id: 2, title: "Build Todo List App",    done: false },
          { id: 3, title: "Win the Internet!",      done: false }
        ],
        hash: '#/'
      };

    document.getElementById(id).appendChild(app.render_footer(model));

    const left = document.querySelector('span').innerHTML;
    t.equal(left, '<strong>2</strong> items left', 'remaining todos');

    const li = document.querySelectorAll('li');
    t.equal(li.length, 3, '3 <li> in footer');

    const link_texts = ['All', 'Active', 'Completed'];
    const hrefs = ['#/', '#/active', '#/completed'];

    document.querySelectorAll('a').forEach((item, index) => {
        
        t.equal(item.textContent, link_texts[index], 'text should match');

        t.equal(item.href.replace('about:blank', ''), hrefs[index]);
    })

    const clear = document.querySelector('.clear-completed').textContent;
    t.equal(clear, 'Clear completed');

    elmish.empty(document.getElementById(id));
    t.end();
})

test('render_footer 1 item left (pluarisation test)', function (t) {
    const model = {
      todos: [
        { id: 1, title: "Be excellent to each other!", done: false }
      ],
      hash: '#/'
    };

    document.getElementById(id).appendChild(app.render_footer(model));
  

    const left = document.getElementById('count').innerHTML;
    t.equal(left, "<strong>1</strong> item left", "Todos remaining: " + left);
  
    elmish.empty(document.getElementById(id));
    t.end();
  });

test('view renders whole todoapp using elmish functions', function(t) {
    document.getElementById(id).appendChild(app.view(app.model));

    t.equal(document.querySelector('h1').textContent, 'todos', 'h1 title = todos');

    const placeholder = document.querySelector('input').placeholder;
    t.equal(placeholder, 'What needs to be done?');

    const left = document.getElementById('count').innerHTML;
    t.equal(left, '<strong>0</strong> item left');

    elmish.empty(document.getElementById(id));
    t.end();
})