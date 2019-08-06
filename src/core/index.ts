import { Core } from "cytoscape";
import { createMenu, hideContextMenu, showContextMenu } from "./context-menu";

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
  onClick(): void;
}
