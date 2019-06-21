import slugify from 'slugify'

import one from './data/1.json'
import ccfv2_10um_regionVolumes from './data/allen_ccfv2_10um'
import ccfv2_25um_regionVolumes from './data/allen_ccfv2_25um'
import ccfv3_10um_regionVolumes from './data/allen_ccfv3_10um'
import ccfv3_25um_regionVolumes from './data/allen_ccfv3_25um'

// otherwise things sur as "layer 2/3" will become "layer_23"
// while we rather want "layer_2_3"
slugify.extend({'/': '_'})

let regionVolumes = {
  'ccfv2': {
    '10um': ccfv2_10um_regionVolumes,
    '25um': ccfv2_25um_regionVolumes
  },
  'ccfv3': {
    '10um': ccfv3_10um_regionVolumes,
    '25um': ccfv3_25um_regionVolumes
  }
}

let flatList = []
let listOfNames = []
let listOfAcronyms = []
let listOfIds = []
let listOfFullIndex = []
let indexPerId = {}
let indexPerName = {}
let indexPerAcronym = {}
let indexPerSlug = {}
let indexPerAll = {}
let rootNodeId = null


function buildIndex(){
  let nodesToExplore = [one]

  while(nodesToExplore.length) {
    let node = nodesToExplore.pop()
    let name = node.name.toLowerCase().trim()
    let acronym = node.acronym.toLowerCase().trim()
    let id = node.id

    if(node.parent_structure_id === null){
      rootNodeId = id
    }

    node.children_structure_id = []

    node.slug = slugify(name, {
      replacement: '_',    // replace spaces with replacement
      // remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })

    flatList.push(node)
    indexPerId[id] = node
    indexPerName[name] = node
    indexPerAcronym[acronym] = node
    indexPerSlug[node.slug] = node
    let fullIndex = `${name} ${acronym} ${id}`
    indexPerAll[fullIndex] = node
    listOfFullIndex.push(fullIndex)
    listOfNames.push(name)
    listOfAcronyms.push(acronym)
    listOfIds.push(id)

    node.isLeaf = node.children.length === 0

    // adding the children to the list
    for(let i=0; i<node.children.length; i++){
      let child = node.children[i]
      node.children_structure_id.push(child.id)
      nodesToExplore.push(child)
    }

    // we dont want to keep the nested structure
    // as it's not going to be like that in Nexus
    delete node.children
  }
}

buildIndex()


/**
 * **OneAllenBrainOntology** provides a set of convenience methods related to searching
 * and indexing mouse brain region from the `1.json` of the **Allen Institute for Brain Science** (AIBS).
 * It contains only static methods, thus no object needs to be
 * instantiated and methods can be called directly.
 *
 * In addition, this library contains the listing of all the brain region computed volumes
 * from the volumetric files `annotation_10.nrrd` and `annotation_25.nrrd` for both **ccfv2** (2014)
 * and **ccfv3** (2017). The method `getRegionVolume(...)` makes it easy to get the
 * volume of any given brain region (in cubic micrometer) and let you specify the version and
 * resolution of the atlas.
 *
 * Example:
 *
 * ```javascript
 * import oneallenbrainontology from 'oneallenbrainontology'
 * let allRegionNames = oneallenbrainontology.getAllRegionNames()
 * ```
 *
 * When querying a specific brain region, the returned value if found will be of the form:
 * ```javascript
 * {
 *   "id": 567,
 *   "atlas_id": 70,
 *   "ontology_id": 1,
 *   "acronym": "CH",
 *   "name": "Cerebrum",
 *   "color_hex_triplet": "B0F0FF",
 *   "graph_order": 2,
 *   "st_level": 2,
 *   "hemisphere_id": 3,
 *   "parent_structure_id": 8,
 *   "children_structure_id": [
 *     688,
 *     623
 *   ],
 *   "isLeaf": false,
 *   "slug": "cerebrum"
 * }
 * ```
 *
 * Where
 * - `id`: **number** the identifier of the brain region (given by AIBS)
 * - `acronym`: **string** is the short unique name for a region (given by AIBS)
 * - `name`: **string** full name of the brain region (given by AIBS)
 * - `color_hex_triplet`: **string** the color of the brain region in hexadecimal (given by AIBS)
 * - `parent_structure_id`: **number** the `id` of the parent brain structure (given by AIBS)
 * - `children_structure_id`: **[number]** list of region `id`s this region is the parent of (AIBS gives a list of nodes instead of a list of `id`, but here the whole tree has been flattened)
 * - `isLeaf`: **boolean** says if the brain region is a leaf of the tree (`true`, it does not have child region) or if it has child brain region (`false`). Not that this could easily be deduced from length of the `children_structure_id` list.
 * - `slug`: **string** a URL compatible name
 * - `atlas_id`: **number** some field given by AIBS (no more info about it)
 * - `ontology_id`: **number** some field given by AIBS (no more info about it)
 * - `graph_order`: **number** some field given by AIBS (no more info about it)
 * - `st_level`: **number** some field given by the AIBS (no more info about it)
 * - `hemisphere_id`: **number** some field given by the AIBS (no more info about it)
 * ---
 * # Methods
 */
class OneAllenBrainOntology {

  /**
   * Get the root node, which is the most top level node and has no parent.
   * @return {Object} the node
   *
   * @example
   * let rootNode = oneallenbrainontology.getRootNode()
   */
  static getRootNode(){
    return indexPerId[rootNodeId]
  }


  /**
   * Get the full list of region names (lowercase) as an array
   * @return {Array}
   *
   * @example
   * let allRegionNames = oneallenbrainontology.getAllRegionNames()
   */
  static getAllRegionNames(){
    return listOfNames
  }


  /**
   * Get the full list of region acronyms (lowercase) as an array
   * @return {Array}
   *
   * @example
   * let allRegionAcronyms = oneallenbrainontology.getAllRegionAcronyms()
   */
  static getAllRegionAcronyms(){
    return listOfAcronyms
  }


  /**
   * Get the full list of region ID (integers) as an array
   * @return {Array}
   *
   * @example
   * let allBrainRegionId = oneallenbrainontology.getAllRegionId()
   */
  static getAllRegionId(){
    return listOfIds
  }


  /**
   * Get a region by its strict full name (case insensitive)
   * @param {string} name - full name of the brain region
   * @return {Object} the brain region metadata
   *
   * @example
   * let visa23 = oneallenbrainontology.getRegionByFullName('anterior area, layer 2/3')
   */
  static getRegionByFullName(name) {
    let usableName = name.toLowerCase().trim()
    if(usableName in indexPerName){
      return indexPerName[usableName]
    }
    return null
  }


  /**
   * Get a region by its strict acronym (case insensitive)
   * @param {string} ac - acronym of the brain region
   * @return {Object} the brain region metadata
   *
   * @example
   * let visa23 = oneallenbrainontology.getRegionByAcronym('visa2/3')
   */
  static getRegionByAcronym(ac) {
    let usableAc = ac.toLowerCase().trim()
    if(usableAc in indexPerAcronym){
      return indexPerAcronym[usableAc]
    }
    return null
  }


  /**
   * Get a region by its strict slug (case insensitive)
   * @param {string} slug - slug of the brain region
   * @return {Object} the brain region metadata
   *
   * @example
   * let orbL23 = oneallenbrainontology.getRegionBySlug('orbital_area_layer_2_3')
   */
  static getRegionBySlug(slug) {
    let usableSlug = slug.toLowerCase().trim()
    if(usableSlug in indexPerSlug){
      return indexPerSlug[usableSlug]
    }
    return null
  }


  /**
   * Get a region by its id
   * @param {number} id - id of the brain region
   * @return {Object} the brain region metadata
   *
   * @example
   * let visa23 = oneallenbrainontology.getRegionById(312782554)
   */
  static getRegionById(id) {
    if(id in indexPerId){
      return indexPerId[id]
    }
    return null
  }


  /**
   * Get the list of child regions given the ID of the parent region.
   * @param {string|number} parentId - the id of the parent node
   * @return {Array} array of regions, alphabetically sorted by name.
   * If the parentId does not exist or if it has no children, then an empty array is returned.
   *
   * @example
   * let children = oneallenbrainontology.getChildRegionsFromId(997)
   *
   */
  static getChildRegionsFromId(parentId){
    if(!(parentId in indexPerId)){
      return []
    }

    let parentRegion = indexPerId[parentId]
    return parentRegion.children_structure_id
            .map(id => indexPerId[id])
            .sort((a, b) => a.name < b.name ? -1 : 1)
  }


  /**
   * Get the parent region given the id of a child.
   * @param {string|number} childId - the id of the child region to get the parent of
   * @return {Object|null} the parent region or null if no parent (aka. root node)
   *
   * @example
   * let parent = oneallenbrainontology.getParentRegionFromId(304325711)
   */
  static getParentRegionFromId(childId){
    if(!(childId in indexPerId) || childId === rootNodeId){
      return null
    }

    let childRegion = indexPerId[childId]
    return indexPerId[childRegion.parent_structure_id]
  }


  /**
   * Get the list of IDs of all the brain regions that are at a higher level than
   * the one given.
   * @param {number|string} id - id of the brain region to find the ancestors of
   * @param {object} options - the options object
   * @param {boolean} options.omitChild - if true, the id provided as argument will not be part of the list (dafault: false, the one provided is part of the list)
   * @param {boolean} options.rootFirst - if true, the order will be starting with the root node, if false, the list will be ending by the root (default: false)
   * @return {array} of region IDs in ascending order (default) or descending order
   *
   * @example
   * let ancestors = oneallenbrainontology.getAscendantsFromId(159, {
   *   rootFirst: true,
   *   omitChild: false
   *  })
   */
  static getAscendantsFromId(id, options = {}){
    if(!(id in indexPerId)){
      return null
    }

    let omitChild = "omitChild" in options ? options.omitChild : false
    let rootFirst = "rootFirst" in options ? options.rootFirst : false

    let region = indexPerId[id]
    let ancestors = []

    if(!omitChild){
      ancestors.push(id)
    }

    while(region.parent_structure_id){
      let parentId = region.parent_structure_id
      ancestors.push(parentId)
      region = indexPerId[parentId]
    }

    if(rootFirst){
      ancestors.reverse()
    }
    return ancestors.map(ancestorId => indexPerId[ancestorId])
  }


  /**
   * Get all the descendants from a given brain region. The descendants are the
   * children and all the children of the children recursively until the leaf nodes
   * are reached.
   * @param {number|string} id - id of the region to list the descendants of
   * @param {opbject} options - the option object
   * @param {boolean} options.keepCurrent - if true, the region given as argument will also be added, if false, only the descendants will be added (default: false)
   * @param {boolean} options.leafOnly - if true, only the leaf region will be added (a leaf is a region that has no child) (default: false)
   * @return {array} the descendants
   *
   * @example
   * let allChildren = oneallenbrainontology.getDescendantsFromId(997, { // 997 is the top region, the one that contains all the others
   *   keepCurrent: true, // this one will actually not apply as 997 is not a leaf
   *   leafOnly: true     // and here we want only the leaf
   * })
   */
  static getDescendantsFromId(id, options={}){
    if(!(id in indexPerId)){
      return null
    }

    let keepCurrent = 'keepCurrent' in options ? options.keepCurrent : false
    let leafOnly = 'leafOnly' in options ? options.leafOnly : false
    let parentNode =  indexPerId[id]
    let allChildren = []

    if(keepCurrent){
      if((leafOnly && parentNode.isLeaf) || !leafOnly){
        allChildren.push(parentNode)
      }
    }

    function exploreChild(node){
      node.children_structure_id.forEach(childId => {
        let childNode = indexPerId[childId]
        if((leafOnly && childNode.isLeaf) || !leafOnly){
          allChildren.push(childNode)
        }
        exploreChild(childNode)
      })
    }

    exploreChild(parentNode)
    return allChildren
  }


  /**
   * Gives the volume in um^3 (cubic micro-meter) of the given brain region,
   * using some builtin atlas data.
   * Pro-tip: divide by 1E9 to get the volume in mm^3 and again by 1E3 for cm^3.
   * @param {number|string} id - the id of the brain region to get the volume of
   * @param {object} options - the option object
   * @param {string} options.atlas - 'ccfv2' or 'ccfv3' (default: 'ccfv3')
   * @param {string} options.resolution - the resolution of the voletric data the volume were computed from. '10um' or '25um' (default: '10um')
   * @return {number} the volume of the brain region in cubic micro-meter
   *
   * @example
   * let volume = oneallenbrainontology.getRegionVolume(997, {
   *   atlas: 'ccfv3',
   *   resolution: '10um'
   * })
   * console.log(`The whole mouse brain has a volume of ${volume/1E12} cm^3`)
   */
  static getRegionVolume(id, options={}){
    if(!(id in indexPerId)){
      return null
    }

    let atlasVersion = 'atlas' in options ? options.atlas : 'ccfv3'
    let resolution = 'resolution' in options ? options.resolution : '10um'

    let regionVolumesOfChoice = null
    try{
      regionVolumesOfChoice = regionVolumes[atlasVersion][resolution]
    } catch(e){
      throw new Error(`The atlas ${atlasVersion} at resolution ${resolution} does not exist.`)
      return null
    }

    let descendants = OneAllenBrainOntology.getDescendantsFromId(id, {
      keepCurrent: true
    })

    let totalVolume = 0
    for(let i= 0; i<descendants.length; i++){
      totalVolume += regionVolumesOfChoice[descendants[i].id ] || 0
    }

    return totalVolume
  }



  /**
   * Search a region using multiple words.
   * There is possibly multiple matches when all the words of the query are found
   * in the [full name + acronym + id] of a brain region
   * @param {string} query - possibly multiple words
   * @return {array} brain regions or empty if not found
   *
   * @example
   * let cerebellumRelated = oneallenbrainontology.findRegion('cerebel')
   * let layer23Related = oneallenbrainontology.findRegion('layer 2/3')
   */
  static findRegion(query){
    let queryWords = query.split(' ').map(s => s.toLocaleLowerCase())

    let listOfRegions = listOfFullIndex
      .filter(function(elem) {
        return queryWords.every(word => !!~elem.indexOf(word))
      })
      .sort() // we prefer alphabetical order
      .map(function(acr) {
        return indexPerAll[acr]
      })

    return listOfRegions
  }



}

export default OneAllenBrainOntology
