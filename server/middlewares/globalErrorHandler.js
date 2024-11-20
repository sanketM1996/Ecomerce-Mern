export const globalErrorHnadler=(err,req,res,next)=>{
    const stack=err?.stack;
    const statusCode=err?.statusCode ? err?.statusCode :500;
    const message=err?.message;

    res.status(statusCode).json({
        stack,
        message
    });
};

// 404 handle
export const notFound=(req,res,next)=>{
    const err=new Error(`route ${req.originalUrl} not found`)
    next(err)
}