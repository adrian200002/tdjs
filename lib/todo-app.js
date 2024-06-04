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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        model: initial_model,
        update,
    }
}