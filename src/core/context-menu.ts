import { BoundingBoxWH, EventHandler, EventObject } from "cytoscape";
import { MenuItem } from ".";
import { createElement, setStylesForElement } from "./dom-utils";

export const showContextMenu = (menu: HTMLElement): EventHandler => (
  event: EventObject
): void => {
  const selectedNodes = event.cy.nodes(":selected");
  const container = event.cy.container();
  let menuContainer = document.getElementById("menu-container");

  if (container) {
    if (selectedNodes.length === 1) {
      // this is where we show the context menu
      const node = selectedNodes[0];
      const containerBoundingBox = container.getBoundingClientRect();

      // This is the position relative to which we will show the menu
      const boundingBox = node.renderedBoundingBox({}) as BoundingBoxWH

      // create a container for the menu
      if (!menuContainer) {
        menuContainer = createElement({
          tag: "div",
          classes: "menu-container",
          id: "menu-container",
          styles: {
            position: "absolute",
            left: `0px`,
            top: `0px`,
            width: `${containerBoundingBox.width}px`,
            height: `${containerBoundingBox.height}px`,
            border: "1px solid #000"
          }
        });
      }

      // set styles for the menu
      setStylesForElement(menu, {
        position: "absolute",
        left: `${boundingBox.x1}px`,
        top: `${boundingBox.y1}px`,
        width: `${boundingBox.w}px`,
        height: `${boundingBox.h}px`,
        border: "1px solid #000"
      });
      menuContainer.appendChild(menu);

      // show the menu
      container.appendChild(menuContainer);
    }
  }
};

export const hideContextMenu: EventHandler = (event) => {
  const container = event.cy.container()
  const menuContainer = document.getElementById("menu-container");
  const selectedNodes = event.cy.nodes(":selected")

  if (container && menuContainer) {
    container.removeChild(menuContainer)
  }

  // unselect the selected node
  if (selectedNodes.length === 1) {
    selectedNodes[0].unselect();
  }
}

export const createMenu = (items: MenuItem[]): HTMLElement => {
  // Holder for all the elements of the context menu
  const menu = createElement({
    tag: "div",
    classes: "menu",
    styles: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  });

  // Create menu items
  items.forEach((item) => {
    // Create item container
    const menuItem = createElement({
      tag: "div",
      classes: "menu-item",
      styles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
      }
    });

    // create icon
    if (item.icon) {
      const icon = createElement({
        tag: "img",
        classes: "icon",
        styles: {
          marginRight: "8px"
        }
      });
      icon.setAttribute("src", item.icon);
      menuItem.appendChild(icon);
    }

    // create title
    const title = createElement({
      tag: "p",
      classes: "title"
    });
    title.innerHTML = item.title;
    menuItem.appendChild(title);

    // add click handler
    menuItem.onclick = item.onClick;

    // add to container;
    menu.appendChild(menuItem);
  });

  return menu;
};
