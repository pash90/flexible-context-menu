import { BoundingBoxWH, EventHandler, EventObject, NodeSingular } from "cytoscape";
import { Options } from ".";
import { createElement } from "./dom-utils";

const ANIMATION_DURATION = 150
let currentTarget: NodeSingular | null = null
let nodeBoundingBox: BoundingBoxWH | null = null
let menuIsCurrentlyVisible: boolean = false

/**
 * Displays a context menu for the selected node in the graph
 * @param {MenuItem[]} items The items to display in the contextual menu
 */
export const showContextMenu = (options: Options): EventHandler => (
  event: EventObject
): void => {
  const selectedNode = event.target;
  const container = event.cy.container();

  if (container) {
    // update current target
    if (currentTarget) {
      if (currentTarget.data("title") !== selectedNode.data("title")) {
        if (menuIsCurrentlyVisible) {
          removeMenu(true)
          window.setTimeout(() => {
            currentTarget = selectedNode as NodeSingular
            displayMenu(options)
          }, ANIMATION_DURATION / 2)
        }
      }
    } else {
      currentTarget = selectedNode as NodeSingular
      displayMenu(options)
    }
  }
};

const displayMenu = (options: Options) => {
  if (options.conditions.overall(currentTarget!)) {
    // This is the position relative to which we will show the menu
    nodeBoundingBox = currentTarget!.renderedBoundingBox({}) as BoundingBoxWH

    // create a container for the menu
    const menuContainer = createElement({
      tag: "div",
      classes: "menu-container",
      id: "menu-container",
      styles: {
        position: "absolute",
        left: `${nodeBoundingBox.x1 - 32}px`,
        top: `${nodeBoundingBox.y1 - 32}px`,
        width: `${nodeBoundingBox.w + 64}px`,
        height: `${nodeBoundingBox.h + 64}px`,
        zIndex: "100",
      }
    });

    // Add menu
    menuContainer.appendChild(createMenu(options));

    // add click handler
    menuContainer.onclick = (e) => {
      e.stopImmediatePropagation();

      removeMenu(true);
    }

    // show the menu
    document.body.appendChild(menuContainer);

    // animate the menu
    animateMenuItems()
  } else {
    currentTarget!.unselect();
  }
}

/**
 * Hides the context menu and deselects the selected element
 * @param {EventObject} event The Cytoscape event that triggered the function
 */
export const hideContextMenu: EventHandler = (event) => removeMenu(true)

/**
 * Removes the menu from the window
 * @param {boolean} unselectTarget Whether or not to unselect the selected element
 */
const removeMenu = (unselectTarget: boolean = false) => {
  if (menuIsCurrentlyVisible) {
    menuIsCurrentlyVisible = false;

    const menuContainer = document.getElementById("menu-container");

    if (menuContainer) {
      unanimateMenuItems();

      window.setTimeout(() => {
        if (menuContainer) {
          document.body.removeChild(menuContainer);
          if (currentTarget && unselectTarget) {
            currentTarget.unselect();
            currentTarget = null;
          }
        }
      }, ANIMATION_DURATION / 2)
    }
  }
}

/**
 * Creates a contextual menu for the selected node
 * @param {Options} options
 * @param {BoundingBoxWH} boundingBox The bounding box for the selected node in the graph
 */
export const createMenu = (options: Options): HTMLElement => {
  const { items, closeIcon, conditions: { menuItem: condition } } = options;

  // Holder for all the elements of the context menu
  const menu = createElement({
    tag: "div",
    id: "menu",
    styles: {
      position: "relative",
      width: "inherit",
      height: "inherit",
    }
  });

  const bounds = getBounds();

  // Create menu items
  items.forEach((item, index) => {
    // Create item container
    const isItemInteractable = condition(item.title, currentTarget!);
    const menuItem = createElement({
      tag: "div",
      classes: "menu-item",
      styles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        color: "#000",
        boxShadow: "0px 0px 16px 8px rgba(0, 0, 0, 0.16)",
        backgroundColor: isItemInteractable ? "#ffffff" : "#d8d8d8",
        cursor: isItemInteractable ? "pointer" : "not-allowed",
        position: "absolute",
        zIndex: "10",
        ...getPositionForItemWithIndex(index, items.length, bounds)
      }
    });

    // create icon
    if (item.icon) {
      const icon = createElement({
        tag: "img",
        classes: "icon",
      });
      icon.setAttribute("src", item.icon);
      menuItem.appendChild(icon);
    } else {
      // create title
      const title = createElement({
        tag: "p",
        classes: "title"
      });
      title.innerHTML = item.title;
      menuItem.appendChild(title);
    }

    // add click handler
    menuItem.onclick = isItemInteractable ?
      (e) => {
        e.stopImmediatePropagation();

        // remove the menu
        removeMenu();

        // invoke
        window.setTimeout(item.onClick, ANIMATION_DURATION / 2)
      } :
      (e) => e.stopImmediatePropagation()

    // add to container;
    menu.appendChild(menuItem);
  });

  // add close button
  menu.appendChild(getCloseButton(closeIcon))

  return menu;
};

/**
 * Creates a close button to dismiss the contextual menu
 * @param {any} icon
 * @param {BoundingBoxWH} boundingBox
 */
const getCloseButton = (icon: any): HTMLElement => {
  const closeItem = createElement({
    tag: "div",
    id: "close-button",
    styles: {
      width: "32px",
      height: "32px",
      position: "absolute",
      left: `${nodeBoundingBox!.w / 2 + 20}px`,
      top: `${nodeBoundingBox!.h / 2 + 16}px`,
      backgroundColor: "#d8d8d8",
      cursor: "pointer",
      borderRadius: "50%",
      boxShadow: "0px 0px 16px 8px rgba(0, 0, 0, 0.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: "1",
    }
  })

  // add icon
  const closeIcon = createElement({
    tag: "img"
  })
  closeIcon.setAttribute("src", icon);
  closeItem.appendChild(closeIcon)
  closeItem.onclick = (e) => {
    e.stopImmediatePropagation();
    removeMenu(true);
  }

  return closeItem;
}

interface Bounds {
  /** Center of the circle */
  center: {
    x: number
    y: number
  }
  /** The radius of the circle around which to display the items */
  radius: number
}

/**
 * Calculates the bounds for the context menu with
 * respect to the selected node
 */
const getBounds = (): Bounds => {
  const r = nodeBoundingBox!.w / 2

  return {
    center: {
      x: nodeBoundingBox!.w / 2,
      y: nodeBoundingBox!.h / 2
    },
    radius: r < 80 ? 80 : r > 120 ? 120 : r
  }
}

/**
 * Calculates the final x & y coordinates for a menu item
 * @param {number} index
 * @param {number} numberOfItems
 * @param {Bounds} bounds
 */
const getPositionForItemWithIndex = (index: number, numberOfItems: number, bounds: Bounds) => {
  const angle = (numberOfItems % 2 === 0 ? -45 : -22.5) * (numberOfItems - 1 - (2 * index)) * Math.PI / 180

  const calculatedPosition = {
    left: bounds.center.x + bounds.radius * Math.cos(angle),
    top: bounds.center.y + bounds.radius * Math.sin(angle)
  }

  return {
    left: `${calculatedPosition.left}px`,
    top: `${calculatedPosition.top}px`
  }
}

/** Animates each menu item from their initial to final position */
const animateMenuItems = () => {
  menuIsCurrentlyVisible = true;
  const menuItems = document.querySelectorAll(".menu-item");
  const closeButton = document.getElementById("close-button") as HTMLDivElement

  const bounds = getBounds()

  menuItems.forEach((menuItem, index) => {
    menuItem.animate([
      {
        opacity: 0,
        left: `${nodeBoundingBox!.w / 2}px`,
        top: `${nodeBoundingBox!.h / 2}px`
      },
      {
        opacity: 1,
        ...getPositionForItemWithIndex(index, menuItems.length, bounds)
      },
    ], {
        duration: ANIMATION_DURATION,
        direction: "normal",
        easing: "ease-in-out"
      })
  })

  closeButton.animate([
    {
      opacity: "0",
      left: `${nodeBoundingBox!.w / 2 - 20}px`,
    },
    {
      opacity: "1",
      left: `${nodeBoundingBox!.w / 2 + 20}px`,
    }
  ], {
      duration: ANIMATION_DURATION,
      direction: "normal",
      easing: "ease-in-out"
    })
}

/** Returns each menu item to its original position */
const unanimateMenuItems = () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const closeButton = document.getElementById("close-button") as HTMLDivElement

  const bounds = getBounds()

  menuItems.forEach((menuItem, index) => {
    menuItem.animate([
      {
        opacity: 1,
        ...getPositionForItemWithIndex(index, menuItems.length, bounds)
      },
      {
        opacity: 0,
        left: `${nodeBoundingBox!.w / 2}px`,
        top: `${nodeBoundingBox!.h / 2}px`
      }
    ], {
        duration: ANIMATION_DURATION / 2,
        direction: "normal",
        easing: "ease-in-out"
      })
  })

  closeButton.animate([
    {
      opacity: "1",
      left: `${nodeBoundingBox!.w / 2 + 20}px`,
    },
    {
      opacity: "0",
      left: `${nodeBoundingBox!.w / 2 - 20}px`,
    }
  ], {
      duration: ANIMATION_DURATION / 2,
      direction: "normal",
      easing: "ease-in-out"
    })
}
