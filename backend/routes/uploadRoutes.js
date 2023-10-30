import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// It is written on top of busboy for maximum efficiency.

const storage = multer.diskStorage({
    // The destination callback should accept two arguments: the request and the file.
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    // The filename callback is invoked for every file that passes the filter.
    // When uploading a file, Multer will automatically add the file extension in the filename property.
    // This is the original name of the file on the user's computer
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file,cb)
{
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    
    if(extname && mimetype)
    {
        return cb(null,true)
    }else{
        cb('images only')
    }
}

const upload = multer({
    storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
})

router.post('/',upload.single('image'),(req,res)=>{
    res.send({
        image:`/uploads/${req.file.filename}`,
        message:'image uploaded'
    })
})

export default router