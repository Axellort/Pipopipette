# Pipopipette

Jeu Pipopipette en HTML  
EXTERNAL LINKS :  
[Présentation 1](https://onedrive.live.com/edit.aspx?action=editnew&resid=1189E2882A3D290D!587&ithint=file%2cpptx&action=editnew&wdNewAndOpenCt=1666799397519&wdPreviousSession=5699109f-2c6b-49ea-ba15-67e150ef528d&wdOrigin=OFFICECOM-WEB.MAIN.NEW)  
[Color Palette](https://coolors.co/253ee7-f55139-1a1423-faebd7-3ab795)

1 Un joueur, les cases se colorient bien ✅

2 Deux joueurs en local ✅

2.5 Multijoueur en local ✅

3 Multijoueur en ligne ◻️ (bon pour n en local, restreint à 2 joueurs en ligne)

3.1 Matchmaking ◻️ (en cours)

3.7 Mobile Support

4 IA

5 Modes supplémentaires : temps, forme des cases, condition de victoire

Status : système pour deux joueurs marche, score et coloriage des cases,
Rajouter plus de joueurs en local DONE
écran de sélection des modes DONE
Où gérer les infos du multijoueur en WebSocket ? sur le client tout
Comment implémenter un matchmaking ? création de rooms en cours
Adam + Ax peuvent déjà se mettre sur l'algo / IA

        Le Multijoueur : marche à 2/3/4/5 joueurs en ligne
                TODO :  - faire marcher pour n joueurs DONE
                        - afficher l'identifiant du joueur DONE
                        - montrer clairement la case jouée par l'adversaire (RETOUCHE GRAPHIQUE) DONE
                        - préciser le tour de qui c'est DONE
                        - bouton pour lancer une partie, qui redonne des ids et lance la game avec tous ceux connectés (TODO)
                        - gérer la déconnexion / reconnexion (TODO)
                        - game /?game= qui serait comme une pixel war ?

STATUS : on peut créer nos propres rooms sur le / (DONE)
on peut pas paramétrer sa partie pour l'instant sauf si en local (TODO)
on peut pas se déconnecter / reconnecter (TODO)
