'use strict';

class TabsManual {
    constructor(groupNode) {

        this.firstTab = null;
        this.lastTab = null;

        this.liElements = Array.from(document.querySelectorAll('#nav li'));
        this.tabs  = [];
        
        this.liElements.forEach((li) => {
          const a = li.querySelector('a');
          if (a) {
            this.tabs.push(a);
          }
        });
        this.tabpanels = [];

        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];
            const tabpanel = document.getElementById(tab.getAttribute('aria-controls'));
            // tab.tabIndex = -1; comment this code to allow move to the next tab using Tab keyboard
            tab.setAttribute('aria-selected', 'false');
            this.tabpanels.push(tabpanel);
            tab.addEventListener('keydown', this.onKeydown.bind(this));
            tab.addEventListener('click', this.onClick.bind(this));

            if (!this.firstTab) {
                this.firstTab = tab;
            }
            this.lastTab = tab;
        }

        this.setSelectedTab(this.firstTab);
    }

    setSelectedTab(currentTab) {
        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];
            if (currentTab === tab) {
                tab.setAttribute('aria-selected', 'true');
                // tab.removeAttribute('tabindex');  comment this code to allow move to the next tab using Tab keyboard
                this.liElements[i].classList.add('is-active');
                this.tabpanels[i].style.display = "block";
            } else {
                tab.setAttribute('aria-selected', 'false');
                // tab.tabIndex = -1;  comment this code to allow move to the next tab using Tab keyboard
                this.liElements[i].classList.remove('is-active');
                this.tabpanels[i].style.display = "none";
            }
        }
    }

    moveFocusToTab(currentTab) {
        currentTab.focus();
    }

    moveFocusToPreviousTab(currentTab) {
        let index;

        if (currentTab === this.firstTab) {
            this.moveFocusToTab(this.lastTab);
        } else {
            index = this.tabs.indexOf(currentTab);
            this.moveFocusToTab(this.tabs[index - 1]);
        }
    }

    moveFocusToNextTab(currentTab) {
        let index;

        if (currentTab === this.lastTab) {
            this.moveFocusToTab(this.firstTab);
        } else {
            index = this.tabs.indexOf(currentTab);
            this.moveFocusToTab(this.tabs[index + 1]);
        }
    }

    /* EVENT HANDLERS */

    onKeydown(event) {
        let tgt = event.currentTarget;
        let flag = false;

        switch (event.key) {
            case 'ArrowLeft':
                this.moveFocusToPreviousTab(tgt);
                flag = true;
                break;

            case 'ArrowRight':
                this.moveFocusToNextTab(tgt);
                flag = true;
                break;

            case 'Home':
                this.moveFocusToTab(this.firstTab);
                flag = true;
                break;

            case 'End':
                this.moveFocusToTab(this.lastTab);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // Since this example uses buttons for the tabs, the click onr also is activated
    // with the space and enter keys
    onClick(event) {
        this.setSelectedTab(event.currentTarget);
    }
}

// Initialize tablist

window.addEventListener('load', function () {
    const tablists = document.querySelectorAll('[role=tablist]');
    for (let i = 0; i < tablists.length; i++) {
        new TabsManual(tablists[i]);
    }
});

