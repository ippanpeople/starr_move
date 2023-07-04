// 设置方块的初始位置
let positionX = 0;
let positionY = 0;
let oX;
let oY;
let room_status = "exit";
let connection_status = "connected";

// user account
var username = prompt("usernameを入力：");

// チェック client_key がnullかどうか
if (username === null || username === "") {
  console.log("usernameがnull");
} else {
  const client_list = [];
  const client_num = client_list.length
  const init_instance = {
    event: "init_event",
    username: username,
    room_status: room_status,
    connection_status: connection_status
  };
  // websocket コネクション
  const ws = new WebSocket('ws://localhost:8181/ws/test')

  // Listen On WebSocket コネクション　Open
  ws.addEventListener('open', (event) => {
    console.log('>>>>>>WebSocket コネクション　Open<<<<<<');
    ws.send(JSON.stringify(init_instance));
  });

  // Listen On WebSocket Message Receive
  ws.addEventListener('message', (event) => {
    // 解析接收到的数据为JSON格式
    const receivedData = JSON.parse(event.data);
    const resp_event = receivedData['event']
    const receivedUserList = receivedData.user_list;
    const receivedUsername = receivedData.username;
    const receivedX = receivedData.x;
    const receivedY = receivedData.y;
    const receivedRoomStatus = receivedData.room_status;

    if (resp_event == "init_resp_event") {
      if (receivedUsername == username) {
        // receivedUserList の中にいるすべてのユーザを検索
        for (user in receivedUserList) {
          // 自分かどうかを確認
          if (receivedUserList[user]["username"] != username && receivedUserList[user]["connection_status"] == "connected") {
            console.log("================", receivedUserList[user]["x"])
            // 自分じゃなければ、他人のボロックを生成
            const newBox = document.createElement('div');
            const newBoxId = receivedUserList[user]['username'];
            newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
            newBox.classList.add('newBox');
            newBox.style.backgroundColor = 'black';
            newBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
            oX = receivedUserList[user]["x"]
            newBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
            oY = receivedUserList[user]["y"]
            // newBox.style.zIndex = receivedClientList.length * 10;
            newBox.style.zIndex = 10;
            /////////////////////////////////////////////////
            // 創建圖片元素
            const newImg = document.createElement('img');
            newImg.setAttribute('id', newBoxId + "img"); // 自分のブロックidを設置する
            newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
            newImg.style.width = '72px'; // 設置圖片寬度
            newImg.style.height = '72px'; // 設置圖片高度
            newImg.style.objectFit = 'cover'; // 確保圖片填滿容器

            newBox.appendChild(newImg); // 將圖片元素添加到方塊中
            /////////////////////////////////////////////////

            container.appendChild(newBox);
          } else if (receivedData['username'] == username && receivedUserList[user]["username"] == username) {
            const myBox = document.createElement('div');
            const myBoxId = username;
            myBox.setAttribute('id', myBoxId); // 自分のブロックidを設置する
            myBox.classList.add('myBox');
            myBox.style.backgroundColor = 'red';
            myBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
            positionX = receivedUserList[user]["x"]
            myBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
            positionY = receivedUserList[user]["y"]
            myBox.style.zIndex = 20;
            /////////////////////////////////////////////////
            // 創建圖片元素
            const myImg = document.createElement('img');
            myImg.setAttribute('id', myBoxId + "img"); // 自分のブロックidを設置する
            myImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
            myImg.style.width = '72px'; // 設置圖片寬度
            myImg.style.height = '72px'; // 設置圖片高度
            myImg.style.objectFit = 'cover'; // 確保圖片填滿容器

            myBox.appendChild(myImg); // 將圖片元素添加到方塊中
            /////////////////////////////////////////////////
            container.appendChild(myBox);
            console.log(receivedUserList);
          }
        }
      } else {
        // 自分じゃなければ、他人のボロックを生成
        const newBox = document.createElement('div');
        const newBoxId = receivedUsername;
        newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
        newBox.classList.add('newBox');
        newBox.style.backgroundColor = 'black';
        newBox.style.left = receivedX * 10 + 'px';
        newBox.style.top = receivedY * 10 + 'px';
        // newBox.style.zIndex = receivedClientList.length * 10;
        newBox.style.zIndex = 10;
        /////////////////////////////////////////////////
        // 創建圖片元素
        const newImg = document.createElement('img');
        newImg.setAttribute('id', myBoxId + "img"); // 自分のブロックidを設置する
        newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
        newImg.style.width = '72px'; // 設置圖片寬度
        newImg.style.height = '72px'; // 設置圖片高度
        newImg.style.objectFit = 'cover'; // 確保圖片填滿容器

        myBox.appendChild(newImg); // 將圖片元素添加到方塊中
        /////////////////////////////////////////////////

        container.appendChild(newBox);
        console.log(receivedUserList);
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
      console.log(receivedData.user_list)
      console.log(receivedData.user_list[index])
      const newBox = document.getElementById(receivedUsername);
      const newImg = document.getElementById(receivedUsername + "img");

      newBox.style.left = receivedData.user_list[index]["x"] * 10 + 'px';
      newBox.style.top = receivedData.user_list[index]["y"] * 10 + 'px';

      if (oX > receivedData.user_list[index]["x"]) {
        console.log("左")
        if ((receivedData.user_list[index]["x"] + 1) % 3 == 1) {
          newImg.src = '/public/img/ryou-10.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["x"] + 1) % 3 == 2) {
          newImg.src = '/public/img/ryou-11.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["x"] + 1) % 3 == 0) {
          newImg.src = '/public/img/ryou-12.png'; // 設置圖片路徑
        }
        oX = receivedData.user_list[index]["x"]
        oY = receivedData.user_list[index]["y"]
      } else if (oX < receivedData.user_list[index]["x"]) {
        console.log("右")
        if ((receivedData.user_list[index]["x"] + 1) % 3 == 1) {
          newImg.src = '/public/img/ryou-07.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["x"] + 1) % 3 == 2) {
          newImg.src = '/public/img/ryou-08.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["x"] + 1) % 3 == 0) {
          newImg.src = '/public/img/ryou-09.png'; // 設置圖片路徑
        }
        oX = receivedData.user_list[index]["x"]
        oY = receivedData.user_list[index]["y"]
      } else if (oY > receivedData.user_list[index]["y"]) {
        console.log("上")
        if ((receivedData.user_list[index]["y"] + 1) % 3 == 1) {
          newImg.src = '/public/img/ryou-04.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["y"] + 1) % 3 == 2) {
          newImg.src = '/public/img/ryou-05.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["y"] + 1) % 3 == 0) {
          newImg.src = '/public/img/ryou-06.png'; // 設置圖片路徑
        }

        oX = receivedData.user_list[index]["x"]
        oY = receivedData.user_list[index]["y"]
      } else if (oY < receivedData.user_list[index]["y"]) {
        console.log("下")
        if ((receivedData.user_list[index]["y"] + 1) % 3 == 1) {
          newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["y"] + 1) % 3 == 2) {
          newImg.src = '/public/img/ryou-02.png'; // 設置圖片路徑
        } else if ((receivedData.user_list[index]["y"] + 1) % 3 == 0) {
          newImg.src = '/public/img/ryou-03.png'; // 設置圖片路徑
        }

        oX = receivedData.user_list[index]["x"]
        oY = receivedData.user_list[index]["y"]
      }

    } else if (resp_event == "del_event") {
      console.log(receivedUsername, "=========================================")
      console.log(receivedData)
      var element = document.getElementById(receivedUsername);
      element.remove();
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
    if (44 < positionX && positionX < 54 && 39 < positionY && positionY < 50) {
      const positionData = {
        event: "position_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "entry",
        connection_status: connection_status
      };
      ws.send(JSON.stringify(positionData))
    } else {
      const positionData = {
        event: "position_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "exit",
        connection_status: connection_status
      };
      ws.send(JSON.stringify(positionData))
    }
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    const myImg = document.getElementById(username + "img");
    //　tableのぶつかる処理判定
    if (key === 'ArrowUp') {
      if (positionY != 48 | (positionY == 48 & positionX < 47) | (positionY == 48 & positionX > 51)) {
        if ((positionY + 1) % 3 == 1) {
          myImg.src = '/public/img/ryou-04.png'; // 設置圖片路徑
        } else if ((positionY + 1) % 3 == 2) {
          myImg.src = '/public/img/ryou-05.png'; // 設置圖片路徑
        } else if ((positionY + 1) % 3 == 0) {
          myImg.src = '/public/img/ryou-06.png'; // 設置圖片路徑
        }
        positionY -= 1;
      }
    } else if (key === 'ArrowDown') {
      if (positionY != 41 | (positionY == 41 & positionX < 47) | (positionY == 41 & positionX > 51)) {
        if ((positionY + 1) % 3 == 1) {
          myImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
        } else if ((positionY + 1) % 3 == 2) {
          myImg.src = '/public/img/ryou-02.png'; // 設置圖片路徑
        } else if ((positionY + 1) % 3 == 0) {
          myImg.src = '/public/img/ryou-03.png'; // 設置圖片路徑
        }
        positionY += 1;
      }
    } else if (key === 'ArrowLeft') {
      if (positionX != 52 | (positionX == 52 & positionY < 42) | (positionX == 52 & positionY > 47)) {
        if ((positionX + 1) % 3 == 1) {
          myImg.src = '/public/img/ryou-10.png'; // 設置圖片路徑
        } else if ((positionX + 1) % 3 == 2) {
          myImg.src = '/public/img/ryou-11.png'; // 設置圖片路徑
        } else if ((positionX + 1) % 3 == 0) {
          myImg.src = '/public/img/ryou-12.png'; // 設置圖片路徑
        }
        positionX -= 1;
      }
    } else if (key === 'ArrowRight') {
      if (positionX != 46 | (positionX == 46 & positionY < 42) | (positionX == 46 & positionY > 47)) {
        if ((positionX + 1) % 3 == 1) {
          myImg.src = '/public/img/ryou-07.png'; // 設置圖片路徑
        } else if ((positionX + 1) % 3 == 2) {
          myImg.src = '/public/img/ryou-08.png'; // 設置圖片路徑
        } else if ((positionX + 1) % 3 == 0) {
          myImg.src = '/public/img/ryou-09.png'; // 設置圖片路徑
        }
        positionX += 1;
      }
    }

    console.log("X:", positionX, "Y:", positionY)
    requestAnimationFrame(moveMyBox);
  });
}
