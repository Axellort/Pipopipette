# Pipopipette

Jeu Pipopipette en HTML  
EXTERNAL LINKS :  
[Présentation 1](https://onedrive.live.com/edit.aspx?action=editnew&resid=1189E2882A3D290D!587&ithint=file%2cpptx&action=editnew&wdNewAndOpenCt=1666799397519&wdPreviousSession=5699109f-2c6b-49ea-ba15-67e150ef528d&wdOrigin=OFFICECOM-WEB.MAIN.NEW)  
[Color Palette](https://coolors.co/253ee7-f55139-1a1423-faebd7-3ab795)  

1 Un joueur, les cases se colorient bien ✅ 

2 Deux joueurs en local ✅

2.5 Multijoueur en local  🟧 (on passe directement en pas local)

3 Multijoueur ◻️ (bon pour 3, 4, 5 mais pas pour n)

3.1 Matchmaking ◻️ (en cours)

3.7 Mobile Support

4 IA 

5 Modes supplémentaires : temps, forme des cases, condition de victoire


Status : système pour deux joueurs marche, score et coloriage des cases,
        Rajouter plus de joueurs en local on skip
        écran de sélection des modes par Adam
        Où gérer les infos du multijoueur en WebSocket ? sur le client tout
        Comment implémenter un matchmaking ? création de rooms en cours (voir Figma)
        Adam + Ax peuvent déjà se mettre sur l'algo / IA

        Le Multijoueur : marche à 2/3/4/5 joueurs en lignes
                TODO :  - faire marcher pour n joueurs (TODO ( ADAM ? ))
                        - afficher l'identifiant du joueur (ADAM)
                        - montrer clairement la case jouée par l'adversaire (RETOUCHE GRAPHIQUE)
                        - préciser le tour de qui c'est (ADAM)
                        - bouton pour lancer une partie, qui redonne des ids et lance la game avec tous ceux connectés (TODO)
                        - merge avec le code normal pour les côtés qui appartiennent à une seule personne et pour le plus de 3 joueurs (GIT WORK)
                        

STATUS : on peut créer nos propres rooms sur le /menu (DONE)
        mais j'ai du désactiver le "default", parce qu'en se connectant aux autres parties on passait dessus et yavait des merdes au niveau du nombre de joueurs (TO REPAIR)
        on peut pas paramétrer sa partie pour l'instant (TODO)
