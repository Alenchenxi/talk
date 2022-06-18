const loginIdValidator = new Validater('txtLoginId', function (val) {
    if (!val) {
        return '请填写帐号'
    }

})
const loginPwdValidator = new Validater('txtLoginPwd', async function (val) {
    if (!val) {
        return '请填写密码'
    }
})
$('.user-form').onsubmit = async (e) => {
    e.preventDefault();
    const result = await Validater.validate(loginIdValidator, loginPwdValidator);
    if (result) {
        alert('登陆成功，点击确认后跳转到首页');
        const pwd = await loginPwdValidator;
        await API.login({ loginId: loginIdValidator.inp.value, loginPwd: pwd.inp.value })
        location.href = `../${BASE_URL}/index.html`;
    }
    else {
        alert('登陆失败,请检查帐号和密码')
        Validater.rereg(loginIdValidator, loginPwdValidator);
    }
}