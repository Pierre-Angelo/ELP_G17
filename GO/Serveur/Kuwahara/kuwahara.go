package kuwahara

import (
	"image"
	"image/color"
	"math"
)

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

func get_quads(px int, py int, kernelSize int, imgSrc image.RGBA) [][][3]uint32 {
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

func Kuwahara(px int, py int, kernelSize int, imgSrc image.RGBA) color.NRGBA64 {
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
