package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rs/xid"
)

type SendMessage struct {
	Resource string
	Event string
	Client_list interface{}
	Client_num int
	Client_key string 
	User_list map[string]map[string]int
	Username string
	X          int    
	Y          int    
	Message string
}
type users struct {
	client_list []string
	user_list map[string]map[string]int
}

var us = users{}
var clients = make(map[string]*websocket.Conn) // 接続されるクライアント
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

	guid := xid.New()

	clientkey = guid.String()
	//websocketへのルーティング
	http.HandleFunc("/ws/test", handleConnections)
	go handleMessages()
	log.Println("http server started on :8181")
	err := http.ListenAndServe(":8181", nil)
	// エラーがあった場合ロギングする
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
func handleConnections(w http.ResponseWriter, r *http.Request) {
	//送られてきたgetリクエストをwebsocetにアップグレード
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}

	//関数が終わったらwebsocektのコネクションをクローズ
	defer ws.Close()
	//クライアントを新しく登録
	clients[clientkey] = ws

	for {
		var rM SendMessage

		err := ws.ReadJSON(&rM)
		fmt.Println(rM)
		if rM.Event == "init_event" {
			// if slices.Contains(us.user_list,rM.Username){
			_,ok:= us.user_list[rM.Username]
			if ok{
				us.user_list[rM.Username] = nil
				fmt.Println(rM.Username)
			}
			stackMessage = append(stackMessage,SendMessage{
				Resource: "server request 200",
				Event: "init_resp_event",
				Client_list: us.client_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: rM.Username,
				X : 0,
				Y : 0,
				Message : "client " + rM.Username + " is initialized",
			})
		}else if rM.Event == "position_event" {
			fmt.Println("position_event")

			// us.user_list[rM.Username]["X"] = rM.X
			// us.user_list[rM.Username]["Y"] = rM.Y
			fmt.Println("position_event_middle")

			stackMessage = append(stackMessage, SendMessage{
				Resource: "server request 200",
				Event: "init_resp_event",
				Client_list: us.client_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: rM.Username,
				X : rM.X,
				Y :rM.Y,
				Message : "client " + rM.Username + " is initialized",
			})
			fmt.Println("position_event_fin")

		}

		if err != nil {
			log.Printf("error:%v", err)
			delete(clients,clientkey)
			break
		}
		//受信されたデータをスタック
		// stackMessage = append(stackMessage, rM)
	}
}

func handleMessages() {
	t := time.NewTicker(time.Millisecond)
	for {
		select {
		case <-t.C:
			//stackMoveのブロードキャストする
			for cName,client := range clients {
				for _, m := range stackMessage {
					err := client.WriteJSON(m)
					if err != nil {
						log.Printf("error: %v", err)
						client.Close()
						delete(clients, cName)
					}
					fmt.Println("ok!")
					fmt.Println(err)
				}
			}
			//stackMoveの中を削除
			stackMessage= stackMessage[:0]
		}
	}
}
