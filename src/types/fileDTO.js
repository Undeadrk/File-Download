export class FileItem {
    // id, name, type, parent_id, need_input, level, status, createtime, updatetime, file_url
    constructor(id, name, type, parent_id, need_input, level, status, createtime, updatetime, file_url) {
        this.id = id
        this.name = name
        this.type = type
        this.parent_id = parent_id
        this.need_input = need_input
        this.level = level
        this.status = status
        this.createtime = createtime
        this.updatetime = updatetime
        this.file_url = file_url
    }
}