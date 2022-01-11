class MovieList {
    constructor(masterList) {
        // this.master = masterList
        this.active = masterList
        this.activeTrie = 
        this.inactive = []
        this.inactiveTrie = 
        this.searchSortFilter = {
            search: [],
            sort: [],
            filter: []
        }
    }

    query (alteredSearchSortFilter) {
        // Search

        // Search query has been added
        if (this.searchSortFilter.search.length < alteredSearchSortFilter.search.length) {
            
        }

        // Search query has been removed
        if (this.searchSortFilter.search.length > alteredSearchSortFilter.search.length) {

        }
    }

    search () {

    }

    unsearch () {

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