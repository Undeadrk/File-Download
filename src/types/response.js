export class Response {
    constructor(code, msg, data, time) {
        this.data = data
        this.msg = msg
        this.code = code
        this.time = time
    }
}