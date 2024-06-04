const test = require('tape');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
require('jsdom-global')(html);
const app = require('../lib/todo-app.js');
const id = 'test-app';

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