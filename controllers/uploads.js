const csvConverter = require('../js/newCSVConverter')

module.exports.index = (req, res) => {
    res.render('upload', { pageTitle: 'Upload', enableButtons: req.isAuthenticated()});
}

module.exports.uploadFiles = async (req, res) => {
    await csvConverter(false, req.user._id)
    res.redirect('/movies')
}

module.exports.uploadSeeds = async (req, res) => {
    await csvConverter(true, req.user._id)
    res.redirect('/movies')
}