package main

import (
	"log"
	"net"
	"os"
)

const (
	HOST = "localhost"
	PORT = "8080"
	TYPE = "tcp"
)

func main() {
	//ouverture du listener
	listener, err := net.Listen(TYPE, HOST+":"+PORT)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	//fermeture du listener à la fin
	defer listener.Close()
	//écoute des requettes
	for {
		connexion, err := listener.Accept()
		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}
		go reponse(connexion)
	}
}

func reponse(connexion net.Conn) {

	//réception de la requette
	buffer := make([]byte, 1024)
	_, err := connexion.Read(buffer)
	if err != nil {
		log.Fatal(err)
	}

	//réponse à la requette
	res := "coucou"
	connexion.Write([]byte(res))

	//fermeture de la connexion
	connexion.Close()
}
