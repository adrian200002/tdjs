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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      empty,
    }
}