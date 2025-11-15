export class UserInfo {
    constructor() {
        this.name = '';
        this.phone = '';
        this.verifyCode = '';
        this.grade = '';
        // 想要了解的课程集合(多选)
        this.courses = []; // 假设courses是字符串数组
        // 最近校区(单选)
        this.recentCampus = '';
        // 用户是否同意用户服务条款和隐私政策
        this.acceptance = false;
        this.node_id = '';
    }

    /**
     * 检查所有属性是否为空，并验证手机号格式。
     * @returns {Object} 包含 { isValid: boolean, message: string } 的对象。
     */
    check() {
        // 1. 姓名不能为空
        if (!this.name || this.name.trim() === '') {
            return { isValid: false, message: '姓名不能为空' };
        }

        // 2. 手机号不能为空且符合格式
        if (!this.phone || this.phone.trim() === '') {
            return { isValid: false, message: '手机号不能为空' };
        }
        // 简单的手机号正则验证，更严谨的可能需要考虑更多国家和地区的规则
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(this.phone.trim())) {
            return { isValid: false, message: '手机号格式不正确' };
        }

        // 3. 验证码不能为空
        if (!this.verifyCode || this.verifyCode.trim() === '') {
            return { isValid: false, message: '验证码不能为空' };
        }

        // 4. 年级不能为空
        if (!this.grade || this.grade.trim() === '') {
            return { isValid: false, message: '年级不能为空' };
        }
/* 
        // 5. 课程集合不能为空 (假设至少选择一项)
        if (!this.courses || this.courses.length === 0) {
            return { isValid: false, message: '请选择至少一门课程' };
        }

        // 6. 最近校区不能为空
        if (!this.recentCampus || this.recentCampus.trim() === '') {
            return { isValid: false, message: '请选择最近校区' };
        }
 */
        // 如果所有检查都通过
        return { isValid: true, message: '所有信息均有效' };
    }
    checkPhone(){
        // 手机号不能为空且符合格式
        if (!this.phone || this.phone.trim() === '') {
            return { isValid: false, message: '手机号不能为空' };
        }
        // 简单的手机号正则验证，更严谨的可能需要考虑更多国家和地区的规则
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(this.phone.trim())) {
            return { isValid: false, message: '手机号格式不正确' };
        }
    }
}
