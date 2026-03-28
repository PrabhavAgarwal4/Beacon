const errorHandler = (err, req, res, next) => {

    if (err.code === '23505') { // Postgres code for Unique Violation
       err.statusCode = 400;
       err.message = "This record already exists.";
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);
    
    return res.status(statusCode).json({
        success: false,
        message,
        // Only show the stack trace in development mode
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;