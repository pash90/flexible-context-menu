import { Core, NodeSingular } from "cytoscape";
import { clearContextMenu, hideContextMenu, showContextMenu } from "./context-menu";

export interface MenuItem {
  icon?: any;
  title: string;
  color: string
  onClick(): void;
}

export interface Options {
  items: MenuItem[]
  closeIcon: any
  /**
   * The condition under which to display
   * the contextual menu and the menu items
   */
  conditions: {
    // TODO: enable menu for edges
    // type: "node" | "edge"
    /** The condition check for contextual menu */
    overall(currentTarget: NodeSingular): boolean
    /**
     * The condition check for individual menu items.
     * It is checked once for every menu item
     */
    menuItem(itemTitle: string, currentTarget: NodeSingular): boolean
  }
}

/**
 *
 * @param {Core} this
 * @param {MenuItem[]} items
 *
 * Note: DO NOT CONVERT THIS FUNCTION TO ES6 OR LATER. ONCE
 * CONVERTED TO ES6, IT LOOSES THE CONTEXT FOR `this` WHICH
 * IS REQUIRED TO MAKE AN EXTENSION WORK.
 */
export default function extension(this: Core, options: Options): Core {
  // Event listener to show the menu
  this.on("singleclick", "node", showContextMenu(options));
  // this.on("click", "node", showContextMenu(options));
  this.on("unselect", "node", clearContextMenu)
  // Event listeners to hide the menu
  this.on("drag zoom pan", hideContextMenu);
  this.on("click", (e) => {
    if (e.target === e.cy) {
      hideContextMenu(e);
    }
  })

  return this;
};
