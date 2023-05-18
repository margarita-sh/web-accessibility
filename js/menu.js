const navbarMenu = document.getElementById("navbarMenu");
const navbarMainLinks = navbarMenu.querySelectorAll(".navbar-item > a");
const submenuLinks = navbarMenu.querySelectorAll("#servicesMenu a");
const submenuLists = document.getElementById("servicesMenu");
const firstLink = document.querySelector('ul[role="menubar"] > li:first-child > a');
const lastLink = document.querySelector('ul[role="menubar"] > li:last-child > a');

const firstSubmenuLink = document.querySelector('.sublist > li:first-child > a');
const lastSubmenuLink = document.querySelector('.sublist > li:last-child > a');

const arrayMainLinks = Array.from(navbarMainLinks);
const arraysubmenuLinks = Array.from(submenuLinks);

navbarMainLinks.forEach(a => {
    a.addEventListener('keydown', (event) => onKeydown(event));
});

submenuLinks.forEach(a => {
    a.addEventListener('keydown', (event) => onKeydown(event));
});

function onKeydown(event) {

    const key = event.key;
    const currentTarget = event.currentTarget;
    switch (key) {
        case ' ':
        case 'Enter':
            if (hasPopup(currentTarget)) {
                openSubmenu(currentTarget, true);
            }
            break;

        case 'Esc':
        case 'Escape':
            closeSubmenu();
            break;

        case 'Up':
        case 'ArrowUp':
            if (getMenuOrientation(currentTarget) === 'vertical') {
                setFocusToPreviousMenuitem(currentTarget, arraysubmenuLinks, 'submenu');
            } else if (hasPopup(currentTarget)) {
                openSubmenu(currentTarget, false);
            }
            break;

        case 'ArrowDown':
        case 'Down':
            if (getMenuOrientation(currentTarget) === 'vertical') {
                setFocusToNextMenuitem(currentTarget, arraysubmenuLinks, 'submenu');
            } else if (hasPopup(currentTarget)) {
                openSubmenu(currentTarget, true);
            }
            break;

        case 'Left':
        case 'ArrowLeft':
            setFocusToPreviousMenuitem(currentTarget, arrayMainLinks, 'menu');
            break;

        case 'Right':
        case 'ArrowRight':
            setFocusToNextMenuitem(currentTarget, arrayMainLinks, 'menu');
            break;

        case 'Home':
        case 'PageUp':
            if (getMenuOrientation(currentTarget) === 'horizontal') {
                setFocusToTheFirstElement(arrayMainLinks, 'menu');
            } else {
                setFocusToTheFirstElement(arraysubmenuLinks, 'submenu');
            }
            break;

        case 'End':
        case 'PageDown':
            let roleAttributeValue = currentTarget.getAttribute('role');
            if (roleAttributeValue && roleAttributeValue === 'menuitem') {
                event.preventDefault();
            }
            if (getMenuOrientation(currentTarget) === 'horizontal') {
                setFocusToTheLastElement(arrayMainLinks, 'menu');
            } else {
                setFocusToTheLastElement(arraysubmenuLinks, 'submenu');
            }
            break;
        default:
            break;
    }
};


function getMenuOrientation(node) {
    let orientation;
    const menubar = node.closest('[role="menubar"]');
    const menu = node.closest('[role="menu"]');

    if (menubar) {
        orientation = 'horizontal';
    }
    if (menu) {
        orientation = 'vertical';
    }

    return orientation;
}


function hasPopup(element) {
    return element.getAttribute('aria-haspopup') === 'true';
}

function closeSubmenu() {
    const elements = document.querySelectorAll('[aria-expanded]');

    let targetElement = null;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('aria-expanded') === 'true') {
            targetElement = elements[i];
            break;
        }
    }

    arrayMainLinks.forEach(function (item) {
        if (item === targetElement) {
            item.tabIndex = 0;
            item.setAttribute('aria-expanded', 'false');
            item.focus();
            submenuLists.classList.add('hidden');
        } else {
            item.tabIndex = -1;
        }
    });
}

function escapeMenu() {
    submenuLists.classList.add('hidden');
    const servicesLink = document.getElementById('servicesLink');
    servicesLink.setAttribute('aria-expanded', 'false');
    arrayMainLinks.forEach(function (item) {
        if (item === servicesLink) {
            item.tabIndex = 0;
            item.focus();
        } else {
            item.tabIndex = -1;
        }
    });
}

function setFocusToNextMenuitem(currentMenuitem, array, menuType) {
    const isMainMenu = menuType === 'menu';

    const lastElement = isMainMenu ? lastLink : lastSubmenuLink;
    const firstElement = isMainMenu ? firstLink : firstSubmenuLink;

    let newMenuitem;

    if (currentMenuitem === lastElement) {
        newMenuitem = firstElement;
    } else {
        const currentIndex = array.indexOf(currentMenuitem);
        newMenuitem = array[currentIndex + 1];
    }
    setFocusToMenuitem(newMenuitem, array);
}

function setFocusToPreviousMenuitem(currentMenuitem, array, menuType) {
    const isMainMenu = menuType === 'menu';

    const lastElement = isMainMenu ? lastLink : lastSubmenuLink;
    const firstElement = isMainMenu ? firstLink : firstSubmenuLink;

    let newMenuitem;
    if (currentMenuitem === firstElement) {
        newMenuitem = lastElement;
    } else {
        const currentIndex = array.indexOf(currentMenuitem);
        newMenuitem = array[currentIndex - 1];
    }
    setFocusToMenuitem(newMenuitem, array);
}

function setFocusToMenuitem(newMenuitem, array) {
    array.forEach(function (item) {
        if (item === newMenuitem) {
            if (hasPopup(item)) {
                showSubmenu(item);
            } else if (getMenuOrientation(item) === 'horizontal' && !hasPopup(item)) {
                closeSubmenu(item);
            }
            item.tabIndex = 0;
            newMenuitem.focus();
        } else {
            item.tabIndex = -1;
        }
    });
}

function showSubmenu(currentTarget) {
    currentTarget.nextElementSibling.classList.remove('hidden');
    currentTarget.setAttribute('aria-expanded', 'true');
}

function openSubmenu(currentTarget, isFirstFocusElement) {
    currentTarget.nextElementSibling.classList.remove('hidden');
    currentTarget.setAttribute('aria-expanded', 'true');
    if (isFirstFocusElement) {
        arraysubmenuLinks.forEach(function (item) {
            if (item === firstSubmenuLink) {
                item.tabIndex = 0;
                item.focus();
            } else {
                item.tabIndex = -1;
            }
        });
    } else {
        arraysubmenuLinks.forEach(function (item) {
            if (item === lastSubmenuLink) {
                item.tabIndex = 0;
                item.focus();
            } else {
                item.tabIndex = -1;
            }
        });
    }
}

function setFocusToTheFirstElement(array, menuType) {

    const isMainMenu = menuType === 'menu';
    const firstElement = isMainMenu ? firstLink : firstSubmenuLink;

    array.forEach(function (item) {
        if (item === firstElement) {
            item.tabIndex = 0;
            item.focus();
        } else {
            item.tabIndex = -1;
        }
    });
}

function setFocusToTheLastElement(array, menuType) {

    const isMainMenu = menuType === 'menu';
    const lastElement = isMainMenu ? lastLink : lastSubmenuLink;

    array.forEach(function (item) {
        if (item === lastElement) {
            item.tabIndex = 0;
            item.focus();
        } else {
            item.tabIndex = -1;
        }
    });
}
