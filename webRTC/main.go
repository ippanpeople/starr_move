package main

import "github.com/gin-gonic/gin"

var keys =  make(map[string]string)

func main() {
    r := gin.Default()
    r.GET("/room", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })
    r.Run()
}