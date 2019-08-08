# `flexible-context-menu`


## Description

A flexible context menu for Cytoscape. [Demo incoming]

## Dependencies

 * Cytoscape.js ^3.2.0


## Usage instructions

Download the library:
 * via npm: `npm install flexible-context-menu`,
 * via bower: `bower install flexible-context-menu`, or
 * via direct download in the repository (Look at the releases tab).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import FlexibleContextMenu from 'flexible-context-menu';

cytoscape.use( FlexibleContextMenu );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let FlexibleContextMenu = require('flexible-context-menu');

cytoscape.use( FlexibleContextMenu ); // register extension
```

AMD:

```js
require(['cytoscape', 'flexible-context-menu'], function( cytoscape, flexibleContextMenu ){
  flexibleContextMenu( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

The extension supports adding menu items for a selected node in the graph. They are, for now, displayed in a circle around the selected node. It exposes only one function - `flexibleContextMenu` - which is attached to Cytoscape.

The initialisation for the menu requires the following:
```ts
interface MenuItem {
  icon?: any;
  /** The title for the menu item */
  title: string;
  /** The background color for the menu item */
  color: string
  /** onclick handler for the menu item */
  onClick(): void;
}

interface Options {
  items: MenuItem[]
  closeIcon: any
  /**
   * The condition under which to display
   * the contextual menu and the menu items
   */
  conditions: {
    /** The condition check for contextual menu */
    overall(currentTarget: NodeSingular): boolean
    /**
     * The condition check for individual menu items.
     * It is checked once for every menu item
     */
    menuItem(itemTitle: string, currentTarget: NodeSingular): boolean
  }
}
```

```js
import Cytoscape from 'cytoscape';
import FlexibleContextMenu from 'flexible-context-menu';

Cytoscape.use( FlexibleContextMenu );

const cytoscape = Cytoscape({ ... });

const options: Options = { ... };
cytoscape.flexibleContextMenu(options);
```

This only needs to be run once. After that, the contextual menu will appear and disappear based on the conditions you have specified in the `options`.