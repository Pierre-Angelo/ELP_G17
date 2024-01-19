package main

import (
	"encoding/gob"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"log"
	"math"
	"net"
	"os"
)

const (
	HOST = "localhost"
	PORT = "8080"
	TYPE = "tcp"
)

// donne les dimentions de l'image (largeur*hauteur)
func getImg(fileImg *os.File) (image.Image, int, int) {
	imgSrc, err := jpeg.Decode(fileImg)
	if err != nil {
		log.Fatal(err)
	}
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()
	return imgSrc, imgWidth, imgHeight
}

func sendImg(fileImg *os.File, conn net.Conn) error {
	imgSrc, imgWidth, imgHeight := getImg(fileImg)

	var imgData []uint32
	imgData = append(imgData, uint32(imgWidth))
	imgData = append(imgData, uint32(imgHeight))

	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			r, g, b, _ := imgSrc.At(i, j).RGBA()
			imgData = append(imgData, r, g, b)
		}
	}
	encoder := gob.NewEncoder(conn)
	err := encoder.Encode(&imgData)

	return err
}

func receiveImg(connexion net.Conn) (*image.RGBA, error) {
	dec := gob.NewDecoder(connexion)
	ob := new([]uint32)
	err := dec.Decode(ob)

	imgData := *ob

	imgWidth := int(imgData[0])
	imgHeight := int(imgData[1])
	imgSrc := image.NewRGBA(image.Rect(0, 0, imgWidth, imgHeight))

	i := 2
	for x := 0; x < imgWidth; x++ {
		for y := 0; y < imgHeight; y++ {
			pcolor := color.NRGBA64{uint16(imgData[i]), uint16(imgData[i+1]), uint16(imgData[i+2]), math.MaxUint16}
			imgSrc.Set(x, y, pcolor)
			i += 3
		}
	}
	return imgSrc, err
}

func getFileImg() (*os.File, string) {
	var fileIn string
	var fileOut string

	fmt.Println("Entrez le nom du ficher jpg à traiter (avec le .jpg) : ")
	fmt.Scanln(&fileIn)

	img, err := os.Open(fileIn)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Entrez le nom du ficher jpg en sortie (avec le .jpg) : ")
	fmt.Scanln(&fileOut)

	return img, fileOut
}

func main() {

	fileImg, nameImgOut := getFileImg()
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

	err = sendImg(fileImg, connexion)
	if err != nil {
		println("Erreur d'envoi de fichier:", err.Error())
		os.Exit(1)
	}

	imgOut, err := receiveImg(connexion)
	if err != nil {
		println("Erreur de réception de l'image", err.Error())
		os.Exit(1)
	}

	fileOut, err := os.Create(nameImgOut)
	if err != nil {
		println("Erreur de création de l'image", err.Error())
		os.Exit(1)
	}
	defer fileOut.Close()

	var opt jpeg.Options
	opt.Quality = 80
	err = jpeg.Encode(fileOut, imgOut, &opt)
	if err != nil {
		println("Erreur d'encodage de l'image", err.Error())
		os.Exit(1)
	}
}
