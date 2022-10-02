const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/')
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + file.originalname)
    }
})

const filter = function(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(new Error('Invalid File, Upload an Image'), false)
    }
}

const fileLimit = function(req, file, cb) {
    if (file.size < 1024 * 1024 * 1) {
        cb(new Error('Max File Size is 1MB'), false)
    } else {
        cb(null, true)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filter,
    limits: fileLimit
})

module.exports = upload