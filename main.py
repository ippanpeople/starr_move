from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from starlette.responses import HTMLResponse
import json

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
    print(client_str)
    print(client_key)
    try:
        while True:
            data = await ws.receive_json()
            user = {"username":data['username'], "x":data['x'], "y":data['y'], "room_status": data['room_status']}
            print(str(data))
            # print(str(user))
            # クライアントを識別するためのIDを取得
            # print(client_key)
            # print(client_key)
            print(client_list)
            # 新たな接続を辞書に追加する
            if data["event"] == "init_event":
                if user not in user_list:
                    user_list.append(user)
                    print(user_list)

                target_username = data['username']
                index = None
                for i, user_dict in enumerate(user_list):
                    if user_dict['username'] == target_username:
                        index = i
                        break
                print(str(index) + "=============================")
                for client in client_list:
                    client_key = hex(id(client))
                    await client.send_json({
                        "resource": "server response 200",
                        "event": "init_resp_event",
                        "client_list": [hex(id(c)) for c in client_list],
                        "client_num": len(user_list),
                        "client_key": hex(id(client)),
                        "user_list" : user_list,
                        "username": data['username'],
                        "x": 0,
                        "y": 0,
                        "room_status": user_list[index]['room_status'],
                        "message" : f"client { data['username'] } is initialized",
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
                        "user_list" : user_list,
                        "username": data['username'],
                        "x": user_list[index]['x'],
                        "y": user_list[index]['y'],
                        "room_status": user_list[index]['room_status'],
                        "message" : f"client { data['username'] } is moved",
                    })

                # await ws.send_json({
                #     "resource": "server request 200",
                #     "event": "position_resp_event",
                #     "username": data['username'],
                #     "x": user_list[index]['x'],
                #     "y": user_list[index]['y']
                # })
                # await client.send_json({
                #     "event": "init_resp_event",
                #     "client_list": [hex(id(c)) for c in client_list],
                #     "client_num": len(user_list),
                #     "client_key": hex(id(client)),
                #     "user_list" : user_list,
                #     "username": data['username'],
                #     "x": 0,
                #     "y": 0,
                #     "message" : f"client { data['username'] } is initialized",
                # })

            # 处理接收到的数据

    except WebSocketDisconnect:
        # 处理 WebSocket 连接断开的情况
        client_list.remove(ws)
        pass
