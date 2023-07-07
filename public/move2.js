// 设置方块的初始位置
let positionX = 0;
let positionY = 0;
let room_status = "exit";
let connection_status = "connected";

let pod = []

///追加
let vChatUser = []
let webRTCId = ""
let preVChatUser = []
 
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
  // const ws = new WebSocket('wss://starr_move.rinlink.jp/ws/test')
  const ws = new WebSocket('ws://localhost:8282/ws/test')

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
    const receivedRoomname = receivedData.room_name

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
            newBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
            newBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
            // newBox.style.zIndex = receivedClientList.length * 10;
            newBox.style.zIndex = 10;
            container.appendChild(newBox)

          } else if (receivedData['username'] == username & receivedUserList[user]["username"] == username) {

            const myBox = document.createElement('div');
            const myBoxId = username;
            myBox.setAttribute('id', myBoxId); 
            myBox.classList.add('myBox');
            myBox.style.backgroundColor = 'red';
            myBox.style.left = receivedUserList[user]["x"] * 10 + 'px';
            positionX = receivedUserList[user]["x"]
            myBox.style.top = receivedUserList[user]["y"] * 10 + 'px';
            positionY = receivedUserList[user]["y"]
            myBox.style.zIndex = 20;
            container.appendChild(myBox);
            console.log(receivedUserList);
            webRTCRoomname = receivedRoomname

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
        container.appendChild(newBox);

      }
    } else if (resp_event == "position_resp_event") {
      console.log(receivedUsername)
      const targetUsername = receivedUsername;
      let index = null;

      preVChatUser = vChatUser
      vChatUser = []

      for (let i = 0; i < receivedData.user_list.length; i++) {
        const userDict = receivedData.user_list[i];
        if (userDict.username === targetUsername) {
          index = i;
          //追加
          // break;
        }
        //追加
        if(webRTCRoomname == "lobby"){
          if(userDict.connection_status ==  "connected"){
            if(positionX <= 25 && positionY <= 14 &&positionX >= 5 && positionY >= 4){
              console.log(userDict.username)
              vChatUser.push(userDict.webRTCId)
            }
          }else if(positionX >= 40 && positionY <= 4 && positionX <= 27 && positionY >= 9){
            console.log(userDict.username)
            vChatUser.push(userDict.webRTCId)
          }
        }
        ///////
      }
      //追加
      console.log("vChatUser")
      console.log(vChatUser); 
      console.log("preVChatUser")
      console.log(preVChatUser); 

      const remoteMediaArea = document.getElementById('remote-media-area');
      const media = remoteMediaArea.querySelectorAll("video")
      console.log("mediadelete")
      console.log(media)


      let deleteVchatUser = preVChatUser.filter(u => !vChatUser.includes(u));
      let createVChatUser =  vChatUser.filter(u => !preVChatUser.includes(u));
      if(webRTCRoomname == "lobby"){
        console.log(deleteVchatUser)
        createVChatUser.forEach(
          delMediaId => {
            // const remoteMediaArea = document.getElementById('remote-media-area');
            // const vMedia = remoteMediaArea.querySelectorAll("video")
            // const aMedia = remoteMediaArea.querySelectorAll("audio")
            // const vtag = document.querySelectorAll(delMediaId)
            // const atag = document.getElementById(delMediaId)
            // vtag.hidden = true
            // console.log(vtag)
            // console.log(atag)
            const vtag = document.querySelectorAll("#remote-media-area video[id='" + delMediaId + "']");
            vtag.forEach(video => {
              // video.style.display = "none";
              video.hidden = false
            });

            // オーディオ要素を非表示にする
            const atag = document.querySelector("#remote-media-area audio[id='" + delMediaId + "']");
            if(atag != null){
              console.log("atag")

              console.log(atag)
              atag.volume = 1

            }

          }
        )
        deleteVchatUser.forEach(
          delMediaId => {
            // const remoteMediaArea = document.getElementById('remote-media-area');
            // const vMedia = remoteMediaArea.querySelectorAll("video")
            // const aMedia = remoteMediaArea.querySelectorAll("audio")
            // const vtag = document.querySelectorAll(delMediaId)
            // const atag = document.getElementById(delMediaId)
            // vtag.hidden = true
            // console.log(vtag)
            // console.log(atag)
            const vtag = document.querySelectorAll("#remote-media-area video[id='" + delMediaId + "']");
            vtag.forEach(video => {
              // video.style.display = "none";
              video.hidden = true
            });

            // オーディオ要素を非表示にする
            const atag = document.querySelector("#remote-media-area audio[id='" + delMediaId + "']");
            atag.volume = 0

          }
        )
      }
      // console.log("canVchatUsers")
      // console.log(canVchatUsers)
      // console.log("deleteVchatUser")
      // console.log(deleteVchatUser)

     

      console.log(receivedData.user_list)
      console.log(receivedData.user_list[index])
      const newBox = document.getElementById(receivedUsername);

      for(users in receivedData.user_list){
        x = users["x"]
        y = user["y"]
        console.log(x)
      
      }

      newBox.style.left = receivedData.user_list[index]["x"] * 10 + 'px';
      newBox.style.top = receivedData.user_list[index]["y"] * 10 + 'px';
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
        webRTCId:webRTCId,
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
        webRTCId:webRTCId,
        connection_status: connection_status
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
}

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
    const buttonArea = document.getElementById('button-area');
    const remoteMediaArea = document.getElementById('remote-media-area');
    const roomNameInput = document.getElementById('room-name');
    
    const myId = document.getElementById('my-id');
    const joinButton = document.getElementById('join');
  
    const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo);
    await localVideo.play();

    (async () => {
        // roomName = Math.random().toString(32).substring(2)
        // roomName = "aa"
        roomName = webRTCRoomname
        console.log(roomName)


        if (roomName === '' || roomName === null) return false;

        let context = await SkyWayContext.Create(token);
        console.log("aaaa")

        room = await SkyWayRoom.FindOrCreate(context, {
            type: 'sfu',
            name: roomName,
        });

        const me = await room.join();

        myId.textContent = me.id;

        webRTCId =  me.id

        await me.publish(audio);
        await me.publish(video);
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

                  switch (stream.track.kind) {
                  case 'video':
                      newMedia = document.createElement('video');
                      newMedia.playsInline = true;
                      newMedia.autoplay = true;
                      newMedia.hidden = true
                      newMedia.id = publication.publisher.id
                      break;
                  case 'audio':
                      newMedia = document.createElement('audio');
                      newMedia.controls = true;
                      newMedia.autoplay = true;
                      newMedia.volume = 0
                      newMedia.id = publication.publisher.id

                      // newMedia.hidden = true
                      
                      break;
                  default:
                      return;
                  }
                  stream.attach(newMedia);
                  remoteMediaArea.appendChild(newMedia);
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

                switch (stream.track.kind) {
                case 'video':
                    newMedia = document.createElement('video');
                    newMedia.playsInline = true;
                    newMedia.autoplay = true;
                    newMedia.id = publication.publisher.id
                    newMedia.hidden = false

                    break;
                case 'audio':
                    newMedia = document.createElement('audio');
                    newMedia.controls = true;
                    newMedia.autoplay = true;
                    newMedia.volume = 1
                    newMedia.id = publication.publisher.id

                    newMedia.hidden = false

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
    // leave = async () => {
    //   room.close()
    // }

    // if(true){
    //     console.log("join")
    //     join()
    // }

  })();













//////////////////////////////////////////////////////////////////////////////////////

