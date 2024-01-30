

const is_still_going = function (mat1, mat2, letters) {
    let rows = 2;
    return (mat1.length < rows) && (mat2.length < rows) && (letters.length > 0);
}

const score = function (mat) {
    res = 0;
    for (let i = 0; i < mat.length; i++) {
        res = res + mat[i].length*mat[i].length;
    }
    return res;
}

const winner = function (mat1, mat2) {
    if (score(mat1) === score(mat2)) {
        return "Il y a égalité entre les deux joueurs.";
    } else if (score(mat1) > score(mat2)) {
        return "Le joueur 1 a gagné !";
    } else {
        return "Le joueur 2 a gagné !";
    }
}

module.exports = { winner, score, is_still_going };