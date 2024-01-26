const prompt = require('prompt-sync')({sigint: true});

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
                res += "\n";
            }
            console.log(res)
        },
        aff_lettres : function(){
            res = "Voici vos lettre à disposition : "
            for (lettre of this.lettres){
                res += lettre + " ";
            }
            console.log(res);
        },
        entrer_mot :  function(){
            return prompt("Entrez votre mot : ");
        }
    
    }

    return joueur
}

ja = cree_joueur()
ja.tapis=["bonjour","aurevoire","salut"]
ja.lettres=["E","R","A","F","G"]

console.log(ja.entrer_mot())
