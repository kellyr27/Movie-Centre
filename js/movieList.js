const {Trie} = require('./trie.js')                    // Functions to create and search tries for searching

class MovieList {
    constructor() {
        this.masterList = []
        this.masterTrie
    }

    create (masterList) {
        this.masterList = masterList

        // Remove BSON properties to create the trie
        let alteredList = []
        for (let i = 0; i < masterList.length; i++) {
            let alteredMovie = JSON.parse(JSON.stringify(masterList[i]))
            delete alteredMovie._id            
            delete alteredMovie.__v            
            alteredList.push(alteredMovie)
        }

        this.masterTrie = new Trie(alteredList)
    }

    // Performs a search in place
    // search (query) {

    //     let foundMovies = this.masterTrie.search(query)
        
    //     for (let movie of this.activeList) {

    //         // If a movie in the active display is not in the found movies, move to inactive list
    //         if (!foundMovies.includes(movie)) {
    //             this.inactiveList.push(movie)
    //         }
    //     }  
    // }


}

module.exports = {MovieList}