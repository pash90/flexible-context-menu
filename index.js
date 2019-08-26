(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('cytoscape')) :
    typeof define === 'function' && define.amd ? define(['cytoscape'], factory) :
    (global = global || self, global.cytoscapeFlexibleContextMenu = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Remove elements matching the specified query
     * from the DOM tree
     */
    var DEFAULT_CREATE_OPTIONS = {
        tag: "div",
        classes: "",
    };
    var createElement = function (options) {
        if (options === void 0) { options = DEFAULT_CREATE_OPTIONS; }
        var element = document.createElement(options.tag);
        // Set the class names
        element.className = options.classes || "";
        element.id = options.id || "";
        // Apply styles and return
        return setStylesForElement(element, options.styles);
    };
    /**
     *
     * @param {HTMLElement} element
     * @param {CSSStyleDeclaration} styles
     */
    var setStylesForElement = function (element, styles) {
        if (!styles) {
            return element;
        }
        var styleKeys = Object.keys(styles);
        styleKeys.forEach(function (styleKey) {
            element.style[styleKey] = styles[styleKey];
        });
        return element;
    };

    var ANIMATION_DURATION = 150;
    var currentTarget = null;
    var nodeBoundingBox = null;
    var menuIsCurrentlyVisible = false;
    var containerRect;
    /**
     * Displays a context menu for the selected node in the graph
     * @param {MenuItem[]} items The items to display in the contextual menu
     */
    var showContextMenu = function (options) { return function (event) {
        var selectedNode = event.target;
        if (event.cy.container()) {
            containerRect = event.cy.container().getBoundingClientRect();
            // update current target
            if (currentTarget) {
                if (currentTarget.data("title") !== selectedNode.data("title")) {
                    if (menuIsCurrentlyVisible) {
                        removeMenu(true);
                        window.setTimeout(function () {
                            currentTarget = selectedNode;
                            displayMenu(options);
                        }, ANIMATION_DURATION / 2);
                    }
                }
            }
            else {
                currentTarget = selectedNode;
                displayMenu(options);
            }
        }
    }; };
    var displayMenu = function (options) {
        if (options.conditions.overall(currentTarget)) {
            // This is the position relative to which we will show the menu
            nodeBoundingBox = currentTarget.renderedBoundingBox({});
            // create a container for the menu
            var menuContainer = createElement({
                tag: "div",
                classes: "menu-container",
                id: "menu-container",
                styles: {
                    position: "absolute",
                    left: nodeBoundingBox.x1 - 32 + "px",
                    top: nodeBoundingBox.y1 - 32 + "px",
                    width: nodeBoundingBox.w + 64 + "px",
                    height: nodeBoundingBox.h + 64 + "px",
                    zIndex: "100",
                }
            });
            // Add menu
            menuContainer.appendChild(createMenu(options));
            // add click handler
            menuContainer.onclick = function (e) {
                e.stopImmediatePropagation();
                removeMenu(true);
            };
            // show the menu
            document.body.appendChild(menuContainer);
            // animate the menu
            animateMenuItems();
        }
        else {
            currentTarget.unselect();
        }
    };
    /**
     * Hides the context menu and deselects the selected element
     * @param {EventObject} event The Cytoscape event that triggered the function
     */
    var hideContextMenu = function (event) { return removeMenu(true); };
    /**
     * Removes the menu from the window
     * @param {boolean} unselectTarget Whether or not to unselect the selected element
     */
    var removeMenu = function (unselectTarget) {
        if (unselectTarget === void 0) { unselectTarget = false; }
        if (menuIsCurrentlyVisible) {
            menuIsCurrentlyVisible = false;
            var menuContainer_1 = document.getElementById("menu-container");
            if (menuContainer_1) {
                unanimateMenuItems();
                window.setTimeout(function () {
                    if (menuContainer_1) {
                        document.body.removeChild(menuContainer_1);
                        if (currentTarget && unselectTarget) {
                            currentTarget.unselect();
                            currentTarget = null;
                        }
                    }
                }, ANIMATION_DURATION / 2);
            }
        }
    };
    /**
     * Creates a contextual menu for the selected node
     * @param {Options} options
     */
    var createMenu = function (options) {
        var items = options.items, closeIcon = options.closeIcon, condition = options.conditions.menuItem;
        // Holder for all the elements of the context menu
        var menu = createElement({
            tag: "div",
            id: "menu",
            styles: {
                position: "relative",
                width: "inherit",
                height: "inherit",
            }
        });
        var bounds = getBounds();
        // Create menu items
        items.forEach(function (item, index) {
            // Create item container
            var isItemInteractable = condition(item.title, currentTarget);
            var menuItem = createElement({
                tag: "div",
                classes: "menu-item",
                styles: __assign({ display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "50%", color: "#000", boxShadow: "0px 0px 16px 8px rgba(0, 0, 0, 0.16)", backgroundColor: isItemInteractable ? "#ffffff" : "#d8d8d8", cursor: isItemInteractable ? "pointer" : "not-allowed", position: "absolute", zIndex: "10" }, getPositionForItemWithIndex(index, items.length, bounds))
            });
            // create icon
            if (item.icon) {
                var icon = createElement({
                    tag: "img",
                    classes: "icon",
                });
                icon.setAttribute("src", item.icon);
                menuItem.appendChild(icon);
            }
            else {
                // create title
                var title = createElement({
                    tag: "p",
                    classes: "title"
                });
                title.innerHTML = item.title;
                menuItem.appendChild(title);
            }
            // add click handler
            menuItem.onclick = isItemInteractable ?
                function (e) {
                    e.stopImmediatePropagation();
                    // execute action
                    item.onClick();
                    // remove the menu
                    removeMenu();
                } :
                function (e) { return e.stopImmediatePropagation(); };
            // add to container;
            menu.appendChild(menuItem);
        });
        // add close button
        menu.appendChild(getCloseButton(closeIcon));
        return menu;
    };
    /**
     * Creates a close button to dismiss the contextual menu
     * @param {any} icon
     * @param {BoundingBoxWH} boundingBox
     */
    var getCloseButton = function (icon) {
        var closeItem = createElement({
            tag: "div",
            id: "close-button",
            styles: {
                width: "32px",
                height: "32px",
                position: "absolute",
                left: containerRect.left + nodeBoundingBox.w / 2 + 20 + "px",
                top: containerRect.top + nodeBoundingBox.h / 2 + 16 + "px",
                backgroundColor: "#d8d8d8",
                cursor: "pointer",
                borderRadius: "50%",
                boxShadow: "0px 0px 16px 8px rgba(0, 0, 0, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: "1",
            }
        });
        // add icon
        var closeIcon = createElement({
            tag: "img"
        });
        closeIcon.setAttribute("src", icon);
        closeItem.appendChild(closeIcon);
        closeItem.onclick = function (e) {
            e.stopImmediatePropagation();
            removeMenu(true);
        };
        return closeItem;
    };
    /**
     * Calculates the bounds for the context menu with
     * respect to the selected node
     */
    var getBounds = function () {
        var r = nodeBoundingBox.w / 2;
        return {
            center: {
                x: nodeBoundingBox.w / 2,
                y: nodeBoundingBox.h / 2
            },
            radius: r < 80 ? 80 : r > 120 ? 120 : r
        };
    };
    /**
     * Calculates the final x & y coordinates for a menu item
     * @param {number} index
     * @param {number} numberOfItems
     * @param {Bounds} bounds
     */
    var getPositionForItemWithIndex = function (index, numberOfItems, bounds) {
        var angle = (numberOfItems % 2 === 0 ? -45 : -22.5) * (numberOfItems - 1 - (2 * index)) * Math.PI / 180;
        var calculatedPosition = {
            left: containerRect.left + bounds.center.x + bounds.radius * Math.cos(angle),
            top: containerRect.top + bounds.center.y + bounds.radius * Math.sin(angle)
        };
        return {
            left: calculatedPosition.left + "px",
            top: calculatedPosition.top + "px"
        };
    };
    /** Animates each menu item from their initial to final position */
    var animateMenuItems = function () {
        menuIsCurrentlyVisible = true;
        var menuItems = document.querySelectorAll(".menu-item");
        var closeButton = document.getElementById("close-button");
        var bounds = getBounds();
        menuItems.forEach(function (menuItem, index) {
            menuItem.animate([
                {
                    opacity: 0,
                    left: containerRect.left + nodeBoundingBox.w / 2 + "px",
                    top: containerRect.top + nodeBoundingBox.h / 2 + "px"
                },
                __assign({ opacity: 1 }, getPositionForItemWithIndex(index, menuItems.length, bounds)),
            ], {
                duration: ANIMATION_DURATION,
                direction: "normal",
                easing: "ease-in-out"
            });
        });
        closeButton.animate([
            {
                opacity: "0",
                left: containerRect.left + (nodeBoundingBox.w / 2) - 20 + "px",
            },
            {
                opacity: "1",
                left: containerRect.left + nodeBoundingBox.w / 2 + 20 + "px",
            }
        ], {
            duration: ANIMATION_DURATION,
            direction: "normal",
            easing: "ease-in-out"
        });
    };
    /** Returns each menu item to its original position */
    var unanimateMenuItems = function () {
        var menuItems = document.querySelectorAll(".menu-item");
        var closeButton = document.getElementById("close-button");
        var bounds = getBounds();
        menuItems.forEach(function (menuItem, index) {
            menuItem.animate([
                __assign({ opacity: 1 }, getPositionForItemWithIndex(index, menuItems.length, bounds)),
                {
                    opacity: 0,
                    left: containerRect.left + nodeBoundingBox.w / 2 + "px",
                    top: containerRect.top + nodeBoundingBox.h / 2 + "px"
                }
            ], {
                duration: ANIMATION_DURATION / 2,
                direction: "normal",
                easing: "ease-in-out"
            });
        });
        closeButton.animate([
            {
                opacity: "1",
                left: containerRect.left + nodeBoundingBox.w / 2 + 20 + "px",
            },
            {
                opacity: "0",
                left: containerRect.left + nodeBoundingBox.w / 2 - 20 + "px",
            }
        ], {
            duration: ANIMATION_DURATION / 2,
            direction: "normal",
            easing: "ease-in-out"
        });
    };
    var clearContextMenu = function () {
        currentTarget = null;
        nodeBoundingBox = null;
        menuIsCurrentlyVisible = false;
        containerRect = null;
    };

    /**
     *
     * @param {Core} this
     * @param {MenuItem[]} items
     *
     * Note: DO NOT CONVERT THIS FUNCTION TO ES6 OR LATER. ONCE
     * CONVERTED TO ES6, IT LOOSES THE CONTEXT FOR `this` WHICH
     * IS REQUIRED TO MAKE AN EXTENSION WORK.
     */
    function extension(options) {
        // Event listener to show the menu
        this.on("singleclick", "node", showContextMenu(options));
        // this.on("click", "node", showContextMenu(options));
        this.on("unselect", "node", clearContextMenu);
        // Event listeners to hide the menu
        this.on("drag zoom pan", hideContextMenu);
        this.on("click", function (e) {
            if (e.target === e.cy) {
                hideContextMenu();
            }
        });
        return this;
    }

    function register(cy) {
        if (!cy) {
            return;
        }
        // Initialize extension
        // Register extension
        var extensionName = "flexibleContextMenu";
        cy("core", extensionName, extension);
        // cy('collection', extensionName, extension);
        // cy('layout', extensionName, extension);
        // cy('renderer', extensionName, extension);
    }
    if (typeof window.cytoscape !== "undefined") {
        register(window.cytoscape);
    }

    return register;

}));
//# sourceMappingURL=index.js.map
