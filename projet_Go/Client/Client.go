package main

import (
	"bufio"
	"encoding/binary"
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

	fileImg, err := os.Open(FILEIN)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()

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

	//envoie de la requette
	err = sendFile(fileImg, connexion)
	if err != nil {
		println("Erreur d'envoi de fichier:", err.Error())
		os.Exit(1)
	}

	//réception de la réponse
	res, err := receiveFile(FILEOUT, connexion)
	if err != nil {
		println("Erreur de réception de fichier:", err.Error())
		os.Exit(1)
	}
	_ = res.Close()
}
