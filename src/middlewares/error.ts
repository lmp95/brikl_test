import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // eslint-disable-next-line prefer-const
    let { statusCode, message } = err;
    statusCode = statusCode || 400;
    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        stack: err.stack,
    };

    res.status(statusCode).send(response);
};
