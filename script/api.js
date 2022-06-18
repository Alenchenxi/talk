const API = (() => {
    const HOST_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';
    async function get(path) {
        const headers = getHeader();
        return await fetch(HOST_URL + path, { headers });
    }
    async function post(path, bodyObj) {
        const headers = getHeader('application/json');
        return await fetch(HOST_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        })
    }
    function getHeader(ContentType) {
        const headers = {};
        ContentType && (headers['Content-Type'] = ContentType);
        const token = localStorage.getItem(TOKEN_KEY);
        token && (headers['authorization'] = `Bearer ${token}`);
        return headers;
    }

    /**
     * 注册接口
     * @param {*} userInfo ：用户的信息：id,nickname,pwd
     */
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then(resp => resp.json());
    }

    /**
     * 登陆接口
     * @param {*} userInfo ：用户的id,pwd
     */
    async function login(userInfo) {
        const resp = await post('/api/user/login', userInfo);
        const authorization = resp.headers.get('authorization');
        authorization && localStorage.setItem(TOKEN_KEY, authorization);
        return await resp.json();
    }

    /**
     * 验证帐号接口
     * @param {*} loginId ：用户名
     */
    async function exists(loginId) {
        return await get(`/api/user/exists?loginId=${loginId}`).then(resp => resp.json());
    }

    /**
    * 当前登陆的用户信息接口
    */
    async function profile() {
        return await get('/api/user/profile').then(resp => resp.json());
    }

    /**
     * 发送消息接口
     * @param {*} content ：发送的内容
     */
    async function sendMessage(content) {
        return await post('/api/chat', { content }).then(resp => resp.json());
    }

    /**
     * 获取历史记录接口
     */
    async function getHistory() {
        return await get('/api/chat/history').then(resp => resp.json());
    }

    /**
     * 注销
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return { reg, login, profile, exists, sendMessage, getHistory, loginOut };
})()