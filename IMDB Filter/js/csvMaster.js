// Packages and frameworks
const path = require('path')
const fs = require('fs')

// Constants
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

// Variables
let master_list = []


// Upload directory path
const directoryPath = path.join(__dirname, '../uploads')

// Function checks whether a given IMDB ID is already in the master_list
function containsDuplicate(Const_IMDB, master_list) {

	// Iterates through master list
	for (let i = 0; i < master_list.length; i++) {
		if (master_list[i]['Const_IMDB'] === Const_IMDB) {
			return true
		}
	}

	return false                                                  // No duplicates found
}


function csvConverter(file) {

  const data = fs.readFileSync(directoryPath+"\\"+file, {encoding:'utf8', flag:'r'});
  // Split data by line breaks into an array
  let fileArray = data.split("\r\n")
  let modifiedfileArray = []
  // Split rows by commas
  for (let row of fileArray) {
	let rowArray = []
	let current = ''
	let multipleLock = false
	for (let char of row+',') {
	  if (char === '"') {
		multipleLock = !multipleLock
	  }
	  else if ((char === ',') && (!multipleLock)) {
		rowArray.push(current)
		current = ''
	  }
	  else {
		current += char
	  }
	}
	modifiedfileArray.push(rowArray)
  }

  // Remove the all without IMDB_ID (removes headers and blank lines)
  let filteredObjArray = []
  for (let row of modifiedfileArray) {
	if ((row[0]) && (row[0].slice(0,2) === 'tt')) {
	  // Convert to objects
	  let rowObj = {}
	  titles.forEach(function(val, index) {
		rowObj[val] = row[index];
	  })

	  filteredObjArray.push(rowObj)
	}
	
  }

  for (let obj of filteredObjArray) {
	// Convert "Your Rating", "IMDB Rating", "Runtime" and "Year" to number type
	obj['Your Rating'] = parseInt(obj['Your Rating'])
	obj['IMDb Rating'] = parseInt(obj['IMDb Rating'])
	obj['Runtime (mins)'] = parseInt(obj['Runtime (mins)'])
	obj['Year'] = parseInt(obj['Year'])

	// Convert Genres and DIrectors to list type
	obj['Genres'] = obj['Genres'].split(',')
	for (let i = 0; i < obj['Genres'].length; i++) {
	  obj['Genres'][i] = obj['Genres'][i].trim()
	}
	obj['Directors'] = obj['Directors'].split(',')
	for (let i = 0; i < obj['Directors'].length; i++) {
	  obj['Directors'][i] = obj['Directors'][i].trim()
	}

  }

  // Remove duplicates
  for (let obj of filteredObjArray) {
	if (!containsDuplicate(obj['Const_IMDB'], master_list)) {
	  master_list.push(obj)
	}
  }
}

const runMaster = function() {
  filenames = fs.readdirSync(directoryPath);
  filenames.forEach(file => {
	csvConverter(file)
  });
  return master_list
}

module.exports = runMaster