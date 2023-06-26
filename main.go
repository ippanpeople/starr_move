package main

import (
	"fmt"
	"log"
	"net/http"

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
	Room_status	string `json:"room_status"`
	Connection_status string `json:"connection_status"`
	Message string `json:"message"` 
}

type users struct {
	user_list []map[string]interface{} `json:"User_list"`
}

var health_check_count = make(map[string]int)
// var stack_user_positiones  = make(map[string]map[string]interface{})



var us users
var clients = make(map[string]*websocket.Conn) // 接続されるクライアント
var id string


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


	//websocketへのルーティング
	http.HandleFunc("/ws/test", handleConnections)
	log.Println("http server started on :8282")

	err := http.ListenAndServe(":8282", nil)
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

	for {
		fmt.Println("!!!!!!!!!!!!!!!!loop start!!!!!!!!!!!!!!!")

		var data SendMessage

		err := ws.ReadJSON(&data)
		if err != nil {
            log.Printf("error: %v", err)
			log.Printf("reciveMess: error")
			log.Print("clientkey:",clientkey)
			i := searchUsername(clientkey)
			fmt.Println("i:  ",i)
			fmt.Println("ususerlist first",us.user_list[i])	

			usname :=  us.user_list[i]["username"].(string)
			us.user_list[i]["connection_status"] = "disconnected"
			
			m := SendMessage{
				Resource: "server response 200",
				Event: "del_event",
				Client_key: clientkey,
				Username: usname,
			}
			broadcast(m)
			us.user_list[i]["clinetkey"] = ""
            delete(clients, clientkey)
            break
        }
		fmt.Println("recive message:  ",data)
		if data.Event == "init_event" {
			//ユーザが存在しなかった時のユーザ追加処理
			x := 0
			y := 0
			i := us.userIndex(data.Username)
			if i == -1 {
				u := make(map[string]interface{})
				u["username"] =  data.Username
				u["clientkey"] = clientkey
				u["room_status"] = "exit"
				u["connection_status"] = "connected"

				u["x"] = 0
				u["y"] = 0
				
				us.user_list = append(us.user_list , u)
				i = len(us.user_list) - 1
				fmt.Println("--------------------------------------------",us.user_list)

			}else{
				x = us.user_list[i]["x"].(int)
				y = us.user_list[i]["y"].(int)
				us.user_list[i]["clientkey"] = clientkey
				us.user_list[i]["room_status"] = "exit"
				us.user_list[i]["connection_status"] = "connected"
			}
			fmt.Println("-----------------------------------",i)
			//ブロードキャスト
			m := SendMessage{
				Resource: "server request 200",
				Event: "init_resp_event",
				Client_list: us.user_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: data.Username,
				X : x,
				Y : y,
				Room_status: us.user_list[i]["room_status"].(string),
				Message : "client " + data.Username + " is initialized",
			}
			broadcast(m)
			// fmt.Println("init_resp_event_fin")
		}else if data.Event == "position_event" {
			fmt.Println()
			i := us.userIndex(data.Username)
			fmt.Println("i:",i)

			us.user_list[i]["x"] = data.X
			us.user_list[i]["y"] = data.Y
			us.user_list[i]["room_status"] = data.Room_status

			fmt.Println("us",us.user_list)

			m := SendMessage{
				Resource: "server request 200",
				Event: "position_resp_event",
				Client_list: us.user_list,
				Client_num: len(us.user_list),
				Client_key: clientkey,
				User_list : us.user_list,
				Username: data.Username,
				X : data.X,
				Y :data.Y,
				Room_status: us.user_list[i]["room_status"].(string),
				Message : "client " + data.Username + " is moved",
			}
			fmt.Println(us.user_list[i]["room_status"].(string))
			broadcast(m)
			fmt.Println("clientlist:" ,clients)
		}else if data.Event == "healthcheck_resp_event"{
			health_check_count[data.Client_key] = 0
			fmt.Println("client key:",data.Client_key,"  health_ckeck_count",health_check_count[clientkey])
		}

		fmt.Println("!!!!!!!!!!!!!!!!loop end!!!!!!!!!!!!")
		if err != nil {
			log.Printf("error:%v", err)
			delete(clients,clientkey)
			break
		}

	}
}
//userlistから名前でindexを検索する
func (us users)userIndex(checkname string)(int){
	for i,v :=  range us.user_list{
		if v["username"]  == checkname{
			return i
		}
	}
	return -1
}
//websocketのbroadcast(connection_statusがconnectedの人のみ)
func broadcast(m SendMessage){
	fmt.Println("SendMessage:", m)
	for cName,client := range clients{
		i := searchUsername(cName)
		fmt.Println("i:", i)
		if i != -1{
			if us.user_list[i]["connection_status"].(string) == "connected" {
				err := client.WriteJSON(m)
				fmt.Println("send")
				if err != nil {
					log.Printf("error: %v", err)
						client.Close()
						log.Printf("error: init_event")
						delete(clients, cName)
				}
			}
		}else{
			fmt.Print("-------------Broadcast index is -1----------")
		}
	}
}
//user_listからclientkeyでindexを検索する
func searchUsername(clientkey string)(int){
	for i,u := range us.user_list{
		fmt.Println("i: ",i,"clientkey:",clientkey,"u: ",u)
		if u["clientkey"] == clientkey{
			return i
		}
	}
	return -1
}
