function convertOldMovie (mongoList) {
    console.log('IN OLD MOVIE CONVERTER')

    let convertedList = []
    for (let mongoMovie of mongoList) {

        console.log('IN FOR LOOP:')

        let convertedMovie = {
            'Const_IMDB': mongoMovie['constIMDB'],
            // 'Your Rating': mongoMovie['yourRating'],
            // 'Date Rated': mongoMovie['dateRated'],
            'Title': mongoMovie['title'],
            'URL': mongoMovie['url'],
            'Title Type': mongoMovie['titleType'],
            'IMDb Rating': mongoMovie['imdbRating'],
            'Runtime (mins)': mongoMovie['runtime'],
            'Year': mongoMovie['year'],
            'Genres': mongoMovie['genres'],
            'Num Votes': mongoMovie['numVotes'],
            // 'Release Date': mongoMovie['releaseRate'],
            'Directors': mongoMovie['directors']
        }

        console.log('NEXT1')

        // Check optional fields
        console.log(typeof(mongoMovie['yourRating']))
        // Your Rating
        if (mongoMovie.hasOwnProperty('yourRating')) {
            console.log(typeof(mongoMovie['yourRating']))
            // convertedMovie['Your Rating'] = mongoMovie['yourRating']
        }
        else {
            convertedMovie['Your Rating'] = 1
        }

        // Date Rated
        // if (mongoMovie.hasOwnProperty('dateRated')) {
        //     const [dateRatedDay, dateRatedMonth, dateRatedYear] = [mongoMovie['dateRated'].getDate(), mongoMovie['dateRated'].getMonth(), mongoMovie['dateRated'].getFullYear()]
            
        //     dateRatedDay = dateRatedDay.toString().padStart(2, '0')
        //     dateRatedMonth = dateRatedDay.toString().padStart(2, '0')

        //     // Convert dates back to strings
        //     convertedMovie['Date Rated'] = `${dateRatedDay}/${dateRatedMonth}/${dateRatedYear}`
        // }
        // else {
        //     convertedMovie['Date Rated'] = '01/01/1900'
        // }

        console.log('NEXT2')

        // Convert Release Date
        // const [releaseDateDay, releaseDateMonth, releaseDateYear] = [mongoMovie['releaseRate'].getDate(), mongoMovie['releaseRate'].getMonth(), mongoMovie['releaseRate'].getFullYear()]

        // releaseDateDay = releaseDateDay.toString().padStart(2, '0')
        // releaseDateMonth = releaseDateMonth.toString().padStart(2, '0')

        // // Convert dates back to strings
        // convertedMovie['Release Date'] = `${releaseDateDay}/${releaseDateMonth}/${releaseDateYear}`

        console.log('NEXT3')
        // Add movie to the list
        convertedList.push(convertedMovie)
    }

    console.log('CONVERTED LIST')
    console.log(convertedList)
    return convertedList
}

module.exports = convertOldMovie