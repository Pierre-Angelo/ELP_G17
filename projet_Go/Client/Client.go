package main

import (
	"bufio"
	"encoding/gob"
	"fmt"
	"image/jpeg"
	"io"
	"log"
	"net"
	"os"
)

const (
	HOST        = "localhost"
	PORT        = "8080"
	TYPE        = "tcp"
	FILEIN      = "Titi.jpg"
	FILEOUT     = "res.jpg"
	BUFFER_SIZE = 1024
)

// donne les dimentions de l'image (largeur*hauteur)
func imgSize(fileImg *os.File) (int, int) {
	imgSrc, err := jpeg.Decode(fileImg)
	if err != nil {
		log.Fatal(err)
	}
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()
	return imgWidth, imgHeight
}

// convertie un fichier en un tableau de bytes
func fileToByte(file *os.File) []byte {
	fileInfo, _ := file.Stat()
	var size int64 = fileInfo.Size()
	bytes := make([]byte, size)
	buffer := bufio.NewReader(file)
	_, err := buffer.Read(bytes)
	if err != nil {
		log.Fatal(err)
	}
	return bytes
}

// convertie un tableau de bytes en fichier
func byteToFile(bytes []byte, fileName string) *os.File {
	file, err := os.Create(fileName)
	if err != nil {
		log.Fatal(err)
	}
	buffer := bufio.NewWriter(file)
	_, err = buffer.Write(bytes)
	return file
}

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

func main() {

	fileImg, err := os.Open(FILEIN)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()
	imgSrc, _ := jpeg.Decode(fileImg)
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()

	//recherche du serveur
	serveur, err := net.ResolveTCPAddr(TYPE, HOST+":"+PORT)
	if err != nil {
		println("ResolveTCPAddr failed:", err.Error())
		os.Exit(1)
	}

	//établissement de la connexion
	connexion, err := net.DialTCP(TYPE, nil, serveur)
	if err != nil {
		println("Dial failed:", err.Error())
		os.Exit(1)
	}

	var matImage []uint32

	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			r, g, b, a := imgSrc.At(i, j).RGBA()
			matImage = append(matImage, r, g, b, a)
		}
	}
	encoder := gob.NewEncoder(connexion)
	encoder.Encode(&matImage)
	connexion.Close()

	//envoie de la requette
	//err = sendFile(FILEIN, connexion)
	//if err != nil {
	//println("Erreur d'envoi de fichier:", err.Error())
	//os.Exit(1)
	//}

	//réception de la réponse
	/* err = receiveFile(FILEOUT, connexion)
	if err != nil {
		println("Erreur de réception de fichier:", err.Error())
		os.Exit(1)
	} */
}
