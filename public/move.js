// 设置方块的初始位置
let positionX = 0;
let positionY = 0;

// user account
var client_key = prompt("请输入 client_key：");
const client_list = [];
const init_instance = {
  client_key: client_key,
  x: positionX,
  y: positionY
};
// 将客户端名称添加到数组中
function addClient(clientName) {
  client_list.push(clientName);
}

// websocket 連接
const ws = new WebSocket('ws://localhost:8181/ws/test')

// 监听WebSocket连接事件
ws.addEventListener('open', (event) => {
  console.log('WebSocket连接已打开');
  ws.send(JSON.stringify(init_instance));
  const box = document.createElement('div');
  const myBoxId = client_key;
  box.setAttribute('id', myBoxId); // 设置方块的ID属性
  box.classList.add('box');
  box.style.backgroundColor = 'red';
  box.style.left = positionX;
  box.style.top = positionY;
  container.appendChild(box);
  addClient(client_key)
  console.log("client list:", JSON.stringify(client_list),"total client:", client_key.length)
});

// 监听WebSocket接收消息事件
ws.addEventListener('message', (event) => {
  // 解析接收到的数据为JSON格式
  const receivedData = JSON.parse(event.data);

  // 提取client_key值到新的变量
  const receivedClientKey = receivedData.client_key;
  const receivedX = receivedData.x;
  const receivedY = receivedData.y;


  if (receivedClientKey != client_key) {
    console.log('接收到的 client_key:', receivedClientKey);
    console.log('接收到的 x:', receivedX);
    console.log('接收到的 y:', receivedY);
    if (document.getElementById(receivedClientKey) != null) {
      const newBox = document.getElementById(receivedClientKey);

      newBox.style.left = receivedX * 10 + 'px';
      newBox.style.top = receivedY * 10 + 'px';
    }
  }
});

// 监听WebSocket错误事件
ws.addEventListener('error', (event) => {
  console.error('WebSocket发生错误:', event);
});


function moveBox() {
  // 获取方块元素
  const myBox = document.getElementById(client_key);
  myBox.style.left = positionX * 10 + 'px';
  myBox.style.top = positionY * 10 + 'px';

  // 发送位置状态到服务器
  const positionData = {
    client_key: client_key,
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
  requestAnimationFrame(moveBox);
});