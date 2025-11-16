import http from '@/utils/http'
import { Response } from '@/types/response.js'

/*
    {
        "code": 1,
        "msg": "获取成功",
        "time": "1763260606",
        "data": {
            "grades": [
                "大一",
                "大二",
                "大三"
            ],
            "top_node_id": 36
        }
    }


*/
export const getGradeOptions = async (id) => {
    return http.get('/api/node/getTopInputUserInveter', {id : id}).then((res) => {
        // 转换为Response类型
        const response = new Response(res.code, res.message, res.data, res.time);
        
        // 验证响应是否正确
        if (response.code !== 1) {
            throw new Error(`API请求失败: ${response.msg}`);
        }
        // 将API返回的字符串数组转换为对象数组格式
        return response.data.grades.map(grade => ({ value: grade, text: grade }));
    })
}