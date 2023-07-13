// 设置方块的初始位置
let positionX = 21;
let positionY = 25;

///追加webrtc(木村)
let vChatUser = []
let webRTCId = ""
let webRTCRoomname = ""
let preVChatUser = []
let webRTCUser_list = null
chatUsers = null


//////////////////アニメーション用//////////////////
let oX;
let oY;
let oKey = "";
//////////////////アニメーション用//////////////////
let room_status = "exit";
let connection_status = "connected";
let key_status = "up";

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
    connection_status: connection_status,
    key_status: key_status,
    o_key: oKey
  };
  // websocket コネクション
  // const ws = new WebSocket('wss://starr_move.rinlink.jp/ws/test')
  //const ws = new WebSocket('ws://localhost:8181/ws/test')
  //追加木村
  const ws = new WebSocket('ws://localhost:8282/ws/test')

  //追加videoMutebutton
  const videoMuteButton = document.getElementById("videoMuteButton")
  const audioMuteButton = document.getElementById("audioMuteButton")

  


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
    webRTCUser_list = receivedUserList
    const receivedUsername = receivedData.username;
    const receivedX = receivedData.x;
    const receivedY = receivedData.y;
    const receivedRoomStatus = receivedData.room_status;
    //追加
    const receivedRoomname = receivedData.room_name
    const receivedWebRTCId = receivedData.webRTCId
    const receivedWebRTCMute = receivedData.webRTCMute
    //追加チャット
    const receivedChatText = receivedData.chatText
    console.log(receivedWebRTCMute)


    console.log(receivedData)

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
            //追加webrtc
            // newImg.src = '/img/ryou-01.png'; // 設置圖片路徑
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
            //追加webRTC
            console.log(receivedRoomname)
            webRTCRoomname = receivedRoomname


            //////////////////アニメーション用//////////////////
            // 創建圖片元素
            const myImg = document.createElement('img');
            myImg.setAttribute('id', myBoxId + "img"); // 自分のブロックidを設置する
            //追加
            // myImg.src = '/img/ryou-01.png'; // 設置圖片路徑
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

      //////////////////追加webrtc(木村)
      vChatUser = []


      for (let i = 0; i < receivedData.user_list.length; i++) {
        const userDict = receivedData.user_list[i];
        if (userDict.username === targetUsername) {
          index = i;
          //////追加webrtc(木村)
          // break;
        }
        /////////////////////追加webrtc(木村)
        if(userDict.connection_status ==  "connected"){
          if(webRTCRoomname == "lobby"){
          // room1
            if(positionX <= 25 && positionY<= 14 &&positionX >= 5 && positionY >= 4){
              if(userDict.x <= 25 && userDict.y <= 14 &&userDict.x >= 5 && userDict.y >= 4){
                console.log("userdict")

                console.log(userDict.username)
                console.log(userDict)
                if(userDict.username != username){
                  vChatUser.push(userDict.webRTCId)
                }
              }
              // room2
            }else if(positionX <= 40 && positionY >= 4 && positionX >= 27 && positionY <= 9){
              if(userDict.x <= 40 && userDict.y >= 4 && userDict.x >= 27 && userDict.y <= 9){
                  console.log("room2")
  
                  console.log(userDict.username)
                  console.log(userDict)
                if(userDict.username != username){
                    vChatUser.push(userDict.webRTCId)
                  }
              }
            }
          }
        }else if (webRTCRoomname == "bar"){
            if(positionX <= 40 && positionY<= 24 &&positionX >= 30 && positionY >= 10){
              if(userDict.x <= 40 && userDict.y <= 24 &&userDict.x >= 30 && userDict.y >= 10){
                console.log("userdict")

                console.log(userDict.username)
                console.log(userDict)
                if(userDict.username != username){
                  vChatUser.push(userDict.webRTCId)
                }
              }
          }else if(positionX <= 30 && positionY<= 5 &&positionX >= 40  && positionY >= 5){
            if(userDict.x <= 40 && userDict.y <= 24 &&userDict.x >= 30 && userDict.y >= 10){
              console.log("userdict")

              console.log(userDict.username)
              console.log(userDict)
              if(userDict.username != username){
                vChatUser.push(userDict.webRTCId)
            }
          }else if (positionX <= 22 && positionY<=  9 &&positionX >= 3  && positionY >= 5){
            if(userDict.x <= 40 && userDict.y <= 24 &&userDict.x >= 30 && userDict.y >= 10){
              console.log("userdict")

              console.log(userDict.username)
              console.log(userDict)
              if(userDict.username != username){
                vChatUser.push(userDict.webRTCId)
              }
            }
          }
          /////////////////////
        }
      }
    }

      ///////////////////////追加webrtc(木村)////////////////////
      const remoteMediaArea = document.getElementById('remote-media-area');
      const media = remoteMediaArea.querySelectorAll("video")


      let deleteVchatUser = preVChatUser.filter(u => !vChatUser.includes(u));
      let createVChatUser =  vChatUser.filter(u => !preVChatUser.includes(u));
      console.log("preVChatUser")
      console.log(preVChatUser)
      console.log("createVChatUser")
      console.log(createVChatUser)
      console.log("deleteVchatUser")
      console.log(deleteVchatUser)
      console.log("vChatUser")
      console.log(vChatUser)
      preVChatUser = vChatUser

      vChatUser = []


      if(webRTCRoomname == "lobby"){
        console.log(vChatUser)
        createVChatUser.forEach(
          delMediaId => {
            const vtag = document.querySelectorAll("#remote-media-area video[id='" + delMediaId + 'video' + "']");
            // const dtag = document.querySelectorAll("#remote-media-area dev[id='" + delMediaId + "']");
            const dtag = document.getElementById(delMediaId)
            console.log("fiewajifjewaijfoewajfoiawejfoawejfioweajoifjwaeoifjaewoijio")
            console.log(dtag)


            const nametag = document.querySelectorAll("#remote-media-area h1[id='" + delMediaId + 'nametag' +  "']");
            // const nametag = document.getElementById(delMediaId + "nametag")

            nametag.forEach(
              namet => {
                namet.hidden = false
            })

            // dtag.forEach(
            //   dev => {
                dtag.style.height = "114.5px"
                dtag.style.width = "152px"
            //   }
            // )

            vtag.forEach(video => {
              // video.style.display = "none";
              video.hidden = false
            
            });

            // オーディオ要素を非表示にする
            const atag = document.querySelector("#remote-media-area audio[id='" + delMediaId + 'audio' + "']");
            if(atag != null){
              console.log("atag")

              console.log(atag)
              atag.volume = 1

            }

          }
        )


        deleteVchatUser.forEach(
          delMediaId => {
            console
            const vtag = document.querySelectorAll("#remote-media-area video[id='" + delMediaId + 'video' + "']");
            // const dtag = document.querySelectorAll("#remote-media-area dev[id='" + delMediaId + "']");
            const dtag = document.getElementById(delMediaId)
            const nametag = document.querySelectorAll("#remote-media-area h1[id='" + delMediaId + 'nametag' +  "']");

            nametag.forEach(
              namet => {
                namet.hidden = true
            })

            
            // dtag.forEach(
            //   dev => {
                dtag.style.height = "0px"
                dtag.style.width = "0px"
            //   }
            // )
            vtag.forEach(video => {
              // video.style.display = "none";
              video.hidden = true
            });

            // オーディオの音消す
            const atag = document.querySelector("#remote-media-area audio[id='" + delMediaId + 'audio' + "']");
            console.log(atag)

            atag.volume = 0
          }
        )
      }



      //////////////////////////////

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
      var videoElement = document.getElementById(receivedWebRTCId + "video");
      console.log(videoElement)
      element.remove();
      videoElement.hidden = true
      ///////////////////////////////追加/////////////////////////////
    }else if (resp_event == "mute_resp_event"){
      if(receivedWebRTCId != webRTCId){
        console.log("webrtcMUte")
        console.log(receivedWebRTCMute)
        if(receivedWebRTCMute){
          videotag = document.getElementById(receivedWebRTCId+"video")
          videotag.style.opacity = 0
        }else{
          videotag = document.getElementById(receivedWebRTCId+"video")
          videotag.style.opacity = 1
        }
      }
    }else if (resp_event == "chat_resp_event"){
      console.log("jfiewajfijwaeofjeaw;ojfiejwaiwfjewiajfiajewifjaweo;fweaj;fjeawifjewaifjewaifoweaj;fjeiwa")
      if(receivedUsername != username){
        const div_chat = document.getElementById("chat-log-area")
        const div_user = document.createElement("div")
        div_user.classList = "username"

        const chatLogArea = document.getElementById("chat-log-area");
        const divUsername = document.createElement("div")
        
        divUsername.textContent = receivedUsername
        const divChatText = document.createElement("div")
        divChatText.textContent = receivedChatText

        chatLogArea.appendChild(divUsername)
        chatLogArea.appendChild(divChatText)

        console.log(chatLogArea)
        

      }
   
    }
    /////////////////////////////////////////////////////
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
        webRTCId:webRTCId,

        o_key: oKey
      };
      console.log(positionData)

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
        webRTCId:webRTCId,
        o_key: oKey
      };
      console.log(positionData)
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
      webRTCId:webRTCId,

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

  //追加webrtc
  videoMuteButton.addEventListener('click',() => {
    console.log(videoPublication)
      const positionData = {
        event: "mute_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "entry",
        connection_status: connection_status,
        key_status: key_status,
        webRTCId:webRTCId,
        webRTCMute:videoMute,
        o_key: oKey
      };
      videoMute = !videoMute
      console.log(positionData)
      ws.send(JSON.stringify(positionData))
      console.log(audioPublication)
      if(videoMute){
        videoMuteButton.style.backgroundImage = 'url(public/img/camera.png)';
      }else {
        videoMuteButton.style.backgroundImage = 'url(public/img/cameramute.png)';
      }

  })
  //追加チャット
  const chatSendButton = document.getElementById("send_button")
  chatSendButton.addEventListener('click',() => {
    console.log("chat")

    chatUser = "macross"

    let text = document.getElementById("send_message").value
    console.log(text)
    document.getElementById("send_message").value = ""
      const positionData = {
        event: "chat_event",
        username: username,
        x: positionX,
        y: positionY,
        room_status: "entry",
        connection_status: connection_status,
        key_status: key_status,
        webRTCId:webRTCId,
        chatText: text,
        chatUsers: chatUsers,
        webRTCMute:videoMute,
        o_key: oKey
      };
      videoMute = !videoMute
      console.log(positionData)
      ws.send(JSON.stringify(positionData))
      const chatLogArea = document.getElementById("chat-log-area");
      const divUsername = document.createElement("div")

      divUsername.textContent = username
      const divChatText = document.createElement("div")
      divChatText.textContent = text

      chatLogArea.appendChild(divUsername)
      chatLogArea.appendChild(divChatText)


      console.log(chatLogArea)
  })


}

function playAudio() {
  const audio = document.createElement("audio");
  ////追加
  // audio.src = "/audio/walking.mp3";
  audio.src = "/public/audio/walking.mp3";

  audio.play();
}

let videoPublication = null 
let audioPublication = null 


let videoMute = true
let audioMute = true

let localStream = null

const chatUserSearch = document.getElementById("chat-user-search")
// chatUserSearch.addEventListener('click',() => {
//   let window = document.getElementById("search-window")
// })

audioMuteButton.addEventListener('click',() => {

  if(audioMute){
    console.log("audio解除")
    audioMute = false
    audioPublication.disable()
    audioMuteButton.style.backgroundImage = 'url(public/img/micmute.png)';

  }else{
    console.log("audio接続")
    audioMute = true
    audioPublication.enable()
    audioMuteButton.style.backgroundImage = 'url(public/img/mic.png)';
  }
})
//追加チャット


// カメラ映像取得
// navigator.mediaDevices.getUserMedia({video: true, audio: true})
//   .then( stream => {
//   // 成功時にvideo要素にカメラ映像をセットし、再生
//   const videoElm = document.getElementById('my-video')
//   videoElm.srcObject = stream;
//   videoElm.play();
//   // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
//   localStream = stream;
// }).catch( error => {
//   // 失敗時にはエラーログを出力
//   console.error('mediaDevice.getUserMedia() error:', error);
//   return;
// });


/////////////////////////////////////////// webrtc //////////////////////////////////////////////////

const { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, SkyWayStreamFactory, uuidV4 } = skyway_room;


const token = new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: '9ec557a0-588e-4f96-8bc6-f4cb48a7348b',
        turn: true,
        actions: ['read'],
        channels: [
          {
            id: '*',
            name: '*',
            actions: ['write'],
            members: [
              {
                id: '*',
                name: '*',
                actions: ['write'],
                publication: {
                  actions: ['write'],
                },
                subscription: {
                  actions: ['write'],
                },
              },
            ],
            sfuBots: [
              {
                actions: ['write'],
                forwardings: [
                  {
                    actions: ['write'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }).encode('21ANxJMdd+ERCqU/K7UO5UHQtkWOlVcvy2oHmwsueZM=');
  (async () => {
    console.log("async")
    const localVideo = document.getElementById('local-video');
    console.log(localVideo)
    const buttonArea = document.getElementById('button-area');
    const remoteMediaArea = document.getElementById('remote-media-area');
    const roomNameInput = document.getElementById('room-name');
    
    const myId = document.getElementById('my-id');
    const joinButton = document.getElementById('join');
    
    const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();

    console.log(video)
    video.attach(localVideo);
    localStream = video

    await localVideo.play();

    (async () => {
        // roomName = Math.random().toString(32).substring(2)
        // roomName = "aa"
        
        roomName = webRTCRoomname
        console.log(roomName)


        if (roomName === '' || roomName === null) return false;

        let context = await SkyWayContext.Create(token);
        console.log("aaaa")

        let room = await SkyWayRoom.FindOrCreate(context, {
            type: 'sfu',
            name: roomName,
        });

        const me = await room.join();


        myId.textContent = me.id;

        webRTCId =  me.id

        audioPublication = await me.publish(audio);
        videoPublication = await me.publish(video);

        let subscribeAndAttach  = null
        if (webRTCRoomname == "lobby"){
          subscribeAndAttach = (publication) => {
              if (publication.publisher.id === me.id) return;

              // const subscribeButton = document.createElement('button');
              // subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
              // buttonArea.appendChild(subscribeButton);

              (async () => {
                  const { stream } = await me.subscribe(publication.id);

                  let newMedia;
                  console.log("stream.track.kind")
                  console.log(stream.track.kind)

                  switch (stream.track.kind) {
                  case 'video':
                      wapper_dev = document.createElement('div');
                      wapper_dev.classList.add("video_wrapper")
                      wapper_dev.style.backgroundColor = "black"
                      // wapper_dev.style.height = "114.5px"
                      // wapper_dev.style.width = "152px"
                      // wapper_dev.style.float = "left"

                      // wapper_dev.style.display = "inline-block"
                      // wapper_dev.style.border =" solid 1px #1E223B"
                      wapper_dev.style.borderRadius = "10px 10px 10px 10px"
                      // wapper_dev.style.marginLeft = "10px"
                      wapper_dev.id = publication.publisher.id
                      // wapper_dev.style.height = "0px"
                      // wapper_dev.style.position = "relative"
    
                      wapper_dev.style.width = "0px"
                      // wapper_dev.hidden = true

                      nametag = document.createElement('h1')
                      nametag.style.position = "relative"
                      nametag.style.top = "100px"
                      // nametag.style.display = "block"
                      nametag.hidden = true
                      nametag.id = publication.publisher.id + "nametag"

                      
                    
                      newMedia = document.createElement('video');
                      newMedia.playsInline = true;
                      newMedia.autoplay = true;
                      newMedia.hidden = true
                      newMedia.width = 150
                      newMedia.style.float = "left"
                      newMedia.style.border =" solid 1px #1E223B"
                      newMedia.style.borderRadius = "10px 10px 10px 10px"
                      newMedia.id = publication.publisher.id + "video"
                      newMedia.style.background = "black"
                      wapper_dev.appendChild(newMedia)
                      remoteMediaArea.appendChild(wapper_dev);

                      webRTCUser_list.forEach(u => {
                        if(u.webRTCId == publication.publisher.id){
                          nametag.textContent = u.username
                          wapper_dev.appendChild(nametag)
                        }
                      })

                      break;

                  case 'audio':
                      newMedia = document.createElement('audio');
                      newMedia.controls = false;
                      newMedia.autoplay = false;
                      newMedia.volume = 1
                      newMedia.id = publication.publisher.id + "audio"

                      newMedia.hidden = true
                      remoteMediaArea.appendChild(newMedia);

                      break;

                  default:
                      return;
                  }
                  stream.attach(newMedia);


              })();
          };
        }else if(webRTCRoomname == "setumeikai"){
          subscribeAndAttach = (publication) => {
            console.log("setumeikai")
            if (publication.publisher.id === me.id) return;

            // const subscribeButton = document.createElement('button');
            // subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
            // buttonArea.appendChild(subscribeButton);

            (async () => {
                const { stream } = await me.subscribe(publication.id);
                
                let newMedia;
                const dev = createElement("dev")
                
                switch (stream.track.kind) {
                case 'video':
                    newMedia = document.createElement('video');
                    newMedia.playsInline = true;
                    newMedia.autoplay = true;
                    newMedia.id = publication.publisher.id + "video"
                    newMedia.height = 150
                    // newMedia.style.float = "left"
                    newMedia.style.border =" solid 1px #1E223B"
                    newMedia.style.marginLeft = "10px"
                    newMedia.style.borderRadius = "10px 10px 10px 10px"
                    // newMedia.style.boxShadow = ''+ 1 +'px '+ 1+'px 1px 1px #000';#
                    console.log("video!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    break;
                case 'audio':
                    newMedia = document.createElement('audio');
                    newMedia.controls = true;
                    newMedia.autoplay = true;
                    newMedia.volume = 1
                    newMedia.id = publication.publisher.id +  "audio"

                    // newMedia.hidden = true

                    break;
                default:
                    return;
                }
                stream.attach(newMedia);
                
                remoteMediaArea.appendChild(newMedia);
            })();
          };
        }
        
        console.log("aaaa")
        room.publications.forEach(subscribeAndAttach);
        room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
        return true
    })();

  })();

//////////////////////////////////////////////////////////////////////////////////////
