//处理首页
(async function () {
    const resp = await API.profile();
    const userObj = resp.data;
    //验证是否登陆
    if (!userObj) {
        alert('未登录，或登录已过期，请重新登陆');
        location.href = `../${BASE_URL}/login.html`;
        return
    }
    const doms = {
        aside: {
            nickname: $('.aside #nickname'),
            loginId: $('.aside #loginId'),
        },//显示用户信息
        close: $('.close'),//关闭窗口
        chatForm: $('.msg-container'),//用户发送消息的表单
        chatContainer: $('.chat-container'),//对话容器
    };//获取所有需要的DOM元素
    //接下来的情况都是登陆
    //初始化页面
    await initScreen();
    //交互
    inter();

    async function initScreen() {
        //将用户的信息显示到页面
        initUserInfo(userObj);
        //将聊天记录显示到页面上
        await initHistory();
        //将滚动条滑倒底部
        scrollBottom();
    }

    function initUserInfo(userInfo) {
        doms.aside.loginId.innerText = userInfo.loginId;
        doms.aside.nickname.innerText = userInfo.nickname;
    }
    async function initHistory() {
        const resp = await API.getHistory();
        resp.data.forEach(h => addChat(h))
    }
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    function inter() {
        //注销
        doms.close.onclick = () => {
            API.loginOut();
            location.href = `../${BASE_URL}/login.html`;
        }
        //发送消息
        const inp = doms.chatForm.querySelector('input');
        doms.chatForm.onsubmit = async (e) => {
            e.preventDefault();
            //设置发送的消息
            const content = inp.value;
            const id = userObj.loginId;
            addChat({ from: id, to: null, content: content, createdAt: Date.now() });
            scrollBottom();
            inp.value = '';
            //显示返回的消息
            const replay = await API.sendMessage(content);
            addChat({ from: null, to: id, ...replay.data });
            scrollBottom();
        }
    }

    //设置消息
    function addChat(chatInfo) {
        const chatItem = $$$('div');
        const img = $$$('img');
        const chatContent = $$$('div');
        const chatData = $$$('div');
        chatItem.className = 'chat-item';
        chatInfo.from && chatItem.classList.add('me');
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
        img.className = 'chat-avatar';
        chatContent.className = 'chat-content';
        chatContent.innerText = chatInfo.content;
        chatData.className = 'chat-date';
        chatData.innerText = getData(chatInfo.createdAt);
        doms.chatContainer.appendChild(chatItem);
        chatItem.appendChild(img);
        chatItem.appendChild(chatContent);
        chatItem.appendChild(chatData);
    }

    function getData(timestamp) {
        const data = new Date(timestamp);
        const year = data.getFullYear().toString().padStart(4, '0');
        const month = (data.getMonth() + 1).toString().padStart(2, '0');
        const day = data.getDate().toString().padStart(2, '0');
        const hour = data.getHours().toString().padStart(2, '0');
        const min = data.getMinutes().toString().padStart(2, '0');
        const sec = data.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }
})();


