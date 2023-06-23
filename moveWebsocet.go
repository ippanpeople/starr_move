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
	user_list []map[string]interface{} `json:"User_list"`
}

var health_check_count = make(map[string]int)

var us users
var clients = make(map[string]*websocket.Conn) // 接続されるクライアント
// var clients = make(map[*websocket.Conn]bool)
var stackMessage []SendMessage
var id string
// var clientkey string


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
	go healthcheck()
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
	var clientkey string
	if err != nil {
		log.Fatal(err)
	}

	guid := xid.New()

	clientkey = guid.String()

	//関数が終わったらwebsocektのコネクションをクローズ
	defer ws.Close()
	//クライアントを新しく登録
	clients[clientkey] = ws
	health_check_count[clientkey] = 0
	// us.user_list[]["clientkey"] = clientkey

	for {
		fmt.Println("!!!!!!!!!!!!!!!!loop start!!!!!!!!!!!!!!!")

		var rM SendMessage

		err := ws.ReadJSON(&rM)
		if err != nil {
            log.Printf("error: %v", err)
			log.Printf("reciveMess: error")
			i := searchUsername(clientkey)
			fmt.Println("i:  ",i)
			fmt.Println("ususerlist first",us.user_list[i])
			usname :=  us.user_list[i]["username"].(string)
			us.user_list= us.user_list[:i+copy(us.user_list[i:], us.user_list[i+1:])]
			// fmt.Println("ususerlist later:",us.user_list[i])

			m := SendMessage{
				Resource: "server response 200",
				Event: "user_delete_event",
				Client_key: clientkey,
				Username: usname,
			}
			broadcast(m)
            delete(clients, clientkey)
            break
        }
		fmt.Println("recive message:  ",rM)
		if rM.Event == "init_event" {
			// if slices.Contains(us.user_list[],rM.Username){
			//ユーザが存在しなかった時のユーザ追加処理
			if us.userIndex(rM.Username) == -1 {
				u := make(map[string]interface{})
				u["username"] =  rM.Username
				u["clientkey"] = clientkey
				us.user_list = append(us.user_list , u)
			}
			//ブロードキャスト
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
			broadcast(m)
			// fmt.Println("init_resp_event_fin")
		}else if rM.Event == "position_event" {
			fmt.Println()
			i := us.userIndex(rM.Username)
			fmt.Println("i:",i)

			us.user_list[i]["x"] = rM.X
			us.user_list[i]["y"] = rM.Y

			fmt.Println("us",us.user_list)
			// fmt.Println("position_event_middle")
			// fmt.Println(clients)

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
			broadcast(m)
			fmt.Println("clientlist:" ,clients)

			// fmt.Println("position_event_fin")
		}else if rM.Event == "healthcheck_resp_event"{
			health_check_count[rM.Client_key] = 0
			fmt.Println("client key:",rM.Client_key,"  health_ckeck_count",health_check_count[clientkey])
		}

		fmt.Println("!!!!!!!!!!!!!!!!loop end!!!!!!!!!!!!")
		if err != nil {
			log.Printf("error:%v", err)
			delete(clients,clientkey)
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
		// fmt.Println("v[username]:  ",v["username"],"rM.username:  " , checkname)
		if v["username"]  == checkname{
			return i
		}
	}
	return -1
}

func healthcheck(){
	t := time.NewTicker(time.Second * 3)
	for {
		select {
		case <-t.C:
			fmt.Println("!!!!!!!!!!!!!!!Health check start!!!!!!!!!!!!!!!\n")

			fmt.Println("clients:",clients)
			fmt.Println("userlist:",us.user_list)
			//stackMoveのブロードキャストする
	
			for cName,client := range clients {
				m := SendMessage{
					Resource: "server request 200",
					Event: "healthcheck_event",
					Client_key: cName,
				}
				err := client.WriteJSON(m)
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()
					delete(clients, cName)
				}
				// fmt.Println("healthcheck:",m)

				if health_check_count[cName] > 2{
					fmt.Println("error !!!!!")

					delete(clients,cName)
					i := searchUsername(cName)
					usname :=  us.user_list[i]["username"].(string)

					m := SendMessage{
						Resource: "server request 200",
						Event: "user_delete_event",
						Username: usname,
					}
					broadcast(m)
				}
				health_check_count[cName] += 1
			}
			//stackMoveの中を削除
			fmt.Println("\n!!!!!!!!!!!!!!!Health check end!!!!!!!!!!!!!!!\n")
		}
	}
	
}
func broadcast(m SendMessage){
	for cName,client := range clients{
		err := client.WriteJSON(m)
		if err != nil {
			log.Printf("error: %v", err)
				client.Close()
				log.Printf("error: init_event")

				delete(clients, cName)
		}
	}
}
func searchUsername(clientkey string)(int){
	for i,u := range us.user_list{
		fmt.Println("i: ",i,"clientkey:",clientkey,"u: ",u)
		if u["clientkey"] == clientkey{
			return i
		}
	}
	return -1
}
