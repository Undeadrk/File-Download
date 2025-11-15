import http from '@/utils/http'
import { Response } from '@/types/response.js'

export const sendVerifyCode = (phone) => {
    return http.get('/api/node/sendVerifyCode', { phone: phone }).then(res => {
        // 转换为Response类型
        const response = new Response(res.code, res.message, res.data, res.time);
        
        // 验证响应是否正确
        if (response.code !== 1) {
            throw new Error(`API请求失败: ${response.msg}`);
        }
        
        return response;
    });
}
export const verifyCode = (phone, verifyCode) => {
    return http.get('/api/node/verifyCode', { phone: phone, code: verifyCode }).then(res => {
        // 转换为Response类型
        const response = new Response(res.code, res.message, res.data, res.time);
        
        // 验证响应是否正确
        if (response.code !== 1) {
            return false;
        }
        
        return true;
    });
}

export const saveUserInfo = (userInfo) => {
    return http.post('/api/node/saveUserInput', {
        node_id: userInfo.node_id || 0, // 如果不存在直接设置为0
        phone: userInfo.phone,
        grade: userInfo.grade,
        name: userInfo.name
    }).then(res => {
        // 转换为Response类型
        const response = new Response(res.code, res.message, res.data, res.time);
        
        // 验证响应是否正确
        if (response.code !== 1) {
            throw new Error(`用户信息保存失败: ${response.msg}`);
        }
        
        return response;
    })
}