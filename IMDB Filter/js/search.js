// Trie Node
class TrieNode {
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
class Trie {
    constructor (inputListMovies) {
        this.root = new TrieNode('')
        this.create(inputListMovies)
    }

    // Determine all the strings for the trie from a Movie Object
    #createMovieWords(movieObj) {

        function buildSubstrings(str) {
            const substrings = new Set()

            for (let i = 0; i < str.length; i++) {
                substrings.add(str.slice(i))
            }

            return substrings
        }

        // Combines two sets
        function addSets(set1, set2) {
            let result = new Set([...set1, ...set2])
            return result
        }

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
                let newNode = new TrieNode(char)
                currentNode.children.push(newNode)
                currentNode = newNode
            }

            currentNode.addMovie(movie)
        }
    }

    
    // Fill the Trie with all words from a list of Movies
    create (listMovies) {

        // Iterate through all movies, get all substrings and add to the trie
        for (let list of listMovies) {

            let movieWords = this.#createMovieWords(list)

            for (let word of movieWords) {
                this.addWord(word, list)
            }
        }
    }
    

    static search (trie, searchTerm) {

        let currentNode = trie.root

        // If the node has no children, then there are no movies
        if (!currentNode.children) {
            return []
        }
    
        const searchWords = searchTerm.split(' ')
    
        for (let word of searchWords) {
            
            // Executes on every word except the first
            if (searchWords[0] !== word) {
                let tempTrie = new Trie()
                tempTrie.create(currentNode.movies)
                currentNode = tempTrie.root
            }
    
            for (let char of word) {
                let found = false
                for (let i = 0; i < currentNode.children.length; i++) {
    
                    if (currentNode.children[i].value === char) {
                        currentNode = currentNode.children[i]
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

        return currentNode.movies
    }

}


module.exports = {Trie}
