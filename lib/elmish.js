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
    if (attrlist && Array.isArray(attrlist) && attrlist.length > 0) {
        attrlist.forEach(el => {
            if (typeof el === 'function') { node.onclick = el; return node}

            const a = el.split('=');

            switch(a[0]) {
                case 'autofocus':
                    node.autofocus = true;
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
                case 'data-id':
                    node.dataset.id = a[1];
                    break;
                case 'for':
                    node.setAttribute('for', a[1]);
                    break;
                case 'type':
                    node.setAttribute('type', a[1]);
                    break;
                case 'style':
                    const styles = a[1].split(';');
                    styles.forEach(el => {
                        if (!el) {
                            return;
                        }
                        const [style, value] = el.trim().split(':');
                        console.log(style, value)
                        node.style[style] = value;
                    })
                case 'checked':
                    node.checked = a[1];
                    break;
                case 'href':
                    node.href = a[1];
                    break;
                default:
                    break;
            }
        })
    }

    return node;
}

function append_childnodes(childnodes, parent) {
    if (childnodes && Array.isArray(childnodes) && childnodes.length > 0) {
        childnodes.forEach(el => {
            parent.appendChild(el);
        })
    }

    return parent;
}

function create_element(type, attrlist, childnodes) {
    return append_childnodes(childnodes, 
        add_attributes(attrlist, document.createElement(type))
    );
}

function section(attrlist, childnodes) {
    return create_element('section', attrlist, childnodes);
}

function header(attrlist, childnodes) {
    return create_element('header', attrlist, childnodes);
}

function input(attrlist, childnodes) {
    return create_element('input', attrlist, childnodes);
}

function h1(attrlist, childnodes) {
    return create_element('h1', attrlist, childnodes);
}

function main(attrlist, childnodes) {
    return create_element('main', attrlist, childnodes);
}

function text(text) {
    return document.createTextNode(text);
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      empty,
      add_attributes,
      append_childnodes,
      section,
      header,
      input,
      h1,
      text
    }
}