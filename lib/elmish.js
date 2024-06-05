/**
 * deletes all child nodes from parent element
 * @param {Object} node - the parent element which u want to delete child nodes from
 * @example 
 * // returns true once 'app node' is emptied 
 * empty(document.getElementById('app));
 */

function empty(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

/**
 * 
 * @param {Object} model - state of the app
 * @param {Function} update - function that updates the model when user interacts
 * @param {Function} view - function that updates the view after update
 * @param {String} root_element_id - the id of the root element
 */

function mount(model, update, view, root_element_id) {
    const root = document.getElementById(root_element_id);
    function signal(action) {
        return function callback() {
            const updated_model = update(model, action);
            empty(root);
            view(signal, updated_model, root);
        }
    }

    view(signal, model, root);
}

function add_attributes(attrlist, node) {
    if (Array.isArray(attrlist) && attrlist.length) {
        attrlist.forEach(el => {
            if (typeof el === 'function') { node.onclick = el; return node}

            const a = el.split('=');

            switch(a[0]) {
                case 'autofocus':
                    node.autofocus = true;
                    node.focus();
                    setTimeout(function() {
                      node.focus();
                    }, 200)
                    break;
                case 'class':
                    node.classList.add(a[1]);
                    break;
                case 'placeholder':
                    node.placeholder = a[1];
                    break;
                case 'id':
                    node.id = a[1];
                    break;
                default:
                    break;
            }
        })
    }

    return node;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      empty,
      add_attributes
    }
}