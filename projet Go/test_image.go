package main

import (
	"image"
	"image/color"
	"image/jpeg"
	"log"
	"os"
)

func ferror(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
func main() {

	//Ouverture du fichier et création de la matrice
	fileImg, err := os.Open("Titi.jpg")
	ferror(err)
	defer fileImg.Close()
	imgSrc, err2 := jpeg.Decode(fileImg)
	ferror(err2)

	//création de la nouvelle image et du nouveau fichier
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()
	//var couleur color.Color
	imgOut := image.NewRGBA(image.Rect(0, 0, imgWidth, imgHeight))
	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			r, g, b, a := imgSrc.At(i, j).RGBA()
			couleur := color.NRGBA64{uint16(r), uint16(g), uint16(b), uint16(a)}
			imgOut.Set(i, j, couleur)
		}
	}
	fileOut, err3 := os.Create("res.jpg")
	ferror(err3)
	defer fileOut.Close()

	//édition du nouveau fichier
	var opt jpeg.Options
	opt.Quality = 80
	err4 := jpeg.Encode(fileOut, imgOut, &opt)
	ferror(err4)

}
