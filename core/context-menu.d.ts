import { EventHandler } from "cytoscape";
import { Options } from ".";
/**
 * Displays a context menu for the selected node in the graph
 * @param {MenuItem[]} items The items to display in the contextual menu
 */
export declare const showContextMenu: (options: Options) => EventHandler;
/**
 * Hides the context menu and deselects the selected element
 * @param {EventObject} event The Cytoscape event that triggered the function
 */
export declare const hideContextMenu: EventHandler;
/**
 * Creates a contextual menu for the selected node
 * @param {Options} options
 * @param {BoundingBoxWH} boundingBox The bounding box for the selected node in the graph
 */
export declare const createMenu: (options: Options) => HTMLElement;
