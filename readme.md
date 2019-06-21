<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## OneAllenBrainOntology

**OneAllenBrainOntology** provides a set of convenience methods related to searching
and indexing mouse brain region from the `1.json` of the **Allen Institute for Brain Science** (AIBS).
It contains only static methods, thus no object needs to be
instantiated and methods can be called directly.

In addition, this library contains the listing of all the brain region computed volumes
from the volumetric files `annotation_10.nrrd` and `annotation_25.nrrd` for both **ccfv2** (2014)
and **ccfv3** (2017). The method `getRegionVolume(...)` makes it easy to get the
volume of any given brain region (in cubic micrometer) and let you specify the version and
resolution of the atlas.

Example:

```javascript
import oneallenbrainontology from 'oneallenbrainontology'
let allRegionNames = oneallenbrainontology.getAllRegionNames()
```

When querying a specific brain region, the returned value if found will be of the form:

```javascript
{
  "id": 567,
  "atlas_id": 70,
  "ontology_id": 1,
  "acronym": "CH",
  "name": "Cerebrum",
  "color_hex_triplet": "B0F0FF",
  "graph_order": 2,
  "st_level": 2,
  "hemisphere_id": 3,
  "parent_structure_id": 8,
  "children_structure_id": [
    688,
    623
  ],
  "isLeaf": false,
  "slug": "cerebrum"
}
```

Where

-   `id`: **number** the identifier of the brain region (given by AIBS)
-   `acronym`: **string** is the short unique name for a region (given by AIBS)
-   `name`: **string** full name of the brain region (given by AIBS)
-   `color_hex_triplet`: **string** the color of the brain region in hexadecimal (given by AIBS)
-   `parent_structure_id`: **number** the `id` of the parent brain structure (given by AIBS)
-   `children_structure_id`: **[number]** list of region `id`s this region is the parent of (AIBS gives a list of nodes instead of a list of `id`, but here the whole tree has been flattened)
-   `isLeaf`: **boolean** says if the brain region is a leaf of the tree (`true`, it does not have child region) or if it has child brain region (`false`). Not that this could easily be deduced from length of the `children_structure_id` list.
-   `slug`: **string** a URL compatible name
-   `atlas_id`: **number** some field given by AIBS (no more info about it)
-   `ontology_id`: **number** some field given by AIBS (no more info about it)
-   `graph_order`: **number** some field given by AIBS (no more info about it)
-   `st_level`: **number** some field given by the AIBS (no more info about it)
-   `hemisphere_id`: **number** some field given by the AIBS (no more info about it)

* * *

# Methods

### getRootNode

Get the root node, which is the most top level node and has no parent.

#### Examples

```javascript
let rootNode = oneallenbrainontology.getRootNode()
```

Returns **[Object][1]** the node

### getAllRegionNames

Get the full list of region names (lowercase) as an array

#### Examples

```javascript
let allRegionNames = oneallenbrainontology.getAllRegionNames()
```

Returns **[Array][2]** 

### getAllRegionAcronyms

Get the full list of region acronyms (lowercase) as an array

#### Examples

```javascript
let allRegionAcronyms = oneallenbrainontology.getAllRegionAcronyms()
```

Returns **[Array][2]** 

### getAllRegionId

Get the full list of region ID (integers) as an array

#### Examples

```javascript
let allBrainRegionId = oneallenbrainontology.getAllRegionId()
```

Returns **[Array][2]** 

### getRegionByFullName

Get a region by its strict full name (case insensitive)

#### Parameters

-   `name` **[string][3]** full name of the brain region

#### Examples

```javascript
let visa23 = oneallenbrainontology.getRegionByFullName('anterior area, layer 2/3')
```

Returns **[Object][1]** the brain region metadata

### getRegionByAcronym

Get a region by its strict acronym (case insensitive)

#### Parameters

-   `ac` **[string][3]** acronym of the brain region

#### Examples

```javascript
let visa23 = oneallenbrainontology.getRegionByAcronym('visa2/3')
```

Returns **[Object][1]** the brain region metadata

### getRegionBySlug

Get a region by its strict slug (case insensitive)

#### Parameters

-   `slug` **[string][3]** slug of the brain region

#### Examples

```javascript
let orbL23 = oneallenbrainontology.getRegionBySlug('orbital_area_layer_2_3')
```

Returns **[Object][1]** the brain region metadata

### getRegionById

Get a region by its id

#### Parameters

-   `id` **[number][4]** id of the brain region

#### Examples

```javascript
let visa23 = oneallenbrainontology.getRegionById(312782554)
```

Returns **[Object][1]** the brain region metadata

### getChildRegionsFromId

Get the list of child regions given the ID of the parent region.

#### Parameters

-   `parentId` **([string][3] \| [number][4])** the id of the parent node

#### Examples

```javascript
let children = oneallenbrainontology.getChildRegionsFromId(997)
```

Returns **[Array][2]** array of regions, alphabetically sorted by name.
If the parentId does not exist or if it has no children, then an empty array is returned.

### getParentRegionFromId

Get the parent region given the id of a child.

#### Parameters

-   `childId` **([string][3] \| [number][4])** the id of the child region to get the parent of

#### Examples

```javascript
let parent = oneallenbrainontology.getParentRegionFromId(304325711)
```

Returns **([Object][1] | null)** the parent region or null if no parent (aka. root node)

### getAscendantsFromId

Get the list of IDs of all the brain regions that are at a higher level than
the one given.

#### Parameters

-   `id` **([number][4] \| [string][3])** id of the brain region to find the ancestors of
-   `options` **[object][1]** the options object (optional, default `{}`)
    -   `options.omitChild` **[boolean][5]** if true, the id provided as argument will not be part of the list (dafault: false, the one provided is part of the list)
    -   `options.rootFirst` **[boolean][5]** if true, the order will be starting with the root node, if false, the list will be ending by the root (default: false)

#### Examples

```javascript
let ancestors = oneallenbrainontology.getAscendantsFromId(159, {
  rootFirst: true,
  omitChild: false
 })
```

Returns **[array][2]** of region IDs in ascending order (default) or descending order

### getDescendantsFromId

Get all the descendants from a given brain region. The descendants are the
children and all the children of the children recursively until the leaf nodes
are reached.

#### Parameters

-   `id` **([number][4] \| [string][3])** id of the region to list the descendants of
-   `options` **opbject** the option object (optional, default `{}`)
    -   `options.keepCurrent` **[boolean][5]** if true, the region given as argument will also be added, if false, only the descendants will be added (default: false)
    -   `options.leafOnly` **[boolean][5]** if true, only the leaf region will be added (a leaf is a region that has no child) (default: false)

#### Examples

```javascript
let allChildren = oneallenbrainontology.getDescendantsFromId(997, { // 997 is the top region, the one that contains all the others
  keepCurrent: true, // this one will actually not apply as 997 is not a leaf
  leafOnly: true     // and here we want only the leaf
})
```

Returns **[array][2]** the descendants

### getRegionVolume

Gives the volume in um^3 (cubic micro-meter) of the given brain region,
using some builtin atlas data.
Pro-tip: divide by 1E9 to get the volume in mm^3 and again by 1E3 for cm^3.

#### Parameters

-   `id` **([number][4] \| [string][3])** the id of the brain region to get the volume of
-   `options` **[object][1]** the option object (optional, default `{}`)
    -   `options.atlas` **[string][3]** 'ccfv2' or 'ccfv3' (default: 'ccfv3')
    -   `options.resolution` **[string][3]** the resolution of the voletric data the volume were computed from. '10um' or '25um' (default: '10um')

#### Examples

```javascript
let volume = oneallenbrainontology.getRegionVolume(997, {
  atlas: 'ccfv3',
  resolution: '10um'
})
console.log(`The whole mouse brain has a volume of ${volume/1E12} cm^3`)
```

Returns **[number][4]** the volume of the brain region in cubic micro-meter

### findRegion

Search a region using multiple words.
There is possibly multiple matches when all the words of the query are found
in the [full name + acronym + id] of a brain region

#### Parameters

-   `query` **[string][3]** possibly multiple words

#### Examples

```javascript
let cerebellumRelated = oneallenbrainontology.findRegion('cerebel')
let layer23Related = oneallenbrainontology.findRegion('layer 2/3')
```

Returns **[array][2]** brain regions or empty if not found

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
