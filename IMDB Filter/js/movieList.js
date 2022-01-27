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

    // Removes a search in place
    clearSearch () {
        
    }

    // #insertionSortStrings (title) {

    //     function arrayMove(fromIndex, toIndex) {
    //         let element = this.activeList[fromIndex];
    //         this.activeList.splice(fromIndex, 1);
    //         this.activeList.splice(toIndex, 0, element);
    //     }

    //     for (let i = 1; i < this.activeList.length; i++) {

    //         for (let j = i - 1; j >= 0; j--) {

    //             // Lexicographical comparison of words
    //             if (this.activeList[i][title].toLowerCase() < this.activeList[j][title].toLowerCase()) {

    //                 // Edge case - if already sorted in place
    //                 if (j === i - 1) {
    //                     break
    //                 }
    //                 else {
    //                     arrayMove(i, j)
    //                     break
    //                 }
    //             }
    //         }
    //     }
    // }

    // sort (sortTitle) {

    //     this.searchSortFilter.push(sortTitle)

    //     // Constants
    //     const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Num Votes', 'Release Date']

    //     // No sorting for list types
    //     if (['URL', 'Genres', 'Directors'].includes(sortTitle)) {
    //         return
    //     }

    //     // String sorts
    //     if (['Title', 'Title Type'].includes(sortTitle)) {
    //         // Insertion sort for strings
    //         this.#insertionSortStrings(sortTitle)
    //         return
    //     }

    // }

    unsort () {

    }


    filter () {

    }

    unfilter () {

    }
    
}

module.exports = {MovieList}