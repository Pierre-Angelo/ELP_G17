Bienvenue dans le projet de Golang du groupe 17.

Le projet que nous avous réalisé permet d'appliquer le filtre Kuwahara sur une image au format JPEG.

Utilisation : 
    Etape 1 : placer une image JPEG dans le dossier Client. Si vous n'en avez pas il y a déjà deux images pouvant être utilisées.
    Etape 2 : ouvrir un terminal de commande dans le dossier Serveur et un autre dans le dossier Client.
    Etape 3 : Compiler les executables : écrire "go build Serveur.go" dans le premier terminal et "go build Client.go" dans le second.
    Etape 4 : lancer d'abord l'executable du server dans le premier terminal puis celui du client dans le second.
    Etape 5 : dans le deuxième terminal, renseigner le nom de l'image à traiter (avec le .jpg) et appuyer sur la touche entrée.
    Etape 6 : renseigner dans le même terminal le nom du fichier image en sortie (avec le .jpg) et appuyer sur la touche entrée.
    Etape 7 : attendre quelques secondes que le traitement se fasse puis récupérer l'image dans le dossier Client.

Structure :
    Client : un seul fichier (Client.go) permettant de récupérer, d'encoder, d'envoyer une image JPEG ainsi que recevoir et créer l'image modifiée.
    Serveur :
        Serveur.go : crée les sessions clients pour recevoir les images et les traiter ainsi que la worker pool.
        Worker.go  : contient les fonctions pour créer un worker et gérer le paraléllisme.
        Kuwahara.go: contient les fonctions permettant d'appliquer le filtre.





