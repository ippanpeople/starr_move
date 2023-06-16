// 获取方块元素
const box = document.getElementById('box');

// 设置方块的初始位置
let positionX = 0;
let positionY = 0;

// user account
var client_key = "kimu"

// websocket 連接
const ws = new WebSocket('ws://lobi/ws/' + client_key)

// 监听WebSocket连接事件
socket.addEventListener('open', (event) => {
    console.log('WebSocket连接已打开');
});

// 监听WebSocket接收消息事件
socket.addEventListener('message', (event) => {
    console.log('收到消息:', event.data);
});

// 监听WebSocket错误事件
socket.addEventListener('error', (event) => {
    console.error('WebSocket发生错误:', event);
});
  

function moveBox() {
  box.style.left = positionX * 10 + 'px';
  box.style.top = positionY * 10 + 'px';

    // 发送位置状态到服务器
    const positionData = {
        x: positionX,
        y: positionY
    };
    socket.send(JSON.stringify(positionData));
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