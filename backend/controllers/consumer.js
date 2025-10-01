const ShortModel = require('../models/short')


exports.short = async (req, res) => {
    const url = req.body.url
    const preferedText = req.body.preferedText
    const email = req.body.email

    if (req.body.id) {
        const updatedShortsData = await ShortModel.findOneAndUpdate({ _id: req.body.id }, { url, preferedText })
        console.log('updatedShortsData-', updatedShortsData)
        return res.json({ isUpdatedShortsData: true })
    }

    const isFound = await ShortModel.findOne({ email, preferedText })
    if (isFound) {
        return res.json({ msg: 'you have already used this prefered text!' })
    }

    const newShort = new ShortModel({
        url,
        preferedText,
        email
    })
    const newSavedShort = await newShort.save()
    console.log('newSavedShort-', newSavedShort)

    return res.json({ isShortSaved: true, savedShort: newSavedShort })
}


exports.getShorts = async (req, res) => {
    const email = req.header('email');

    const data = await ShortModel.find({ email })
    return res.json({ data })
}


exports.redirectToURL = async (req, res) => {
    const params = req.params

    const isFound = await ShortModel.findOne({ preferedText: params.preferedText, _id: params.id })
    if (!isFound) {
        return res.json({ msg: 'data for this prefertext doesnt exists!' })
    }

    return res.redirect(isFound.url)
}


exports.deleteShort = async (req, res) => {
    const id = req.body.id;

    const isFoundAndDeleted = await ShortModel.findOneAndDelete({ _id: id })
    if (!isFoundAndDeleted) {
        return res.json({ msg: 'doc with this id not found!' })
    }
    console.log('deletedShort-', isFoundAndDeleted)
    return res.json({ isShortDeleteSuccess: true })
}