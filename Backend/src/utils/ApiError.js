class ApiError extends Error{
    constructor(
        statusCode,
        message='Something went wrong',
        errors=[],
        stack=""
    ){
        super(message) //calls parent constructor == Error(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        //stack trace shows where error happened
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}