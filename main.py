from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from starlette.responses import HTMLResponse
import json
import time
import asyncio

app = FastAPI()
client_list = []
user_list = []
# 导入静态文件夹中的 HTML 和 JS 文件
app.mount("/public", StaticFiles(directory="public"), name="public")


@app.get("/")
async def read_index():
    # 返回导入的 HTML 文件
    return HTMLResponse(content=open("public/index.html").read(), status_code=200)


@app.websocket("/ws/test")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    # 将新连接的客户端添加到列表中
    client_list.append(ws)
    client_str = str(client_list[-1])
    client_key = hex(id(client_list[-1]))
    print(client_list)
    print(type(client_list))
    print(client_str)
    print(client_key)
    try:
        while True:
            data = await ws.receive_json()
            print(str(data))
            # await asyncio.sleep(3)
            # await ws.send_json({
            #     "resource": "server response 200",
            #     "event": "health_check_event",
            #     "message": "Server health check"
            # })


            user = {
                "username": data['username'],
                # "x": data['x'],
                # "y": data['y'],
                "room_status": data['room_status'],
                "connection_status": data['connection_status']
            }
            # user = {
            #     "username": data['username'],
            #     "time_stamp": data['time_stamp'],
            #     "x": data['x'],
            #     "y": data['y'],
            #     "room_status": data['room_status']
            # }
            print(str(data))
            # print(str(user))
            # クライアントを識別するためのIDを取得
            # print(client_key)
            # print(client_key)
            print(client_list)
            # 新たな接続を辞書に追加する
            if data["event"] == "init_event":

                target_username = data['username']
                index = None
                for i, user_dict in enumerate(user_list):
                    if user_dict['username'] == target_username:
                        index = i
                        break

                if user['username'] not in [u['username'] for u in user_list]:
                    user = {
                        "username": data['username'],
                        "x": 0,
                        "y": 0,
                        "room_status": data['room_status'],
                        "connection_status": data['connection_status']
                    }
                    user_list.append(user)
                    print(user_list)
                else:
                    user_list[index]['connection_status'] = "connected"

                # print(str(index) + "=============================")
                for client in client_list:
                    client_key = hex(id(client))

                    if user not in user_list:
                        await client.send_json({
                            "resource": "server response 200",
                            "event": "init_resp_event",
                            "client_list": [hex(id(c)) for c in client_list],
                            "client_num": len(user_list),
                            "client_key": hex(id(client)),
                            "user_list": user_list,
                            "username": data['username'],
                            "x": 0,
                            "y": 0,
                            "room_status": user_list[index]['room_status'],
                            "message": f"client { data['username'] } is initialized",
                        })
                    else:
                        await client.send_json({
                            "resource": "server response 200",
                            "event": "init_resp_event",
                            "client_list": [hex(id(c)) for c in client_list],
                            "client_num": len(user_list),
                            "client_key": hex(id(client)),
                            "user_list": user_list,
                            "username": data['username'],
                            "x": user_list[index]['x'],
                            "y": user_list[index]['y'],
                            "room_status": user_list[index]['room_status'],
                            "message": f"client { data['username'] } is initialized",
                        })

            elif data['event'] == "position_event":

                target_username = data['username']
                index = None

                for i, user_dict in enumerate(user_list):
                    if user_dict['username'] == target_username:
                        index = i
                        break
                user_list[index]['x'] = data['x']
                user_list[index]['y'] = data['y']
                user_list[index]['room_status'] = data['room_status']
                for client in client_list:
                    client_key = hex(id(client))
                    await client.send_json({
                        "resource": "server response 200",
                        "event": "position_resp_event",
                        "client_list": [hex(id(c)) for c in client_list],
                        "client_num": len(user_list),
                        "client_key": hex(id(client)),
                        "user_list": user_list,
                        "username": data['username'],
                        "x": user_list[index]['x'],
                        "y": user_list[index]['y'],
                        "room_status": user_list[index]['room_status'],
                        "message": f"client { data['username'] } is moved",
                    })

            # 处理接收到的数据

    except WebSocketDisconnect:
        index = 0
        for client in client_list:
            if client == ws:
                index = index
                break
            else:
                index += 1
        print(index)
        print(client_list[index])

        client_list.remove(ws)
    
        user_list[index]['connection_status'] = "disconnected"

        for client in client_list:
            client_key = hex(id(client))
            await client.send_json({
                "resource": "server response 200",
                "event": "del_event",
                "user_list": user_list,
                "username": user_list[index]['username'],
                "message": f"client { user_list[index]['username'] } is disconnected",
            })
        # print(user_list[index])
        # user_list.remove(user_list[index])


        print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        pass
