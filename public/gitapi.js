{
    var request = new XMLHttpRequest();
    const openaiButton = document.getElementById("openai-btn")
    const window = document.getElementById("window")
    let username = "kouxi08"
    baseurl = "http://localhost:5555/articles"
    openaiButton.addEventListener('click',() => {
        window.hidden = !window.hidden

    })
    const openaiSend = document.getElementById("openai-send")
    openaiSend.addEventListener('click', () => {
        let company = document.getElementById("company").value
        let department = document.getElementById("department").vale
        let hobby = document.getElementById("hobby").value
        
        url = baseurl + "?username=" + username + "&company=" + company + "&fiel=d" + department + "&hobby=" + hobby
        var request = new XMLHttpRequest();
        console.log("fgchvijohgvhuijohvgchuiohgvcfhuihgvchuiohgvcfhi")

        request.open('GET', url, true);
        request.responseType = 'json';

        request.onload = function () {
            var data = this.response;
            data = JSON.parse(JSON.stringify(data));

            data = cleanText(data.text)
            console.log(data);
            // テキストファイルとしてダウンロードする処理
            // const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
            const blob = new Blob([data], { type: 'text/plain' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data.txt';
            link.click();

            URL.revokeObjectURL(link.href);

        };
        request.send();
    })
    function cleanText(text) {
        // `{}` を削除
        text = text.replace(/{|}/g, '');
      
        // `""` を削除
        text = text.replace(/""/g, '');
      
        // `\n` を削除
        text = text.replace(/\n/g, '');
      
        return text;
      }
      
      

    //   var request = new XMLHttpRequest();
 
//     request.open('GET', 'http://localhost:8081/artivles?username=kouxi08', true);
//     request.responseType = 'json';

//     request.onload = function () {
//         var data = this.response;
//         console.log(data);
//     };
//     request.send();
}