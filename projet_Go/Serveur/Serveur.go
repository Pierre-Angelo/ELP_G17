package main

import (
	"encoding/gob"
	"fmt"
	"io"
	"log"
	"net"
	"os"
)

const (
	HOST        = "localhost"
	PORT        = "8080"
	TYPE        = "tcp"
	FILEIN      = "temp.jpg"
	FILEOUT     = "res.jpg"
	BUFFER_SIZE = 1024
)

func sendFile(file string, conn net.Conn) error {
	fmt.Println("**** Sending File ****")
	fileImg, err := os.Open(file)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()
	buffer := make([]byte, BUFFER_SIZE)
	_, err = io.CopyBuffer(conn, fileImg, buffer)
	fmt.Println("**** File Sent ****")
	return err
}

func receiveFile(file string, connexion net.Conn) error {
	fmt.Println("**** Receiving File ****")
	fileImg, err := os.Create(file)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()
	buffer := make([]byte, BUFFER_SIZE)
	_, err = io.CopyBuffer(fileImg, connexion, buffer)
	fmt.Println("**** File Received ****")
	return err
}

func greatings() {

}

func main() {
	//ouverture du listener
	listener, err := net.Listen(TYPE, HOST+":"+PORT)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	//fermeture du listener à la fin
	defer listener.Close()
	//écoute des requetes
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

	//réception de la requete
	/* err := receiveFile(FILEIN, connexion)
	if err != nil {
		println("Erreur de réception de fichier:", err.Error())
		os.Exit(1)
	}
	*/
	dec := gob.NewDecoder(connexion)
	imgOut := new([]uint32)
	dec.Decode(imgOut)

	fmt.Println(*imgOut)

	/* fileOut, _ := os.Create("res.jpg")
	defer fileOut.Close()

	var opt jpeg.Options
	opt.Quality = 80
	err345 := jpeg.Encode(fileOut, *imgOut, &opt)

	fmt.Println(err345) */

	//ouverture du fichier de résultat
	//fileImg, err := os.Open(FILEOUT)
	//if err != nil {
	//log.Fatal(err)
	//}
	//defer fileImg.Close()

	//traitement de la requete

	//réponse à la requete
	/* 	err = sendFile(FILEOUT, connexion)
	   	if err != nil {
	   		println("Erreur d'envoi de fichier:", err.Error())
	   		os.Exit(1)
	   	}
	*/
	//fermeture de la connexion
	connexion.Close()
}
