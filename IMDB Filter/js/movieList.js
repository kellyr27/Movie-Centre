const {Trie} = require('./trie.js')                    // Functions to create and search tries for searching

class MovieList {
    constructor() {
        this.masterList = []

        this.activeList = []
        this.activeTrie

        this.inactiveList = []
        this.inactiveTrie = new Trie(this.inactiveList)

        this.searchSortFilter = {
            search: "",
            sort: [],
            filter: new Set()
        }
    }

    #updateTries () {
        this.activeTrie = new Trie(this.activeList)
        this.inactiveTrie = new Trie(this.inactiveList)
    }

    reset () {
        this.activeList = this.masterList
        this.inactiveList = []
        this.#updateTries()
        
        this.searchSortFilter = {
            search: "",
            sort: [],
            filter: new Set()
        }
    }

    create (masterList) {
        this.masterList = masterList
        this.activeList = this.masterList
        this.activeTrie = new Trie(this.activeList)
    }

    // Performs a search in place
    search (query) {

        this.searchSortFilter.search = query
        let foundMovies = this.activeTrie.search(query)

        for (let movie of this.activeList) {

            // If a movie in the active display is not in the found movies, move to inactive list
            if (!foundMovies.includes(movie)) {
                this.inactiveList.push(movie)
            }
        }
        this.activeList = foundMovies
        this.#updateTries()
    }


}

module.exports = {MovieList}