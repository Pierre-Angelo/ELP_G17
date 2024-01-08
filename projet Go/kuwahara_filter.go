package main

import (
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"log"
	"math"
	"os"
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

func get_coords(start int, length int, limit int, dir int) []int {
	var res []int

	if dir > 0 {
		for i := start; i < (start+length) && i < limit; i++ {
			res = append(res, i)
		}
	} else {
		for i := start; i > (start-length) && i > -1; i-- {
			res = append(res, i)
		}
	}
	return res
}

func get_quads(px int, py int, kernelSize int, imgSrc image.Image) [][][3]uint32 {
	/*	renvoie : liste des 4 quadrants centrés en (x,y) (un quadrant est une liste de pixels),
		les quadrant ne font pas forcement la même taille (voire schéma).
		un quadrant prend est au maximum la taille d'un carré de de la taille du kernel (kSize) et au minimum le pixel central*/
	imgWidth := imgSrc.Bounds().Dx()
	imgHeight := imgSrc.Bounds().Dy()
	var quads [][][3]uint32 // liste des quatre quadrants

	for i := -1; i <= 1; i += 2 { // x négatifs puis x positifs
		Xcoords := get_coords(px, kernelSize, imgWidth, i) //récupère la liste des coordonées en x du quadrant
		for j := -1; j <= 1; j += 2 {                      // y négatifs puis y positifs
			Ycoords := get_coords(py, kernelSize, imgHeight, j) //récupère la liste des coordonées en y du quadrant
			var quad [][3]uint32                                // un quadrant
			for _, x := range Xcoords {
				for _, y := range Ycoords {
					r, g, b, _ := imgSrc.At(x, y).RGBA()
					rgb := [3]uint32{r, g, b} //un pixel
					quad = append(quad, rgb)
				}
			}
			quads = append(quads, quad)
		}
	}
	return quads
}

func quad_avg_pixel(quad [][3]uint32) [3]uint32 {
	// revoie le pixel moyen d'un quadrant
	arrSize := len(quad)
	Psum := [3]uint32{0, 0, 0} //somme des pixels

	for i := 0; i < arrSize; i++ {
		Psum[0] += quad[i][0]
		Psum[1] += quad[i][1]
		Psum[2] += quad[i][2]
	}
	arrSize32 := uint32(arrSize)
	avgPixel := [3]uint32{Psum[0] / arrSize32, Psum[1] / arrSize32, Psum[2] / arrSize32}

	return avgPixel
}

func quad_std(quad [][3]uint32, avgPixel [3]uint32) float64 {
	// renvoie l'écart type d'un quadrant
	var arrSize int = len(quad)
	Psum := [3]uint32{0, 0, 0}

	for i := 0; i < arrSize; i++ {
		Psum[0] += quad[i][0] * quad[i][0]
		Psum[1] += quad[i][1] * quad[i][1]
		Psum[2] += quad[i][2] * quad[i][2]
	}
	Rvar := Psum[0]/uint32(arrSize) - avgPixel[0]*avgPixel[0]
	Gvar := Psum[1]/uint32(arrSize) - avgPixel[1]*avgPixel[1]
	Bvar := Psum[2]/uint32(arrSize) - avgPixel[2]*avgPixel[2]

	return math.Sqrt(float64(Rvar + Gvar + Bvar))
}

func minIdArray(myArr []float64) int {
	// renvoie l'indice de la valeur minimale d'une liste de nombre
	var arrSize int = len(myArr)
	var mini float64 = myArr[0]
	var idMini int = 0

	for i := 1; i < arrSize; i++ {
		if mini > myArr[i] {
			mini = myArr[i]
			idMini = i
		}
	}
	return idMini
}

func kuwahara(px int, py int, kernelSize int, imgSrc image.Image) color.NRGBA64 {
	//renvoie: un pixel dont la valeur est la moyenne du quadrant avec l'écart-type minimum
	var means [4][3]uint32
	var stds [4]float64
	quadrants := get_quads(px, py, kernelSize, imgSrc)

	for k, v := range quadrants {
		means[k] = quad_avg_pixel(v)
		stds[k] = quad_std(v, means[k])
	}
	qId := minIdArray(stds[:])

	return color.NRGBA64{uint16(means[qId][0]), uint16(means[qId][1]), uint16(means[qId][2]), math.MaxUint16}
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
			resultat <- accompli{kuwahara(i, emploi.ligne, 10, *(emploi.pImage)), i, emploi.ligne}
		}
	}
}

func main() {
	//Ouverture du fichier et création de la matrice
	fileImg, err := os.Open("C:\\Users\\solen\\Documents\\GitHub\\ELP_G17\\projet Go\\Titi.jpg")
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
	for w := 1; w <= 3; w++ {
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
	/*for i := 0; i < imgWidth; i++ {
		for j := 0; j < imgHeight; j++ {
			imgOut.Set(i, j, kuwahara(i, j, 10, imgSrc))
		}
	}*/
	fileOut, err3 := os.Create("res.jpg")
	ferror(err3)
	defer fileOut.Close()

	//édition du nouveau fichier
	var opt jpeg.Options
	opt.Quality = 80
	err4 := jpeg.Encode(fileOut, imgOut, &opt)
	ferror(err4)

}
