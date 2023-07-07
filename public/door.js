const room = document.getElementById('room');
const bar = document.getElementById('bar');
//マウスが要素上に入った時
room.addEventListener('mouseover', () => {
    console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")
    room.style.opacity = 1;

}, false);

//マウスが要素上から離れた時
room.addEventListener('mouseleave', () => {

    room.style.opacity = 0;

}, false);

//マウスが要素上に入った時
bar.addEventListener('mouseover', () => {

    bar.style.opacity = 1;

}, false);

//マウスが要素上から離れた時
bar.addEventListener('mouseleave', () => {

    bar.style.opacity = 0;

}, false);

document.getElementById("bar").addEventListener("click", function() {
    // 在这里执行点击事件的处理逻辑
    // 重定向到指定的网址
    var url = "https://starr_move_bar.rinlink.jp?username=" + encodeURIComponent(username);
    window.location.href = url;
    console.log(username)
  });