package main

import (
	"encoding/binary"
	"io"
	"log"
	"net"
	"os"
)

const (
	HOST    = "localhost"
	PORT    = "8080"
	TYPE    = "tcp"
	FILEIN  = "temp.jpg"
	FILEOUT = "res.jpg"
)

// envoie un fichier
func sendFile(file *os.File, conn net.Conn) error {
	// Get file stat
	fileInfo, _ := file.Stat()

	// Send the file size
	sizeBuf := make([]byte, 8)
	binary.LittleEndian.PutUint64(sizeBuf, uint64(fileInfo.Size()))
	_, err := conn.Write(sizeBuf)
	if err != nil {
		return err
	}

	// Send the file contents
	_, err = io.Copy(conn, file)
	return err
}

func receiveFile(file string, connexion net.Conn) (*os.File, error) {
	// Create file
	fileImg, err := os.Open(file)
	if err != nil {
		log.Fatal(err)
	}

	// Get file size
	var b []byte
	_, err = connexion.Read(b)
	//size := int64(binary.LittleEndian.Uint64(b))

	// Get file
	_, err = io.Copy(fileImg, connexion)

	return fileImg, err
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
	_, err := receiveFile(FILEIN, connexion)
	if err != nil {
		println("Erreur de réception de fichier:", err.Error())
		os.Exit(1)
	}

	//ouverture du fichier de résultat
	fileImg, err := os.Open(FILEOUT)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()

	//traitement de la requete

	//réponse à la requete
	err = sendFile(fileImg, connexion)
	if err != nil {
		println("Erreur d'envoi de fichier:", err.Error())
		os.Exit(1)
	}

	//fermeture de la connexion
	connexion.Close()
}
