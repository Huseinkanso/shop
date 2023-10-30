const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error) // this will be caught by the error handler middleware
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode // if the status code is 200, we want to set it to 500, otherwise we'll use the status code that 
    let message=err.message;
    if(err.name==='CastError' && err.kind==='ObjectId'){
        message='resource not found'
        statusCode=404
    }
    res.status(statusCode).json({
        message,
        stack:process.env.NODE_ENV==='production'?'prod':err.stack
    })
}

export { notFound, errorHandler }