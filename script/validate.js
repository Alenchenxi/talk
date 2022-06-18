//封装一个验证表单项的函数
class Validater {
    /**
     * 构造器
     * @param {String} txtId ：文本框的id
     * @param {Function} validataFunc :验证消息函数；每次验证都要调用该函数，验证成功返回undefined，验证失败返回错误消息
     */
    constructor(txtId, validataFunc) {
        this.inp = $('#' + txtId);//获取文本框
        this.p = this.inp.nextElementSibling;//获取设置错误消息的dom
        this.validataFunc = validataFunc;
        this.inp.onblur = () => {
            this.validate()
        }
    }

    /**
     * 验证成功返回true,验证失败返回false
     */
    async validate() {
        const err = await this.validataFunc(this.inp.value)
        if (err) {
            this.p.innerText = err;
            return false;
        }
        else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 验证传入的验证器数组是否全部验证成功，返回布尔值
     * @param  {...Array} validators ：验证器数组
     */
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const result = await Promise.all(proms);
        return result.every(v => v);
    }

    /**
     * 验证失败，将验证器的文本和错误消息清空
     * @param  {...any} validators ：验证器数组
     */
    static async rereg(...validators) {
        validators.forEach(v => { v.inp.value = ''; v.p.innerText = ''; })
    }
}