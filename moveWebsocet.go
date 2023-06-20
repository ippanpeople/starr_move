package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type SendMessage struct {
	Resource string `json:"resource"`
	Event string `json:"event"`
	Client_list interface{} `json:"client_list"`
	Client_num int `json:"client_num"`
	Client_key string `json:"client_key"`
	// User_list map[string]map[string]int `json:"User_list"`
	User_list []map[string]interface{} `json:"user_list"`
	Username string `json:"username"`
	X          int `json:"x"`
	Y          int `json:"y"`
	Message string `json:"message"` 
}

type users struct {
	client_list []string
	user_list []map[string]interface{} `json:"User_list"`
}

var us users
// var clients = make(map[string]*websocket.Conn) // 接続されるクライアント
var clients = make(map[*websocket.Conn]bool)
var stackMessage []SendMessage
var id string
var clientkey string

// アップグレーダ
// var upgrader = websocket.Upgrader{}
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// ファイルサーバーを立ち上げる
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	// guid := xid.New()

	// clientkey = guid.String()
	
	//websocketへのルーティング
	http.HandleFunc("/ws/test", handleConnections)
	// go handleMessages()
	log.Println("http server started on :8181")
	err := http.ListenAndServe(":8181", nil)
	// エラーがあった場合ロギングする
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	//送られてきたgetリクエストをwebsocetにアップグレード
	fmt.Println("!!!!!!!!!!start websocekt!!!!!!!!!!!!!")
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}
	
	//関数が終わったらwebsocektのコネクションをクローズ
	defer ws.Close()
	//クライアントを新しく登録
	clients[ws] = true

	for {
		var rM SendMessage

		err := ws.ReadJSON(&rM)
		if err != nil {
            log.Printf("error: %v", err)
            delete(clients, ws)
            break
        }
		fmt.Println("rm:  ",rM)
		if rM.Event == "init_event" {
			// if slices.Contains(us.user_list[],rM.Username){
			if us.userIndex(rM.Username) == -1 {

			// _,ok:= us.user_list[rM.Username]
			// if ok{
				// us.user_list[rM.Username] = nil
				// fmt.Println(rM.Username)
				u := make(map[string]interface{})
				u["username"] =  rM.Username
				us.user_list = append(us.user_list , u)
				fmt.Println(rM.Username)
			}
			m := SendMessage{
				Resource: "server request 200",
				Event: "init_resp_event",
				Client_list: us.user_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: rM.Username,
				X : 0,
				Y : 0,
				Message : "client " + rM.Username + " is initialized",
			}
			for client := range clients{
				err := client.WriteJSON(m)
				if err != nil {
					log.Printf("error: %v", err)
						client.Close()
						delete(clients, client)
				}
			}
			fmt.Println("init_resp_event_fin")


		}else if rM.Event == "position_event" {
			// fmt.Println("position_event")
			// fmt.Println(us.user_list)
			// // fmt.Println(us.user_list[rM.Username])
			// fmt.Println(rM.Username)
			// fmt.Println(rM.X)
			// fmt.Println(rM.Y)
			i := us.userIndex(rM.Username)
			fmt.Println("i:",i)


			us.user_list[i]["x"] = rM.X
			us.user_list[i]["y"] = rM.Y

			fmt.Println("us",us.user_list)
			fmt.Println("position_event_middle")
			fmt.Println(clients)


			m := SendMessage{
				Resource: "server request 200",
				Event: "position_resp_event",
				Client_list: us.user_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: rM.Username,
				X : rM.X,
				Y :rM.Y,
				Message : "client " + rM.Username + " is initialized",
			}
			for client := range clients{
				err := client.WriteJSON(m)
				if err != nil {
					log.Printf("error: %v", err)
						client.Close()
						delete(clients, client)
				}
			}
			fmt.Println("position_event_fin")
		}

		if err != nil {
			log.Printf("error:%v", err)
			delete(clients,ws)
			break
		}
		//受信されたデータをスタック
		// stackMessage = append(stackMessage, rM)
	}
}

// func handleMessages() {
// 	t := time.NewTicker(time.Millisecond)
// 	for {
// 		select {
// 		case <-t.C:
// 			//stackMoveのブロードキャストする
// 			for client := range clients {
// 				for _, m := range stackMessage {
// 					err := client.WriteJSON(m)
// 					if err != nil {
// 						log.Printf("error: %v", err)
// 						client.Close()
// 						delete(clients, client)
// 					}
// 					fmt.Printf("stackMessage:%+v\n",stackMessage)
// 				}
// 			}

// 			//stackMoveの中を削除
// 			stackMessage= stackMessage[:0]
// 		}
// 	}
// }

func (us users)userIndex(checkname string)(int){
	for i,v :=  range us.user_list{
		fmt.Println("v[username]:  ",v["username"],"rM.username:  " , checkname)
		if v["username"]  == checkname{
			return i
		}
	}
	return -1
}