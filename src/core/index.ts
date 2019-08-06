import { Core } from "cytoscape";
import { createMenu, hideContextMenu, showContextMenu } from "./context-menu";

/**
 *
 * @param {Core} this
 * @param {MenuItem[]} items
 *
 * Note: DO NOT CONVERT THIS FUNCTION TO ES6 OR LATER. ONCE
 * CONVERTED TO ES6, IT LOOSES THE CONTEXT FOR `this` WHICH
 * IS REQUIRED TO MAKE AN EXTENSION WORK.
 */
export default function extension(this: Core, items: MenuItem[]): Core {
  const menu = createMenu(items);

  // Event listener to show the menu
  this.on("singleclick", "node", showContextMenu(menu));

  // Event listeners to hide the menu
  this.on("drag zoom pan", hideContextMenu);

  return this;
};

export interface MenuItem {
  icon?: any;
  title: string;
  color: string
  onClick(): void;
}
