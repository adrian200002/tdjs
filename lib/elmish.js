
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
            const updatedModel = update(model, action);
            empty(root);
            view(signal, updatedModel, root)
        }
    }

    console.log(model)
    root.appendChild(view(model));
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

function div(attrlist, childnodes) {
    return create_element('div', attrlist, childnodes);
}

function label(attrlist, childnodes) {
    return create_element('label', attrlist, childnodes);
}

function ul(attrlist, childnodes) {
    return create_element('ul', attrlist, childnodes);
}

function li(attrlist, childnodes) {
    return create_element('li', attrlist, childnodes);
}

function button(attrlist, childnodes) {
    return create_element('button', attrlist, childnodes);
}

function a(attrlist, childnodes) {
    return create_element('a', attrlist, childnodes);
}

function span(attrlist, childnodes) {
    return create_element('span', attrlist, childnodes);
}

function footer(attrlist, childnodes) {
    return create_element('footer', attrlist, childnodes);
}

function strong(text) {
    const el = document.createElement('strong');
    el.innerHTML = text;

    return el;
}

function route(state, title, hash) {
    window.location.hash = hash;
    const new_state = JSON.parse(JSON.stringify(state));
    new_state.hash = hash;
    return new_state;
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
      text,
      main,
      div,
      label,
      ul,
      li,
      strong,
      button,
      span,
      footer,
      a,
      route,
      mount
    }
}