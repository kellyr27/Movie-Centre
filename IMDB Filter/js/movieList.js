const {Trie} = require('./trie.js')                    // Functions to create and search tries for searching

class MovieList {
    constructor() {
        this.masterList

        this.activeList = []
        this.activeTrie

        this.inactiveList = []
        this.inactiveTrie = new Trie(this.inactiveList)

        this.searchSortFilter = {
            search: [],
            sort: [],
            filter: []
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
            search: [],
            sort: [],
            filter: []
        }
    }

    create (masterList) {
        this.masterList = masterList
        this.activeList = this.masterList
        this.activeTrie = new Trie(this.activeList)
    }

    queryChange (alteredSearchSortFilter) {
        // Search
        let addedSearch = []
        let removedSearch = []

        // Search queries has been added
        for (let i = 0; i < alteredSearchSortFilter.search.length; i++) {
            if (!this.searchSortFilter.search.includes(alteredSearchSortFilter.search[i])) {
                addedSearch.push(alteredSearchSortFilter.search[i])
                this.search(addedSearch)
            }
        }

        // Search queries has been removed
        for (let i = 0; i < this.searchSortFilter.search.length; i++) {
            if (!alteredSearchSortFilter.search.includes(this.searchSortFilter.search[i])) {
                removedSearch.push(this.searchSortFilter.search[i])
                this.unsearch(removedSearch)
            }
        }

        // Sort


        // Filter


    }

    // Performs a search in place
    search (addedQueries) {
        for (let query of addedQueries) {
            let foundMovies = this.activeTrie.search(query)
            console.log(foundMovies);
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

    unsearch (removedQuery) {

    }

    sort () {

    }

    unsort () {

    }


    filter () {

    }

    unfilter () {

    }
    
}

module.exports = {MovieList}