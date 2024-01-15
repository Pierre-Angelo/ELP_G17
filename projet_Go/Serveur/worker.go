package main

import (
	"image"
	"image/color"
)

type job struct {
	pImage   *image.RGBA
	resultat chan accompli
	ligne    int
}

type accompli struct {
	color color.NRGBA64
	x     int
	y     int
}

func partitionneur(hauteur int, canal chan job, reference *image.RGBA, resultat chan accompli) {
	//prend la hauteur de l'image en entrée et renvoie rien
	//fait les push dans la channel
	for i := 0; i < hauteur; i++ {
		canal <- job{reference, resultat, i}
	}
}

func worker(liste_travaux chan job) {
	//création des trvailleurs, renvoie rien
	for emploi := range liste_travaux {
		largeur := (*(emploi.pImage)).Bounds().Dx()
		resultat := emploi.resultat
		for i := 0; i < largeur; i++ {
			resultat <- accompli{Kuwahara(i, emploi.ligne, 10, *(emploi.pImage)), i, emploi.ligne}
		}
	}
}

func trans(imgSrc *image.RGBA, imgWidth int, imgHeight int) []uint32 {
	var imgData []uint32
	imgData = append(imgData, uint32(imgWidth))
	imgData = append(imgData, uint32(imgHeight))

	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			r, g, b, _ := imgSrc.At(i, j).RGBA()
			imgData = append(imgData, r, g, b)
		}
	}
	return imgData
}

func MainNumberTwo(Imgsource *image.RGBA, imgWidth int, imgHeight int, travaux chan job, resultats chan accompli) []uint32 {
	imgOut := image.NewRGBA(image.Rect(0, 0, imgWidth, imgHeight))

	// un go routine remplit le canal
	go partitionneur(imgHeight, travaux, Imgsource, resultats)

	for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			pixel := <-resultats
			imgOut.Set(pixel.x, pixel.y, pixel.color)
		}
	}

	res := trans(imgOut, imgWidth, imgHeight)
	return res
}
