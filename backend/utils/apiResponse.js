export const apiResponse = {
    success: (res, data, message = 'Success') => {
        res.status(200).json({
            status: 'success',
            message,
            data
        });
    },

    error: (res, message = 'Error', statusCode = 500) => {
        res.status(statusCode).json({
            status: 'error',
            message
        });
    },

    unauthorized: (res, message = 'Unauthorized') => {
        res.status(401).json({
            status: 'fail',
            message
        });
    }
};