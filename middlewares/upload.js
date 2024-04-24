const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars/employees/')
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-employee-' + Date.now() + '-' + file.originalname)
    }
})

const uploads = multer({storage})

module.exports = uploads
