import axios from "axios";

// 创建axios实例
const instance = axios.create({
    baseURL: '/server', // 基础URL，结合代理配置使用
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    withCredentials: true,
});
// 请求拦截器
instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 统一处理响应数据
        const res = response.data;
        // 可以根据后端返回的code进行统一处理
        // if (res.code !== 200) {
        //     // 错误处理
        //     return Promise.reject(new Error(res.message || 'Error'));
        // }
        return res;
    },
    error => {
        // 统一处理响应错误
        return Promise.reject(error);
    }
);

// 封装HTTP请求方法
const http = {
    // GET请求
    get(url, params = {}) {
        return instance.get(url, { params });
    },

    // POST请求
    post(url, data = {}) {
        return instance.post(url, data);
    },

    // PUT请求
    put(url, data = {}) {
        return instance.put(url, data);
    },

    // DELETE请求
    delete(url, params = {}) {
        return instance.delete(url, { params });
    },

    // 文件上传
    upload(url, file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);

        // 可以添加其他参数
        Object.keys(options).forEach(key => {
            formData.append(key, options[key]);
        });

        return instance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 获取blob数据
    getBlob(url) {
        return instance.get(url, {
            responseType: 'blob'
        });
    },

    // 文件下载
    download(url, filename) {
        return this.getBlob(url).then(response => {
            // 创建下载链接
            const blob = new Blob([response]);
            const downloadUrl = URL.createObjectURL(blob);

            // 创建a标签并下载
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // 释放资源
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            return response;
        });
    }
};

export default http;
