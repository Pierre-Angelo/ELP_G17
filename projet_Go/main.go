package main

import (
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"log"
	"os"
	k "projet_Go/kuwahara"
	"time"
)

type job struct {
	pImage *image.Image
	ligne  int
}

type accompli struct {
	color color.NRGBA64
	x     int
	y     int
}

func ferror(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func partitionneur(hauteur int, canal chan job, reference *image.Image) {
	//prend la hauteur de l'image en entrée et renvoie rien
	//fait les push dans la channel
	for i := 0; i < hauteur; i++ {
		canal <- job{reference, i}
	}
	close(canal)
}

func worker(liste_travaux chan job, resultat chan accompli) {
	//création des trvailleurs, renvoie rien
	for emploi := range liste_travaux {
		largeur := (*(emploi.pImage)).Bounds().Dx()
		for i := 0; i < largeur; i++ {
			resultat <- accompli{k.Kuwahara(i, emploi.ligne, 20, *(emploi.pImage)), i, emploi.ligne}
		}
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

	start := time.Now()

	//initialisation du myChannel et resultat
	travaux := make(chan job, 750)
	resultats := make(chan accompli, 750)

	//on créer les travailleurs
	for w := 1; w <= 4; w++ {
		go worker(travaux, resultats)
	}

	// un go routine remplit le canal
	go partitionneur(imgHeight, travaux, &imgSrc)

	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			pixel := <-resultats
			imgOut.Set(pixel.x, pixel.y, pixel.color)
		}
	}
	end := time.Now()
	fmt.Println(end.Sub(start))

	fileOut, err3 := os.Create("res.jpg")
	ferror(err3)
	defer fileOut.Close()

	//édition du nouveau fichier
	var opt jpeg.Options
	opt.Quality = 80
	err4 := jpeg.Encode(fileOut, imgOut, &opt)
	ferror(err4)
}
