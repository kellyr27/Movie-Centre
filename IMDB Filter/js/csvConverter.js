// Packages and frameworks
const path = require('path')
const fs = require('fs')
const e = require('express')

// Constants
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated', 'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']

// Exported function to combine processors
const runCSV = function(importedList, isTestUpload, newFileList) {
	// Function checks whether a given IMDB ID is already in the masterList
	function containsDuplicate(Const_IMDB, masterList) {

		// Iterates through master list to find duplicate IDs
		for (let i = 0; i < masterList.length; i++) {
			if (masterList[i]['Const_IMDB'] === Const_IMDB) {
				return true
			}
		}

		return false                                                  	// No duplicates found
	}

	// Function converts data to a list of objects (masterList)
	function csvConverter(file) {

		const data = fs.readFileSync(directoryPath + "\\" + file, {encoding:'utf8', flag:'r'})
		
	  	// Split data by line breaks into an array
		let fileArray = data.split("\r\n")
		let modifiedfileArray = []										// Stores arrays of movie data
	  
		// Split rows by commas
		for (let row of fileArray) {
		
			let rowArray = []
			let current = ''
			let multipleLock = false									// Checks for '"', which indicate in a CSV an array

			for (let char of (row+',')) {

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
		
			modifiedfileArray.push(rowArray)							// Add the array (Movie data) into the modifiedfileArray
		}
  
		// Remove all without IMDB_ID (removes headers and blank lines) and convert movies from arrays to objects
		let filteredObjArray = []										// Store array of object movies
		for (let row of modifiedfileArray) {
			if ((row[0]) && (row[0].slice(0,2) === 'tt')) {
				
				// Convert to objects
				let rowObj = {}
				titles.forEach(function(val, index) {
					rowObj[val] = row[index]
				})
	
				filteredObjArray.push(rowObj)
			}
		}
  
	  	// Convert object properties from strings to appropriate data types
		for (let obj of filteredObjArray) {
		  
			// Convert "Your Rating", "IMDB Rating", "Runtime" and "Year" to number type
			obj['Your Rating'] = parseInt(obj['Your Rating'])
			obj['IMDb Rating'] = parseFloat(obj['IMDb Rating'])
			obj['Runtime (mins)'] = parseInt(obj['Runtime (mins)'])
			obj['Year'] = parseInt(obj['Year'])
	
			// Convert Genres and Directors to list type and trim spaces
			obj['Genres'] = obj['Genres'].split(',')

			for (let i = 0; i < obj['Genres'].length; i++) {
				obj['Genres'][i] = obj['Genres'][i].trim()
			}
  
			obj['Directors'] = obj['Directors'].split(',')
			for (let i = 0; i < obj['Directors'].length; i++) {
				obj['Directors'][i] = obj['Directors'][i].trim()
		  	}

			// Check the date formatsobj['Runtime (mins)']
			if (obj['Date Rated'].length === 9) {
				obj['Date Rated'] = '0' + obj['Date Rated']
			}
			if (obj['Release Date'].length === 9) {
				obj['Release Date'] = '0' + obj['Release Date']
			}
		}
  
	  	// Remove duplicates when inserting into the master list
		for (let obj of filteredObjArray) {
			if (!containsDuplicate(obj['Const_IMDB'], masterList)) {
				masterList.push(obj)
			}
		}
  	}

	// Variables
	let masterList = importedList
	let directoryPath

	// Upload directory path
	if (isTestUpload) {
		directoryPath = path.join(__dirname, '../uploads-test')
	}
	else {
		directoryPath = path.join(__dirname, '../uploads')
	}

	filenames = fs.readdirSync(directoryPath)						// Read files from /uploads and convert them to the master list. Allows for multiple file uploads

	filenames.forEach(file => {
		if ((newFileList.includes(file)) || isTestUpload) {
			csvConverter(file)
		}
	})
	
	return masterList
}

module.exports = runCSV