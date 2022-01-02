
let a = {director: "Kelly", year: 2014, name: "Lily", genre: ["red", "violet", "blue"], description: "Yellow House"}

// Returns a set of all substrings
const buildSubstrings = (str = '') => {
   let i, j
   const substrings = new Set()
   for (i = 0; i < str.length; i++) {
      for (j = i + 1; j < str.length + 1; j++) {
        substrings.add(str.slice(i, j))
      };
   }
   return substrings
}

function addSets(set1, set2) {
    let result = new Set([...set1, ...set2])
    return result
}

function movieStrings(movieObj) {
    let movieObjSubstrings = new Set()
    for (let property in movieObj) {

        if (typeof(movieObj[property]) === "number") {
            let temp = movieObj[property].toString()
            let tempSet = buildSubstrings(temp)
            console.log(tempSet);
            movieObjSubstrings = addSets(movieObjSubstrings, tempSet)

        }
        if (typeof(movieObj[property]) === "string") {
            let tempSet = buildSubstrings(movieObj[property])
            console.log(tempSet);
            movieObjSubstrings = addSets(movieObjSubstrings, tempSet)

        }
        if (typeof(movieObj[property]) === "object") {
            for (let str of movieObj[property]) {
                let tempSet = buildSubstrings(str);
                console.log(tempSet);
                movieObjSubstrings = addSets(movieObjSubstrings, tempSet)
            }
        }
    }

    return movieObjSubstrings
}


// console.log(movieStrings(a))

// Trie Data Structure
class trieNode {
    constructor (value) {
        this.value = value
        this.children = []
        this.movies = []
    }

    addMovie (id) {
        this.movies.push(id)
    }

    addChild (childNode) {
        this.children.push(childNode)
    }

}

class trie {
    constructor () {
        this.root = new trieNode('')
    }

    addWord (word, movie) {
        let currentNode = this.root
        let found = false
        for (char of word) {

            for (let i = 0; i < currentNode.children.length; i++) {
                if (char === currentNode.children[i].value) {
                    currentNode = currentNode.children[i]
                    found = true
                    break
                }
            }
            
            if (!found) {
                let newNode = new trieNode(char)
                currentNode.children.push(newNode)
                currentNode = newNode
            }

            currentNode.movies.push(movie)
        }
    }
}
