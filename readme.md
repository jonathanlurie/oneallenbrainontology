<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [OneAllenBrainOntology][1]
    -   [getAllRegionNames][2]
    -   [getAllRegionAcronyms][3]
    -   [getAllRegionId][4]
    -   [getRegionByFullName][5]
        -   [Parameters][6]
    -   [getRegionByAcronym][7]
        -   [Parameters][8]
    -   [getRegionById][9]
        -   [Parameters][10]
    -   [findRegion][11]
        -   [Parameters][12]

## OneAllenBrainOntology

OneAllenBrainOntology provides a set of convenience methods related to searching
and indexing brain region from the 1.json of the Allen Brain Institute.
It contains only static methods, thus no object needs to be
instanciated and methods can be called directly.

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
  "isLeaf": false
}
```

### getAllRegionNames

Get the full list of region names (lowercase) as an array

```javascript
let allRegionNames = oneallenbrainontology.getAllRegionNames()
```

Returns **[Array][13]** 

### getAllRegionAcronyms

Get the full list of region acronyms (lowercase) as an array

```javascript
let allRegionAcronyms = oneallenbrainontology.getAllRegionAcronyms()
```

Returns **[Array][13]** 

### getAllRegionId

Get the full list of region ID (integers) as an array

```javascript
let allBrainRegionId = oneallenbrainontology.getAllRegionId()
```

Returns **[Array][13]** 

### getRegionByFullName

Get a region by its strict full name (case insensitive)

```javascript
let visa23 = oneallenbrainontology.getRegionByFullName('anterior area, layer 2/3')
```

#### Parameters

-   `name` **[string][14]** full name of the brain region

Returns **[Object][15]** the brain region metadata

### getRegionByAcronym

Get a region by its strict acronym (case insensitive)

```javascript
let visa23 = oneallenbrainontology.getRegionByAcronym('visa2/3')
```

#### Parameters

-   `ac` **[string][14]** acronym of the brain region

Returns **[Object][15]** the brain region metadata

### getRegionById

Get a region by its id

```javascript
let visa23 = oneallenbrainontology.getRegionById(312782554)
```

#### Parameters

-   `id` **[number][16]** id of the brain region

Returns **[Object][15]** the brain region metadata

### findRegion

Search a region using multiple words.
There is possibly multiple matches when all the words of the query are found
in the [full name + acronym + id] of a brain region

```javascript
let cerebellumRelated = oneallenbrainontology.findRegion('cerebel')

let layer23Related = oneallenbrainontology.findRegion('layer 2/3')
```

#### Parameters

-   `query` **[string][14]** possibly multiple words

Returns **[array][13]** brain regions or empty if not found

[1]: #oneallenbrainontology

[2]: #getallregionnames

[3]: #getallregionacronyms

[4]: #getallregionid

[5]: #getregionbyfullname

[6]: #parameters

[7]: #getregionbyacronym

[8]: #parameters-1

[9]: #getregionbyid

[10]: #parameters-2

[11]: #findregion

[12]: #parameters-3

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[14]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[15]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
