class FileElement {
    url; // 文件下载的url
    ext; // 文件扩展名
    size; // 文件大小
    modifyTime; // 文件修改时间
    createTime; // 文件创建时间
    name; // 文件名
    type; // 文件类型
    setUrl(url) {
        this.url = url;
        return this;
    }
    
    setExt(ext) {
        this.ext = ext;
        return this;
    }
    setSize(size) {
        this.size = size;
        return this;
    }
    setModifyTime(time) {
        this.modifyTime = time;
        return this;
    }
    setCreateTime(time) {
        this.createTime = time;
        return this;
    }
    setName(name){
        this.name = name;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
}

class DirElement {
    name; // 目录名
    size; // 目录大小（通常为 '-'）
    type; // 目录类型（通常为 DIR_TYPE）
    modifyTime; // 目录修改时间
    createTime; // 目录创建时间
    hasUpdate; // 是否有更新
    children; // 子目录或文件集合
    setName(name) {
        this.name = name;
        return this;
    }
    
    setSize(size) {
        this.size = size;
        return this;
    }
    
    setType(type) {
        this.type = type;
        return this;
    }
    
    setModifyTime(time) {
        this.modifyTime = time;
        return this;
    }
    
    setHasUpdate(hasUpdate) {
        this.hasUpdate = hasUpdate;
        return this;
    }
    
    setChildren(children) {
        this.children = children;
        return this;
    }
}

export { FileElement, DirElement }