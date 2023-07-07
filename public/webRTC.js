// import { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, SkyWayStreamFactory, uuidV4 } from '@skyway-sdk/room';
const { nowInSec, SkyWayAuthToken, SkyWayContext, SkyWayRoom, SkyWayStreamFactory, uuidV4 } = skyway_room;
let join
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
 export const webRTC  =  async  ()  => {
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

    join = async () => {
        console.log("join")
        // roomName = Math.random().toString(32).substring(2)
        let roomName = "aa"
        console.log(roomName)

        if (roomName.value === '') return;

        const context = await SkyWayContext.Create(token);
        console.log("aaaa")

        const room = await SkyWayRoom.FindOrCreate(context, {
            type: 'sfu',
            name: roomName,
        });

        const me = await room.join();

        myId.textContent = me.id;

        await me.publish(audio);
        await me.publish(video);

        const subscribeAndAttach = (publication) => {
            if (publication.publisher.id === me.id) return;

            const subscribeButton = document.createElement('button');
            subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
            buttonArea.appendChild(subscribeButton);

            subscribeButton.onclick = async () => {
                const { stream } = await me.subscribe(publication.id);

                let newMedia;
                switch (stream.track.kind) {
                case 'video':
                    newMedia = document.createElement('video');
                    newMedia.playsInline = true;
                    newMedia.autoplay = true;
                    break;
                case 'audio':
                    newMedia = document.createElement('audio');
                    newMedia.controls = true;
                    newMedia.autoplay = true;
                    break;
                default:
                    return;
                }
                stream.attach(newMedia);
                remoteMediaArea.appendChild(newMedia);
            };
        };
        console.log("aaaa")

        room.publications.forEach(subscribeAndAttach);
        room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
    };

    // if(true){
    //     console.log("join")
    //     join()
    // }

  };