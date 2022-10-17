# Pipopipette

Jeu Pipopipette en HTML

1 Un joueur, les cases se colorient bien ✅
2 Deux joueurs en local ✅
2.5 Multijoueur en local  🟧 (on passe directement en pas local)
3 Multijoueur ◻️ (bon pour 3, 4, 5 mais pas pour n)
3.1 Matchmaking ◻️ (en cours)
3.7 Mobile Support
4 IA 
5 Modes supplémentaires : temps, forme des cases, condition de victoire


Status : système pour deux joueurs marche, score et coloriage des cases,
        Rajouter plus de joueurs en local devrait pas être trop compliqué
        écran de sélection des modes par Adam
        Où gérer les infos du multijoueur en WebSocket ?
        Comment implémenter un matchmaking ?
        Adam + Ax peuvent déjà se mettre sur l'algo / IA

        Le Multijoueur : marche à deux joueurs en ligne, mais
                besoin de seulement deux connections au websocket
                TODO :  - afficher l'identifiant du joueur
                        - montrer clairement la case jouée par l'adversaire
                        - préciser le tour de qui c'est
                        - bouton pour lancer une partie, qui redonne des ids et lance la game avec tous ceux connectés
                        - merge avec le code normal pour les côtés qui appartiennent à une seule personne et pour le plus de 3 joueurs.
                        