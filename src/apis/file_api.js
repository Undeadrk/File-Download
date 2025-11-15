import http from "@/utils/http";
import { Response } from "@/types/response.js";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { fileItemTransfer } from '@/utils/dataTransfer';
import { showNotify } from 'vant';
import axios from "axios";

// 常见MIME类型到文件扩展名的映射
const mimeToExtensionMap = {
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/pdf': '.pdf',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'text/html': '.html',
    'application/json': '.json',
    'application/javascript': '.js',
    'text/css': '.css',
    'application/zip': '.zip',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'video/mp4': '.mp4'
};

// 根据MIME类型为文件名添加合适的扩展名
const getFileNameWithExtension = (fileName, mimeType) => {
    // 检查文件名是否已经包含扩展名
    if (fileName && /\.[0-9a-z]+$/i.test(fileName)) {
        return fileName;
    }

    // 根据MIME类型获取扩展名
    const extension = mimeToExtensionMap[mimeType];
    if (extension) {
        return `${fileName || '未命名文件'}${extension}`;
    }

    // 如果没有找到匹配的MIME类型，返回原始文件名
    return fileName || '未命名文件';
};

// 可靠的文件下载函数，支持超时和二进制数据处理
export const downloadFileFromUrl = async (url, fileName, timeout = 30000) => {
    // 检查URL是否有效
    if (!url || !url.startsWith('http')) {
        throw new Error('无效的文件URL')
    }

    // 提取相对路径以避免重复URL
    const relativeUrl = extractRelativePath(url);
    
    // 使用配置好的http工具获取blob数据
    const blob = await http.getBlob(relativeUrl);
    return { blob, mimeType: blob.type }
}

// TODO 解决file的file_url是完整的公网URL而不是http里已经设置好的baseURL + 对应接口
// 调用问题，当前接口无法获取当前所在目录的名称，只能获取ID，而通过ID无法获取当前目录名称
// 进度条尚未实现


export const fileDetaileApi = (id) => {
    return http.get('/api/node/index', { id: id }).then(res => {
        // 转换为Response类型
        const response = new Response(res.code, res.message, res.data, res.time);
        
        // 验证响应是否正确
        if (response.code !== 1) {
            throw new Error(`API请求失败: ${response.msg}`);
        }
        
        // 转换为FileItem类型
        return fileItemTransfer(response);
    });
}

export const fileDownloadApi = async (file, folderName) => {
    try {
        // 首先判定file是否为列表，为列表时代表点击了下载当前进行一并下载
        if(Array.isArray(file)) {
            if(!folderName) {
                folderName = "根目录";
            }

            // 若为列表需要将所有的子文件/文件夹打包
            const zip = new JSZip();
            const folder = zip.folder(folderName);

            // 遍历所有文件/文件夹，进行递归处理
            await Promise.all(file.map(item => process(item, folder, zip)));
            
            // 全部打包完成后，压缩并下载
            const content = await zip.generateAsync({ 
                type: "blob",
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            
            saveAs(content, folderName + ".zip");
            showNotify({ type: 'success', message: `已成功下载${folderName}.zip` });
            return true;
        } 
        else {
            // 仅为单个文件，直接获取file.file_url并将其下载即可
            if (file.type === "file" && file.file_url) {
                // 使用可靠的下载函数下载单个文件
                const { blob, mimeType } = await downloadFileFromUrl(file.file_url);
                const fileNameWithExt = getFileNameWithExtension(file.name, mimeType);
                saveAs(blob, fileNameWithExt);
                showNotify({ type: 'success', message: `已成功下载${fileNameWithExt}` });
                return true;
            } else if (file.type === "folder") {
                // 单个文件夹的情况，递归获取内容并打包
                const zip = new JSZip();
                await process(file, null, zip);
                
                const content = await zip.generateAsync({ 
                    type: "blob",
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });
                
                saveAs(content, (file.name || "未命名文件夹") + ".zip");
                showNotify({ type: 'success', message: `已成功下载文件夹` });
                return true;
            } else {
                throw new Error('无效的文件类型或下载链接');
            }
        }
    } catch (error) {
        console.error('文件下载失败:', error);
        showNotify({ type: 'danger', message: `下载失败: ${error.message || '未知错误'}` });
        throw error;
    }
}
// 用于将完整路径分割为相对路径,具体为删掉前面的https://start.dayinbz.cn，这个也是/server的映射路径
const extractRelativePath = (fullPath) => {
    const baseURL = "https://start.dayinbz.cn/";
    return fullPath.replace(baseURL, "");
}
// 递归处理文件和文件夹的异步函数
const process = async (file, parentFolder, zip) => {
    try {
        if(file.type === "folder") {
            // 文件类型为文件夹，需获取其子文件
            let fileItems = await fileDetaileApi(file.id);
            
            let folder
            if(parentFolder){
                folder = parentFolder.folder(file.name || "未命名文件夹");
            }else{
                folder = zip.folder(file.name || "未命名文件夹");
            }
            // 打印当前文件夹 —— 文件列表
            console.log(`当前文件夹: ${file.name || "未命名文件夹"}`);
            console.log(`子文件/文件夹列表: ${fileItems.map(item => item.name || item.type)}`);
            // 递归处理子文件/文件夹
            await Promise.all(fileItems.map(item => process(item, folder, zip)));
        } else if(file.type === "file") {
            // 若为file代表可以直接加入其中
            // 下载file，然后加入到对应的folder中
            if (file.file_url) {
                // 使用可靠的下载函数获取文件二进制内容
                const { blob, mimeType } = await downloadFileFromUrl(file.file_url);
                const fileNameWithExt = getFileNameWithExtension(file.name, mimeType);
                
                parentFolder.file(fileNameWithExt, blob);
            } else {
                throw new Error(`文件 ${file.name || '未命名文件'} 缺少下载链接`);
            }
        }
    } catch (error) {
        console.error(`处理 ${file.name || '未知文件'} 时出错:`, error);
        // 继续处理其他文件，而不是直接中断整个下载过程
    }
}