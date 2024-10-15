class ApiError {
    constructor(statusCode, message) {
        this.statusCode = statusCode
        this.data = []
        this.message = message || "Something Went Wrong"
        this.success = false
    }
}

export { ApiError }