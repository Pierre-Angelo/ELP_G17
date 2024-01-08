package main

import (
	"bufio"
	"image/jpeg"
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

func write(bytes []byte, imgWidth int, imgHeight int, connexion net.Conn) {
	//envoie de la signature de l'image
	signature := "jpg:" + string(imgWidth) + "*" + string(imgHeight) + "/"
	_, err := connexion.Write([]byte(signature))
	if err != nil {
		println("Write data failed:", err.Error())
		os.Exit(1)
	}

	//envoie de l'image

}

func send(file string, connexion net.Conn) {
	//ouverture de l'image
	fileImg, err := os.Open(file)
	if err != nil {
		log.Fatal(err)
	}
	defer fileImg.Close()

	imgSrc, err := jpeg.Decode(fileImg)
	if err != nil {
		log.Fatal(err)
	}
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()

	//convertion de l'image en bytes
	fileInfo, _ := fileImg.Stat()
	var size int64 = fileInfo.Size()
	bytes := make([]byte, size)
	buffer := bufio.NewReader(fileImg)
	_, err = buffer.Read(bytes)

	//écriture de l'image
	write(bytes, imgWidth, imgHeight, connexion)
}

func receive(file string, connexion net.Conn) {
	buffer := make([]byte, 2048*1536)
	_, err := connexion.Read(buffer)
	if err != nil {
		println("Read data failed:", err.Error())
		os.Exit(1)
	}
}

func main() {
	//recherche du serveur
	serveur, err := net.ResolveTCPAddr(TYPE, HOST+":"+PORT)
	if err != nil {
		println("ResolveTCPAddr failed:", err.Error())
		os.Exit(1)
	}

	//établisement de la connexion
	connexion, err := net.DialTCP(TYPE, nil, serveur)
	if err != nil {
		println("Dial failed:", err.Error())
		os.Exit(1)
	}

	//envoie de la requette
	send(FILEIN, connexion)

	//réception de la réponse
	receive(FILEOUT, connexion)

	//utilisation de la réponse
	//println(string(buffer))
	//imageOut := (buffer)

	//fermeture de la connexion
	connexion.Close()

	//création de la nouvelle image
	fileOut, err := os.Create("res.jpg")
	if err != nil {
		log.Fatal(err)
	}
	defer fileOut.Close()
	var opt jpeg.Options
	opt.Quality = 80
	//err = jpeg.Encode(fileOut, imgOut, &opt)
	if err != nil {
		log.Fatal(err)
	}
}
