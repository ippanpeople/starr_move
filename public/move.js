// 设置方块的初始位置
let positionX = 0;
let positionY = 0;
let room_status = "exit";

// user account
var username = prompt("usernameを入力：");
const client_list = [];
const client_num = client_list.length
const init_instance = {
  event: "init_event",
  username: username,
  x: positionX,
  y: positionY,
  room_status: room_status
};
// websocket コネクション
const ws = new WebSocket('ws://localhost:8181/ws/test')

// Listen On WebSocket コネクション　Open
ws.addEventListener('open', (event) => {
  console.log('WebSocket连接已打开');
  ws.send(JSON.stringify(init_instance));
});

// Listen On WebSocket Message Receive
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
  const receivedRoomStatus = receivedData.room_status;
  // const changeX = receivedData.user_list
  // const changeY = receivedData.user_list
  console.log(receivedData)

  // (0, 0)にブロックを生成
  if (resp_event == "init_resp_event") {
    if (receivedUsername == username) {
      const box = document.createElement('div');
      const myBoxId = username;
      box.setAttribute('id', myBoxId); // 自分のブロックidを設置する
      box.classList.add('box');
      box.style.backgroundColor = 'red';
      box.style.left = positionX;
      box.style.top = positionY;
      box.style.zIndex = receivedClientNum * 10;
      container.appendChild(box);
      console.log(receivedUserList);
      // receivedUserList の中にいるすべてのユーザを検索
      for (user in receivedUserList) {
        // const { username, positionX, positionY, client_num } = user;

        // 自分かどうかを確認
        if (receivedUserList[user]["username"] != username) {
          console.log("================", receivedUserList[user]["x"])
          // 自分じゃなければ、他人のボロックを生成
          const newBox = document.createElement('div');
          const newBoxId = receivedUserList[user]['username'];
          newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
          newBox.classList.add('newBox');
          newBox.style.backgroundColor = 'black';
          newBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
          newBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
          newBox.style.zIndex = receivedClientList.length * 10;
          container.appendChild(newBox);
        }
      }
    } else {
      // console.log('接收到的 client_key:', receivedClientKey);
      // console.log('接收到的 x:', receivedX);
      // console.log('接收到的 y:', receivedY);
      const newBox = document.createElement('div');
      const newBoxId = receivedUsername;
      newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
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

    for (let i = 0; i < receivedData.user_list.length; i++) {
      const userDict = receivedData.user_list[i];
      if (userDict.username === targetUsername) {
        index = i;
        break;
      }
    }
    console.log(receivedData.user_list[index])
    const newBox = document.getElementById(receivedUsername);

    newBox.style.left = receivedData.user_list[index]["x"] * 10 + 'px';
    newBox.style.top = receivedData.user_list[index]["y"] * 10 + 'px';
  }
});

// Listen On WebSocket Error
ws.addEventListener('error', (event) => {
  console.error('WebSocket　Error が発生:', event);
});


function moveMyBox() {
  // ブラックのエレメントを取得
  const myBox = document.getElementById(username);
  myBox.style.left = positionX * 10 + 'px';
  myBox.style.top = positionY * 10 + 'px';

  //　table_areaのぶつかる処理判定
  if (44 < positionX && positionX < 54 && 39 < positionY && positionY < 50){
    const positionData = {
      event: "position_event",
      username: username,
      x: positionX,
      y: positionY,
      room_status: "entry"
    };  
    ws.send(JSON.stringify(positionData))
  }else{
    const positionData = {
      event: "position_event",
      username: username,
      x: positionX,
      y: positionY,
      room_status: "exit"
    };  
    ws.send(JSON.stringify(positionData))
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  //　tableのぶつかる処理判定
  if (key === 'ArrowUp') {
    if (positionY != 48 | (positionY == 48 & positionX < 47) | (positionY == 48 & positionX > 51)) {
      positionY -= 1;
    }
  } else if (key === 'ArrowDown') {
    if (positionY != 41 | (positionY == 41 & positionX < 47) | (positionY == 41 & positionX > 51)) {
      positionY += 1;
    }
  } else if (key === 'ArrowLeft') {
    if (positionX != 52 | (positionX == 52 & positionY < 42) | (positionX == 52 & positionY > 47)) {
      positionX -= 1;
    }
  } else if (key === 'ArrowRight') {
    if (positionX != 46 | (positionX == 46 & positionY < 42) | (positionX == 46 & positionY > 47)) {
      positionX += 1;
    }
  }

  console.log("X:", positionX, "Y:", positionY)
  requestAnimationFrame(moveMyBox);
});