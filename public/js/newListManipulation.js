// Variables from the DOM
let addMovieButton = document.getElementById('addMovieButton')
let showList = document.getElementById('showList')
let submit = document.getElementById('submit')
let movies = document.getElementById('movies')
let movieList = document.getElementById('movieList')

// Add movie from datalist to created List
addMovieButton.addEventListener('click', (e) => {

    // Get the input from the datalist and declare as variables
    let currentSelectedMovie = document.getElementById('addMovie')

    // Test if inputted movie is from the selected list
    try {

        // Split the input into Title and Year
        currentSelectedMovieTitle = currentSelectedMovie.value.slice(0,-6)
        currentSelectedMovieYear = parseInt(currentSelectedMovie.value.slice(-5))

        // Find the selected movie from the datalist and store in addedMovie variable
        let addedMovie
        for (let i = 0; i < displayList.length; i++) {
            if ((currentSelectedMovieTitle === displayList[i]['Title']) && (currentSelectedMovieYear === displayList[i]['Year'])) {
                addedMovie = displayList[i]
                break
            }
        }

        // Check whether it is already in the list (compare Const_IMDBs)
        let isDuplicate = false
        for (let i = 0; i < createdList.length; i++) {
            if (addedMovie['Const_IMDB'] === createdList[i]['Const_IMDB']) {
                isDuplicate = true
                break
            }
        }

        // Test if the inputted movie is a duplicate
        if (!isDuplicate) {
            createdList.push(addedMovie)
        }
        else {
            console.error('Movie is already in the list')
        }
        
    } catch (e) {
        console.error('Movie does not exist')
    }

    currentSelectedMovie.value = ''
    updateDisplay()
})

// Move selected movie up/down in the list
function updateList(button) {

    /*
    Change codes are:
        u:  move movie 1 position up in list (i <-> i-1)
        d:  move movie 1 position down in list (i <-> i+1)
        r:  remove movie from the list
    */

    if (button.name === 'u') {
        [createdList[button.value], createdList[button.value-1]] = [createdList[button.value-1], createdList[button.value]]
    }
    else if (button.name === 'd') {
        [createdList[button.value], createdList[button.value+1]] = [createdList[button.value+1], createdList[button.value]]
    }
    else if (button.name === 'r') {
        createdList.splice(button.value, 1)
    }

    updateDisplay()
}

// Creates button
function createButton(innerHTML, name, className, value) {
    let newButton = document.createElement('button')
    newButton.innerHTML = innerHTML
    newButton.name = name
    newButton.value = value
    newButton.className = className
    return newButton
}

// Add event listener to update List
function buttonUpdateList(button) {
    button.addEventListener('click', (e) => {
        updateList(e.target)
    })
}

function updateListDisplay() {
    showList.innerHTML = ''

    // Iterate through created list and display
    for (let i = 0; i < createdList.length; i++) {
        let li = document.createElement('li')
        li.innerHTML = createdList[i]['Title'] + ', ' + createdList[i]['Year']

        // Up arrows for every move except the first
        if (i !== 0) {
            let upButton = createButton('&#x2191', 'u', 'btn btn-warning btn-sm', i)
            buttonUpdateList(upButton)
            li.appendChild(upButton)
        }
        
        // Down arrows for every move except the last element
        if (i !== createdList.length-1) {
            let downButton = createButton('&#x2193', 'd', 'btn btn-warning btn-sm', i)
            buttonUpdateList(downButton)
            li.appendChild(downButton)
        }

        // Add the remove button
        let removeButton = createButton('&#10006', 'r', 'btn btn-danger btn-sm', i)
        buttonUpdateList(removeButton)
        li.appendChild(removeButton)

        // Add all the list element to the displayed ordered list
        showList.appendChild(li)
    }
}


// Updates the datalist and displayed list
function updateSelectionDisplay() {
    // Update datalist - add movie
    movieList.innerHTML = ''
    
    // Created list for the datalist
    let dataListMovies = displayList.filter((mov) => {
        for (let createdMov of createdList) {
            if (createdMov['Const_IMDB'] === mov['Const_IMDB']) {
                return false
            }
        }
        return true
    })
    
    // Display the datalist 
    for (let mov of dataListMovies) {
        let newOption = document.createElement('option')
        newOption.innerHTML = `${mov['Title']}, ${mov['Year']}`
        movieList.appendChild(newOption)
    }
}


// Updates the HTML of the Displaylist
function updateDisplay() {

    updateListDisplay()
    updateSelectionDisplay()

    // Update the POST request for the current Created List
    movies.value = JSON.stringify(createdList)
}

