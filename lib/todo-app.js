// const {h1, header, strong, a, span, footer ,section, li, ul, div, input, label, button, text } = require('./elmish.js');

const initial_model = {
    todos: [],
    hash: '#/'
}

/**
 * 
 * @param {String} action - the desired action to perform on the model
 * @param {Object} model - the Apps's data "state"
 * @param {String} data - data we want to apply to the item
 * @returns {Object} new_model - the modified model
 */

function update(action, model, data) {
    let new_model = JSON.parse(JSON.stringify(model));
    switch(action) {
        case 'ADD':
            new_model.todos.push({
                id: new_model.todos.length + 1,
                title: data,
                done: false
            })
            break;
        case 'TOGGLE':
            new_model.todos.forEach(el => {
                if (el.id === data) {
                    el.done = !el.done;
                }
            })
            break;
        default: return model;  
    }

    return new_model;
}

function render_item(item) {
    return li(['data-id=' + item.id,
        'id=' + item.id,
        item.done ? 'class=completed' : '',
    ], [
        div(['class=view'], [
            input(['class=toggle', 'type=checkbox', item.done ? 'checked=true' : ''], []),
            label([], [text(item.title)]),
            button(['class=destroy'], [])
        ])
    ])
}

function render_main(model) {
    return (
      section(["class=main", "style=display: block;"], [
        input(["id=toggle-all", "class=toggle-all", "type=checkbox"], []),
        label(["for=toggle-all"], [ text("Mark all as complete") ]),
        ul(["class=todo-list"],
          model.todos.map(function (item) { return render_item(item) })
        )
      ])
    )
  }

function render_footer(model) {
    const items_left = model.todos.filter(el => !el.done).length;
    return (
        footer(['class=footer'], [
            span(['class=todo-count', 'id=count'], [
                strong(items_left.toString()),
                text(items_left > 1 ? ' items left' : ' item left')
            ]),
            ul(['class=filters'], [
                li([], [
                    a(['href=#/', window.location.hash.replace('about:blank', '') === '#/' ? 'class=selected' : ''], [text('All')])
                ]),
                li([], [
                    a(['href=#/active', window.location.hash.replace('about:blank', '') === '#/active' ? 'class=selected' : ''], [text('Active')])
                ]),
                li([], [
                    a(['href=#/completed', window.location.hash.replace('about:blank', '') === '#/completed' ? 'class=selected' : ''], [text('Completed')])
                ])
            ]),
            button(['class=clear-completed'], [text('Clear completed')])
        ])
    )
}

function view(model) {
    return (
      section(["class=todoapp"], [
        header(["class=header"], [
          h1([], [
            text("todos")
          ]),
          input([
            "id=new-todo",
            "class=new-todo",
            "placeholder=What needs to be done?",
            "autofocus"
          ], [])
        ]),
        render_main(model),
        render_footer(model)
      ])
    );
  }

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        model: initial_model,
        update,
        render_item,
        render_main,
        render_footer,
        view
    }
}