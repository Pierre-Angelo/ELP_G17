package main

import (
	"encoding/gob"
	"image"
	"image/color"
	"log"
	"math"
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

func sendImg(imgData []uint32, conn net.Conn) error {
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

func purple(imgSrc *image.RGBA) []uint32 {
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()

	var imgDataOut []uint32
	imgDataOut = append(imgDataOut, uint32(imgWidth))
	imgDataOut = append(imgDataOut, uint32(imgHeight))

	for x := 0; x < imgWidth; x++ {
		for y := 0; y < imgHeight; y++ {
			r, g, b, _ := imgSrc.At(x, y).RGBA()
			imgDataOut = append(imgDataOut, r, g*0, b)
		}
	}
	return imgDataOut
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
	imgSrc, err := receiveImg(connexion)
	if err != nil {
		println("Erreur de décodage de l'image", err.Error())
		os.Exit(1)
	}

	DataRes := purple(imgSrc)

	err = sendImg(DataRes, connexion)
	if err != nil {
		println("Erreur de décodage de l'image", err.Error())
		os.Exit(1)
	}

	connexion.Close()
}
