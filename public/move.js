// 设置方块的初始位置
//正方形の初期位置を設定する
let positionX = 0;
let positionY = 0;

// user account
var username = prompt("请输入 username：");
const client_list = [];
const client_num = client_list.length
const init_instance = {
  event: "init_event",
  username: username,
  x: positionX,
  y: positionY
};
// websocket 連接
const ws = new WebSocket('ws://localhost:8181/ws/test')

// 监听WebSocket连接事件
//// WebSocket接続イベントのリスニング
ws.addEventListener('open', (event) => {
  console.log('WebSocket连接已打开');
  ws.send(JSON.stringify(init_instance));
});

// 监听WebSocket接收消息事件
//WebSocketの受信メッセージイベントをリスニングする
ws.addEventListener('message', (event) => {
  // 解析接收到的数据为JSON格式
  const receivedData = JSON.parse(event.data);
  const resp_event = receivedData['event']
  const receivedClientList = receivedData.client_list;
  const receivedClientNum = receivedData.client_num;
  const receivedClientKey = receivedData.client_key;
  const receivedUserList = receivedData.user_list;
  const receivedUsername = receivedData.username;
  const receivedX = receivedData.x;
  const receivedY = receivedData.y;
  // const changeX = receivedData.user_list
  // const changeY = receivedData.user_list
  console.log(receivedData)

  // (0, 0)にブロックを生成
  if (resp_event == "init_resp_event") {
    if (receivedUsername == username) {
      const box = document.createElement('div');
      const myBoxId = username;
      box.setAttribute('id', myBoxId); // 设置方块的ID属性
      box.classList.add('box');
      box.style.backgroundColor = 'red';
      box.style.left = positionX;
      box.style.top = positionY;
      box.style.zIndex = receivedClientNum * 10;
      container.appendChild(box);
      console.log(receivedUserList);
      // 循环遍历 receivedUserList 中的每个用户
      //receivedUserListの各ユーザーをループ処理する。
      //前から生成されたもの
      for (user in receivedUserList) {
        console.log("user:  " + user)
        // const { username, positionX, positionY, client_num } = user;

        // 检查是否是当前用户
        //自分がカレントユーザーであるかどうかを確認する
        if (receivedUserList[user]["username"] != username) {
          console.log("================", receivedUserList[user]["x"])
          // 创建新的方块
          //新しいスクエアを作成する
          const newBox = document.createElement('div');
          const newBoxId = receivedUserList[user]['username'];
          newBox.setAttribute('id', newBoxId); // 设置方块的ID属性
          newBox.classList.add('newBox');
          newBox.style.backgroundColor = 'black';
          newBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
          newBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
          //kimu追加
          console.log(receivedClientList)
          newBox.style.zIndex = receivedClientList.length * 10;
          container.appendChild(newBox);
        }
      }

    //後から生成されたもの
    } else {
      // console.log('接收到的 client_key:', receivedClientKey);
      // console.log('接收到的 x:', receivedX);
      // console.log('接收到的 y:', receivedY);
      const newBox = document.createElement('div');
      const newBoxId = receivedUsername;
      newBox.setAttribute('id', newBoxId); // 设置方块的ID属性  正方形のIDプロパティを設定する
      newBox.classList.add('newBox');
      newBox.style.backgroundColor = 'black';
      newBox.style.left = receivedX * 10 + 'px';
      newBox.style.top = receivedY * 10 + 'px';
      newBox.style.zIndex = client_list.length;
      container.appendChild(newBox);
    }
  } else if (resp_event == "position_resp_event") {
    console.log(receivedUsername)
    const targetUsername = receivedUsername;
    let index = null;
    //kimu追加
    console.log(typeof(receivedData.user_list))
    for (let i = 0; i < receivedData.user_list.length; i++) {
      const userDict =receivedData.user_list[i];
      if (userDict.username === targetUsername) {
        index = i;
        break;
      }
    }
    
    // console.log(receivedData.user_list[index])
    console.log("userDict:  " + index)
    const newBox = document.getElementById(receivedUsername);

    newBox.style.left = receivedData.user_list[index]["x"] * 10 + 'px';
    newBox.style.top = receivedData.user_list[index]["y"] * 10 + 'px';
    ///////////////////////////////////追加　木村////////////////////////////////
  }else if(resp_event == "healthcheck_event"){
    const healthcheck_resp_eventData = {
      event: "healthcheck_resp_event",
      username: receivedUsername,
      client_key: receivedClientKey
    };
    console.log(healthcheck_resp_eventData)
    ws.send(JSON.stringify(healthcheck_resp_eventData));
  }else if(resp_event == "user_delete_event"){
    var element = document.getElementById(receivedUsername);
    element.remove();
  }
  ///////////////////////////////////////////////////////////////////////////////
});

// 监听WebSocket错误事件
//WebSocketのエラーイベントをリスニングする
ws.addEventListener('error', (event) => {
  console.error('WebSocket发生错误:', event);
});


function moveMyBox() {
  // 获取方块元素
  //四角い要素を取得する
  const myBox = document.getElementById(username);
  myBox.style.left = positionX * 10 + 'px';
  myBox.style.top = positionY * 10 + 'px';

  // 发送位置状态到服务器
  //位置情報をサーバーに送信する
  const positionData = {
    event: "position_event",
    username: username,
    x: positionX,
    y: positionY
  };

  ws.send(JSON.stringify(positionData));
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'ArrowUp') {
    positionY -= 1;
  } else if (key === 'ArrowDown') {
    positionY += 1;
  } else if (key === 'ArrowLeft') {
    positionX -= 1;
  } else if (key === 'ArrowRight') {
    positionX += 1;
  }

  console.log("X:", positionX, "Y:", positionY)
  requestAnimationFrame(moveMyBox);
});