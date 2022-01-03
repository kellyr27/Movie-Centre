const e = require("express")

// Test data
let m1 = {director: "Kelly", year: 2014, name: "Lily", genre: ["red", "violet", "blue"], description: "Yellow House"} 
let m2 = {director: "Day after Tomorrow", year: 1998, name: "Killer Ranch", genre: ["sci-fi", "horor", "red"], description: "Best movie on eather"} 
let a = [m1, m2]

// Returns a set of all substrings
const buildSubstrings = (str = '') => {
   let i, j
   const substrings = new Set()
   for (i = 0; i < str.length; i++) {
      for (j = i + 1; j < str.length + 1; j++) {
        substrings.add(str.slice(i, j))
      }
   }
   return substrings
}

// Combines two sets
function addSets(set1, set2) {
    let result = new Set([...set1, ...set2])
    return result
}

// Returns all possible substrings from a movie Object
function movieStrings(movieObj) {
    let movieObjSubstrings = new Set()

    for (let property in movieObj) {
        
        if (typeof(movieObj[property]) === "number") {
            let temp = movieObj[property].toString()
            let tempSet = buildSubstrings(temp)
            movieObjSubstrings = addSets(movieObjSubstrings, tempSet)

        }
        if (typeof(movieObj[property]) === "string") {
            
            if (movieObj[property].startsWith('https:')) {
                continue
            }

            for (let str of movieObj[property].toLowerCase().split(' ')) {
                let tempSet = buildSubstrings(str.trim())
                movieObjSubstrings = addSets(movieObjSubstrings, tempSet)
            }

        }
        if (typeof(movieObj[property]) === "object") {
            for (let str of movieObj[property]) {
                for (let subStr of str.toLowerCase().split(' ')) {
                    let tempSet = buildSubstrings(subStr.trim())
                    movieObjSubstrings = addSets(movieObjSubstrings, tempSet)
                }
            }
        }
    }

    return movieObjSubstrings
}

// -------------------------------TRIE------------------------------------------------------------------------------------------------------------------

// Trie Node
class trieNode {
    constructor (value) {
        this.value = value
        this.children = []
        this.movies = []
    }

    addMovie (newMov) {
        for (let mov of this.movies) {
            if (newMov['Title'] === mov['Title']) {
                return
            }
        }
        this.movies.push(newMov)
        return
    }

    addChild (childNode) {
        this.children.push(childNode)
    }
}

// Trie Data Structure
class trie {
    constructor () {
        this.root = new trieNode('')
    }

    // Add a word to the trie and assign a movie ID at each node
    addWord (word, movie) {

        let currentNode = this.root
        let found = false

        // Go through each character of the word and search through the trie
        for (let char of word) {
            found = false                                                               // Indicates the current letter is already in the trie

            for (let i = 0; i < currentNode.children.length; i++) {
                if (char === currentNode.children[i].value) {
                    currentNode = currentNode.children[i]
                    found = true
                    break
                }
            }
            
            // If current letter not in the tree, add node to trie
            if (!found) {
                let newNode = new trieNode(char)
                currentNode.children.push(newNode)
                currentNode = newNode
            }

            currentNode.addMovie(movie)
        }
    }
}

// Create a Trie from a movie list, returns a Trie
const createTrie = function (listMovies) {
    let search_trie = new trie()

    // Iterate through all movies, get all substrings and add to the trie
    for (obj of listMovies) {
        let subArr = movieStrings(obj)
        for (let word of subArr) {
            search_trie.addWord(word, obj)
        }
    }

    return search_trie
}

// Searchs from a given node for all movies. Returns found movies in a list
const searchTrie = function (master_trie, searchTerm) {

    current_node = master_trie.root
    // If the node has no children, then there are no movies
    if (!current_node.children) {
        return []
    }

    searchWords = searchTerm.split(' ')

    for (let word of searchWords) {
        
        // Executes on every word except the first
        if (searchWords[0] !== word) {
            current_node = createTrie(current_node.movies).root
        }

        for (let char of word) {
            let found = false
            for (let i = 0; i < current_node.children.length; i++) {

                if (current_node.children[i].value === char) {
                    current_node = current_node.children[i]
                    found = true
                    break
                }
            
            }
            
            // This letter is not a child and therefore we have no search results
            if (!found) {
                return []
            }

        }

    }

    return current_node.movies

}

module.exports = {searchTrie, createTrie}
