// 设置方块的初始位置
let positionX = 21;
let positionY = 25;

//////////////////アニメーション用//////////////////
let oX;
let oY;
let oKey = "";
//////////////////アニメーション用//////////////////
let room_status = "exit";
let connection_status = "connected";
let key_status = "up";

// user account
var username;
// 获取当前页面的 URL
var url = new URL(window.location.href);
// 获取参数部分
var searchParams = new URLSearchParams(url.search);

var username_check = searchParams.get("username");
if(username_check == null || username_check == ""){
  username = prompt("usernameを入力：");
}else{
  username = username_check;
}

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
    connection_status: connection_status,
    key_status: key_status,
    o_key: oKey
  };
  // websocket コネクション
  const ws = new WebSocket('wss://starr_move.rinlink.jp/ws/test')
  //const ws = new WebSocket('ws://localhost:8181/ws/test')

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
      console.log(receivedUsername)

      if (receivedUsername == username) {
        // receivedUserList の中にいるすべてのユーザを検索
        for (user in receivedUserList) {
          // 自分かどうかを確認
          if (receivedUserList[user]["username"] != username & receivedUserList[user]["connection_status"] == "connected") {
            console.log("================", receivedUserList[user]["x"])
            // 自分じゃなければ、他人のボロックを生成
            const newBox = document.createElement('div');
            const newBoxId = receivedUserList[user]['username'];
            newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
            newBox.classList.add('newBox');
            newBox.style.backgroundColor = 'black';
            newBox.style.left = receivedUserList[user]["x"] * 24 + 'px';
            oX = receivedUserList[user]["x"]
            newBox.style.top = receivedUserList[user]["y"] * 24 + 'px';
            oY = receivedUserList[user]["y"]
            // newBox.style.zIndex = receivedClientList.length * 24;
            newBox.style.zIndex = 10;

            //////////////////アニメーション用//////////////////
            // 創建圖片元素
            const newImg = document.createElement('img');
            newImg.setAttribute('id', newBoxId + "img"); // 自分のブロックidを設置する
            newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
            newImg.style.width = '72px'; // 設置圖片寬度
            newImg.style.height = '72px'; // 設置圖片高度
            newImg.style.objectFit = 'cover'; // 確保圖片填滿容器

            newBox.appendChild(newImg); // 將圖片元素添加到方塊中
            //////////////////アニメーション用//////////////////

            container.appendChild(newBox);
          } else if (receivedData['username'] == username & receivedUserList[user]["username"] == username) {
            const myBox = document.createElement('div');
            const myBoxId = username;
            myBox.setAttribute('id', myBoxId); // 自分のブロックidを設置する
            myBox.classList.add('myBox');
            myBox.style.backgroundColor = 'green';
            myBox.style.left = receivedUserList[user]["x"] * 24 + 'px';
            positionX = receivedUserList[user]["x"]
            myBox.style.top = receivedUserList[user]["y"] * 24 + 'px';
            positionY = receivedUserList[user]["y"]
            myBox.style.zIndex = 20;

            //////////////////アニメーション用//////////////////
            // 創建圖片元素
            const myImg = document.createElement('img');
            myImg.setAttribute('id', myBoxId + "img"); // 自分のブロックidを設置する
            myImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
            myImg.style.width = '72px'; // 設置圖片寬度
            myImg.style.height = '72px'; // 設置圖片高度
            myImg.style.objectFit = 'cover'; // 確保圖片填滿容器

            myBox.appendChild(myImg); // 將圖片元素添加到方塊中
            //////////////////アニメーション用//////////////////

            container.appendChild(myBox);
            console.log(receivedUserList);
          }
        }
      } else {
        let index = 0
        for (const i of receivedUserList) {
          if (receivedUserList[i] == receivedUsername) {
            index = i
          }
        }
        // 自分じゃなければ、他人のボロックを生成
        console.log("ここここおココおこオコオコ大おここっっっこおここk")
        const newBox = document.createElement('div');
        const newBoxId = receivedUsername;
        newBox.setAttribute('id', newBoxId); // 自分のブロックidを設置する
        newBox.classList.add('newBox');
        newBox.style.backgroundColor = 'black';
        newBox.style.left = receivedX * 24 + 'px';
        oX = receivedUserList[index]["x"]
        newBox.style.top = receivedY * 24 + 'px';
        oY = receivedUserList[index]["y"]
        // newBox.style.zIndex = receivedClientList.length * 24;
        newBox.style.zIndex = 10;

        //////////////////アニメーション用//////////////////
        // 創建圖片元素
        const newImg = document.createElement('img');
        newImg.setAttribute('id', newBoxId + "img"); // 自分のブロックidを設置する
        newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
        newImg.style.width = '72px'; // 設置圖片寬度
        newImg.style.height = '72px'; // 設置圖片高度
        newImg.style.objectFit = 'cover'; // 確保圖片填滿容器

        newBox.appendChild(newImg); // 將圖片元素添加到方塊中
        //////////////////アニメーション用//////////////////

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
      console.log(receivedData.user_list)
      console.log(receivedData.user_list[index])
      if (receivedUsername != username) {
        const newBox = document.getElementById(receivedUsername);

        newBox.style.left = receivedData.user_list[index]["x"] * 24 + 'px';
        newBox.style.top = receivedData.user_list[index]["y"] * 24 + 'px';
        //////////////////アニメーション用//////////////////
        const newImg = document.getElementById(receivedUsername + "img");
        if (receivedData.user_list[index]["key_status"] == "down") {
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
        } else {
          if (receivedData.user_list[index]["o_key"] == 'ArrowUp') {
            newImg.src = '/public/img/ryou-04.png'; // 設置圖片路徑
          } else if (receivedData.user_list[index]["o_key"] == 'ArrowDown') {
            newImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
          } else if (receivedData.user_list[index]["o_key"] == 'ArrowLeft') {
            newImg.src = '/public/img/ryou-10.png'; // 設置圖片路徑
          } else if (receivedData.user_list[index]["o_key"] == 'ArrowRight') {
            newImg.src = '/public/img/ryou-07.png'; // 設置圖片路徑
          }
        }
        //////////////////アニメーション用//////////////////  
      }
    } else if (resp_event == "del_event") {
      console.log(receivedUsername, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
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
    myBox.style.left = positionX * 24 + 'px';
    myBox.style.top = positionY * 24 + 'px';

    //　table_areaのぶつかる処理判定
    if (44 < positionX && positionX < 54 && 39 < positionY && positionY < 50) {
      const positionData = {
        event: "position_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "entry",
        connection_status: connection_status,
        key_status: key_status,
        o_key: oKey
      };
      ws.send(JSON.stringify(positionData))
    } else {
      const positionData = {
        event: "position_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "exit",
        connection_status: connection_status,
        key_status: key_status,
        o_key: oKey
      };
      ws.send(JSON.stringify(positionData))
    }
  }
  document.addEventListener('keyup', (event) => {
    //////////////////アニメーション用//////////////////
    const myImg = document.getElementById(username + "img");
    //////////////////アニメーション用//////////////////
    key_status = 'up';
    const positionData = {
      event: "position_event",
      username: username,
      x: positionX,
      y: positionY,
      room_status: "entry",
      connection_status: connection_status,
      key_status: key_status,
      o_key: oKey
    };
    ws.send(JSON.stringify(positionData))

    if (oKey === 'ArrowUp') {
      myImg.src = '/public/img/ryou-04.png'; // 設置圖片路徑
    } else if (oKey === 'ArrowDown') {
      myImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
    } else if (oKey === 'ArrowLeft') {
      myImg.src = '/public/img/ryou-10.png'; // 設置圖片路徑
    } else if (oKey === 'ArrowRight') {
      myImg.src = '/public/img/ryou-07.png'; // 設置圖片路徑
    }

  })
  document.addEventListener('keydown', (event) => {
    const key = event.key;
    //////////////////アニメーション用//////////////////
    const myImg = document.getElementById(username + "img");
    //////////////////アニメーション用//////////////////
    key_status = 'down';
    playAudio();
    if (positionX >= 28 && positionX <= 32 && positionY >= 19 && positionY <= 21) {
      room.style.opacity = 1;
    } else {
      room.style.opacity = 0;
    }
    if (positionX >= 3 && positionX <= 5 && positionY >= 4 && positionY <= 6) {
      bar.style.opacity = 1;
    } else {
      bar.style.opacity = 0;
    }

    //　ぶつかる処理判定
    if (key === 'ArrowUp') {

      //////////////////アニメーション用//////////////////
      if ((positionY + 1) % 3 == 1) {
        myImg.src = '/public/img/ryou-04.png'; // 設置圖片路徑
      } else if ((positionY + 1) % 3 == 2) {
        myImg.src = '/public/img/ryou-05.png'; // 設置圖片路徑
      } else if ((positionY + 1) % 3 == 0) {
        myImg.src = '/public/img/ryou-06.png'; // 設置圖片路徑
      }
      //////////////////アニメーション用//////////////////
      if(positionX == 3 && positionY == 4){
        var url = "https://starr_move_bar.rinlink.jp?username=" + encodeURIComponent(username);
        window.location.href = url;
        console.log("sdfghjkliuhygfvbnmjkhgfcvbnmkjhgabwnjkesfkjbksnldfbjknaslkfbkawnlfnnslfl")
      }else if(positionX == 30 && positionY == 19){
        var url = "https://starr_move_room.rinlink.jp?username=" + encodeURIComponent(username);
        window.location.href = url;
        console.log("sdfghjkliuhygfvbnmjkhgfcvbnmkjhgabwnjkesfkjbksnldfbjknaslkfbkawnlfnnslfl")
      }

      if (
        (positionX >= 3 && positionX <= 5 && positionY >= 5 && positionY <= 23) ||
        (positionX >= 6 && positionX <= 7 && positionY >= 8 && positionY <= 12) || (positionX >= 6 && positionX <= 7 && positionY >= 17 && positionY <= 18) || (positionX >= 6 && positionX <= 7 && positionY >= 15 && positionY == 23) ||
        (positionX == 8 && positionY >= 5 && positionY <= 12) || (positionX == 8 && positionY >= 17 && positionY <= 18) || (positionX == 8 && positionY == 23) ||
        (positionX >= 9 && positionX <= 10 && positionY >= 5 && positionY <= 18) || (positionX >= 9 && positionX <= 10 && positionY == 23) ||
        (positionX >= 11 && positionX <= 13 && positionY >= 5 && positionY <= 17) || (positionX >= 11 && positionX <= 13 && positionY == 23) ||
        (positionX >= 14 && positionX <= 16 && positionY >= 5 && positionY <= 18) || (positionX >= 14 && positionX <= 16 && positionY == 23) ||
        (positionX == 17 && positionY >= 5 && positionY <= 23) ||
        (positionX >= 18 && positionX <= 19 && positionY >= 5 && positionY <= 25) ||
        (positionX >= 20 && positionX <= 24 && positionY >= 5 && positionY <= 14) || (positionX >= 20 && positionX <= 24 && positionY >= 20 && positionY <= 25) ||
        (positionX == 25 && positionY >= 5 && positionY <= 14) || (positionX == 25 && positionY >= 20 && positionY <= 23) ||
        (positionX >= 26 && positionX <= 30 && positionY >= 5 && positionY <= 9) || (positionX >= 26 && positionX <= 30 && positionY >= 20 && positionY <= 23) ||
        (positionX >= 31 && positionX <= 35 && positionY == 8) || (positionX >= 31 && positionX <= 35 && positionY >= 20 && positionY <= 23) ||
        (positionX >= 36 && positionX <= 40 && positionY >= 5 && positionY <= 9) || (positionX >= 36 && positionX <= 40 && positionY >= 20 && positionY <= 23)
      ) {
        positionY -= 1;
      } else {
        positionY -= 0;
      }

      oKey = 'ArrowUp';
    } else if (key === 'ArrowDown') {
      //////////////////アニメーション用//////////////////
      if ((positionY + 1) % 3 == 1) {
        myImg.src = '/public/img/ryou-01.png'; // 設置圖片路徑
      } else if ((positionY + 1) % 3 == 2) {
        myImg.src = '/public/img/ryou-02.png'; // 設置圖片路徑
      } else if ((positionY + 1) % 3 == 0) {
        myImg.src = '/public/img/ryou-03.png'; // 設置圖片路徑
      }
      //////////////////アニメーション用//////////////////

      if (
        (positionX >= 3 && positionX <= 5 && positionY >= 4 && positionY <= 22) ||
        (positionX >= 6 && positionX <= 7 && positionY >= 6 && positionY <= 11) || (positionX >= 6 && positionX <= 7 && positionY >= 15 && positionY <= 17) || (positionX >= 6 && positionX <= 7 && positionY >= 15 && positionY == 22) ||
        (positionX == 8 && positionY >= 4 && positionY <= 11) || (positionX == 8 && positionY >= 15 && positionY <= 17) || (positionX == 8 && positionY == 22) ||
        (positionX >= 9 && positionX <= 10 && positionY >= 4 && positionY <= 17) || (positionX >= 9 && positionX <= 10 && positionY == 22) ||
        (positionX >= 11 && positionX <= 13 && positionY >= 4 && positionY <= 16) || (positionX >= 11 && positionX <= 13 && positionY == 22) ||
        (positionX >= 14 && positionX <= 16 && positionY >= 4 && positionY <= 17) || (positionX >= 14 && positionX <= 16 && positionY == 22) ||
        (positionX == 17 && positionY >= 4 && positionY <= 22) ||
        (positionX >= 18 && positionX <= 19 && positionY >= 4 && positionY <= 24) ||
        (positionX >= 20 && positionX <= 24 && positionY >= 4 && positionY <= 13) || (positionX >= 20 && positionX <= 24 && positionY >= 19 && positionY <= 24) ||
        (positionX == 25 && positionY >= 4 && positionY <= 13) || (positionX == 25 && positionY >= 19 && positionY <= 22) ||
        (positionX >= 26 && positionX <= 30 && positionY >= 4 && positionY <= 8) || (positionX >= 26 && positionX <= 30 && positionY >= 19 && positionY <= 22) ||
        (positionX >= 31 && positionX <= 35 && positionY == 7) || (positionX >= 31 && positionX <= 35 && positionY >= 19 && positionY <= 22) ||
        (positionX >= 36 && positionX <= 40 && positionY >= 4 && positionY <= 8) || (positionX >= 36 && positionX <= 40 && positionY >= 19 && positionY <= 22)
      ) {
        positionY += 1;
      } else {
        positionY += 0;
      }

      oKey = 'ArrowDown';
    } else if (key === 'ArrowLeft') {
      //////////////////アニメーション用//////////////////
      if ((positionX + 1) % 3 == 1) {
        myImg.src = '/public/img/ryou-10.png'; // 設置圖片路徑
      } else if ((positionX + 1) % 3 == 2) {
        myImg.src = '/public/img/ryou-11.png'; // 設置圖片路徑
      } else if ((positionX + 1) % 3 == 0) {
        myImg.src = '/public/img/ryou-12.png'; // 設置圖片路徑
      }
      //////////////////アニメーション用//////////////////

      if (
        (positionY == 4 && positionX >= 4 && positionX <= 30) || (positionY == 4 && positionX >= 37 && positionX <= 40) ||
        (positionY >= 5 && positionY <= 6 && positionX >= 4 && positionX <= 5) || (positionY >= 5 && positionY <= 6 && positionX >= 9 && positionX <= 30) || (positionY >= 5 && positionY <= 6 && positionX >= 37 && positionX <= 40) ||
        (positionY >= 7 && positionY <= 8 && positionX >= 4 && positionX <= 40) ||
        (positionY == 9 && positionX >= 4 && positionX <= 30) || (positionY == 9 && positionX >= 37 && positionX <= 40) ||
        (positionY >= 10 && positionY <= 12 && positionX >= 4 && positionX <= 25) ||
        (positionY >= 12 && positionY <= 14 && positionX >= 4 && positionX <= 5) || (positionY >= 12 && positionY <= 14 && positionX >= 10 && positionX <= 25) ||
        (positionY >= 15 && positionY <= 17 && positionX >= 4 && positionX <= 19) ||
        (positionY == 18 && positionX >= 5 && positionX <= 10) || (positionY == 18 && positionX >= 15 && positionX <= 19) ||
        (positionY >= 19 && positionY <= 21 && positionX >= 4 && positionX <= 5) || (positionY >= 19 && positionY <= 21 && positionX >= 18 && positionX <= 40) ||
        (positionY >= 22 && positionY <= 23 && positionX >= 4 && positionX <= 40) ||
        (positionY >= 24 && positionY <= 25 && positionX >= 19 && positionX <= 24)
      ) {
        positionX -= 1;
      }
      oKey = 'ArrowLeft';
    } else if (key === 'ArrowRight') {
      //////////////////アニメーション用//////////////////
      if ((positionX + 1) % 3 == 1) {
        myImg.src = '/public/img/ryou-07.png'; // 設置圖片路徑
      } else if ((positionX + 1) % 3 == 2) {
        myImg.src = '/public/img/ryou-08.png'; // 設置圖片路徑
      } else if ((positionX + 1) % 3 == 0) {
        myImg.src = '/public/img/ryou-09.png'; // 設置圖片路徑
      }
      //////////////////アニメーション用//////////////////

      if (
        (positionY == 4 && positionX >= 3 && positionX <= 29) || (positionY == 4 && positionX >= 36 && positionX <= 39) ||
        (positionY >= 5 && positionY <= 6 && positionX >= 3 && positionX <= 4) || (positionY >= 5 && positionY <= 6 && positionX >= 8 && positionX <= 29) || (positionY >= 5 && positionY <= 6 && positionX >= 36 && positionX <= 39) ||
        (positionY >= 7 && positionY <= 8 && positionX >= 3 && positionX <= 39) ||
        (positionY == 9 && positionX >= 3 && positionX <= 29) || (positionY == 9 && positionX >= 36 && positionX <= 39) ||
        (positionY >= 10 && positionY <= 12 && positionX >= 3 && positionX <= 24) ||
        (positionY >= 12 && positionY <= 14 && positionX >= 3 && positionX <= 4) || (positionY >= 12 && positionY <= 14 && positionX >= 9 && positionX <= 24) ||
        (positionY >= 15 && positionY <= 17 && positionX >= 3 && positionX <= 18) ||
        (positionY == 18 && positionX >= 3 && positionX <= 9) || (positionY == 18 && positionX >= 14 && positionX <= 18) ||
        (positionY >= 19 && positionY <= 21 && positionX >= 3 && positionX <= 4) || (positionY >= 19 && positionY <= 21 && positionX >= 17 && positionX <= 39) ||
        (positionY >= 22 && positionY <= 23 && positionX >= 3 && positionX <= 39) ||
        (positionY >= 24 && positionY <= 25 && positionX >= 18 && positionX <= 23)
      ) {
        positionX += 1;
      }
      oKey = 'ArrowRight';
    }

    console.log("X:", positionX, "Y:", positionY)
    requestAnimationFrame(moveMyBox);
  });
}

function playAudio() {
  const audio = document.createElement("audio");
  audio.src = "/public/audio/walking.mp3";
  audio.play();
}