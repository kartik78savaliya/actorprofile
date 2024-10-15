class ApiResponse {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode
        this.data = data || []
        this.message = message || "Success"
        this.success = true
    }
}

export { ApiResponse }