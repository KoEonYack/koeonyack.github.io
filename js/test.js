
window.onload = function() {
    let element = document.getElementsByClassName("vue-terminal-input")[0];
    while (document.activeElement.id != element.id) {
        element.focus();
    }
};
