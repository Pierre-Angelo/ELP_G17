function cree_joueur(){
    joueur = {
        tapis : [], // contient des mots
        lettres : [], //contient des caractères
        aff_tapis : function(){
            res = "      9  16 25 36 49 64 81\n"
            for(mot of this.tapis){
                for (lettre of mot){
                    res += lettre + "  "
                }
                res += "\n"
            }
            console.log(res)
        }
    
    }

    return joueur
}

ja = cree_joueur()
ja.tapis=["bonjour","aurevoire","salut"]
ja.aff_tapis()
    


