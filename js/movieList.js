const {Trie} = require('./trie.js')                    // Functions to create and search tries for searching

class MovieList {
    constructor(databaseMovies) {
        this.masterList = databaseMovies
    }

    // Performs a search in place
    search (query) {

        // Remove BSON properties to create the trie
        let alteredList = []
        for (let i = 0; i < this.masterList.length; i++) {
            let alteredMovie = JSON.parse(JSON.stringify(this.masterList[i]))
            delete alteredMovie._id            
            delete alteredMovie.__v            
            alteredList.push(alteredMovie)
        }
        const masterTrie = new Trie(alteredList)

        return masterTrie.search(query)
    }

}

module.exports = {MovieList}