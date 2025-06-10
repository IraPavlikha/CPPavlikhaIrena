class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Користувач не авторизований');
    }

    static InternalError(message = 'Внутрішня помилка сервера') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;