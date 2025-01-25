class ApiResponse {
    constructor(
        statusCode,
        message = "success",
        data,
        success
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = success < 400
    }
}

export default ApiResponse;