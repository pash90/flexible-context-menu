import { Options } from "./core";
export default function register(cy?: any): void;
declare global {
    interface Window {
        cytoscape?: any;
    }
}
import "cytoscape";
declare module "cytoscape" {
    interface Core {
        flexibleContextMenu(options: Options): void;
    }
}
export { Options };
