import one from './1.json'

let flatList = []
let listOfNames = []
let listOfAcronyms = []
let listOfIds = []
let listOfFullIndex = []
let indexPerId = {}
let indexPerName = {}
let indexPerAcronym = {}
let indexPerAll = {}


function buildIndex(){
  let nodesToExplore = [one]

  while(nodesToExplore.length) {
    let node = nodesToExplore.pop()

    let name = node.name.toLowerCase().trim()
    let acronym = node.acronym.toLowerCase().trim()
    let id = node.id

    node.children_structure_id = []

    flatList.push(node)
    indexPerId[id] = node
    indexPerName[name] = node
    indexPerAcronym[acronym] = node
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
 * OneAllenBrainOntology provides a set of convenience methods related to searching
 * and indexing brain region from the 1.json of the Allen Brain Institute.
 * It contains only static methods, thus no object needs to be
 * instanciated and methods can be called directly.
 *
 * Example:
 *
 * ```javascript
 * import oneallenbrainontology from 'oneallenbrainontology'
 *
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
 *   "isLeaf": false
 * }
 * ```
 */
class OneAllenBrainOntology {

  /**
   * Get the full list of region names (lowercase) as an array
   *
   * ```javascript
   * let allRegionNames = oneallenbrainontology.getAllRegionNames()
   * ```
   *
   * @return {Array}
   */
  static getAllRegionNames(){
    return listOfNames
  }


  /**
   * Get the full list of region acronyms (lowercase) as an array
   *
   * ```javascript
   * let allRegionAcronyms = oneallenbrainontology.getAllRegionAcronyms()
   * ```
   *
   * @return {Array}
   */
  static getAllRegionAcronyms(){
    return listOfAcronyms
  }


  /**
   * Get the full list of region ID (integers) as an array
   *
   * ```javascript
   * let allBrainRegionId = oneallenbrainontology.getAllRegionId()
   * ```
   *
   * @return {Array}
   */
  static getAllRegionId(){
    return listOfIds
  }


  /**
   * Get a region by its strict full name (case insensitive)
   *
   * ```javascript
   * let visa23 = oneallenbrainontology.getRegionByFullName('anterior area, layer 2/3')
   * ```
   *
   * @param {string} name - full name of the brain region
   * @return {Object} the brain region metadata
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
   *
   * ```javascript
   * let visa23 = oneallenbrainontology.getRegionByAcronym('visa2/3')
   * ```
   *
   * @param {string} ac - acronym of the brain region
   * @return {Object} the brain region metadata
   */
  static getRegionByAcronym(ac) {
    let usableAc = ac.toLowerCase().trim()
    if(usableAc in indexPerAcronym){
      return indexPerAcronym[usableAc]
    }
    return null
  }

  /**
   * Get a region by its id
   *
   * ```javascript
   * let visa23 = oneallenbrainontology.getRegionById(312782554)
   * ```
   *
   * @param {number} id - id of the brain region
   * @return {Object} the brain region metadata
   */
  static getRegionById(id) {
    if(id in indexPerId){
      return indexPerId[id]
    }
    return null
  }


  /**
   * Search a region using multiple words.
   * There is possibly multiple matches when all the words of the query are found
   * in the [full name + acronym + id] of a brain region
   *
   * ```javascript
   * let cerebellumRelated = oneallenbrainontology.findRegion('cerebel')
   *
   * let layer23Related = oneallenbrainontology.findRegion('layer 2/3')
   * ```
   *
   * @param {string} query - possibly multiple words
   * @return {array} brain regions or empty if not found
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
