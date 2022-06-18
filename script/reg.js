const loginIdValidator = new Validater('txtLoginId', async function (val) {
    if (!val) {
        return '请填写帐号'
    }
    const resp = await API.exists(val);
    if (resp.data) {
        return '该账号已经被占用，请更换新的账号名'
    }
})
const nicknameValidator = new Validater('txtNickname', async function (val) {
    if (!val) {
        return '昵称不能为空'
    }
})
const loginPwdValidator = new Validater('txtLoginPwd', async function (val) {
    if (!val) {
        return '请填写密码'
    }
})
const loginPwdConfirmValidator = new Validater('txtLoginPwdConfirm', async function (val) {
    if (!val) {
        return '请填写确认密码'
    }
    else if (val !== loginPwdValidator.inp.value) {
        return '密码不一致，请再次确认密码是否正确'
    }
})
$('.user-form').onsubmit = async (e) => {
    e.preventDefault();
    const result = await Validater.validate(loginIdValidator, loginPwdValidator, nicknameValidator, loginPwdConfirmValidator);
    if (result) {
        alert('注册成功，点击确认后跳转到登陆界面')
        location.href = `../${BASE_URL}/login.html`;
    }
    else {
        alert('注册失败,请重新注册')
        Validater.rereg(loginIdValidator, loginPwdValidator, nicknameValidator, loginPwdConfirmValidator);
    }
}