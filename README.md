# henri-potier

Collection des livres d'Henri Potier en promotion exceptionnelle

# Source

Script de départ incluant react, redux/reduc-toolkit et typescript : npx create-react-app my-app --template redux-typescript
Dépendance supplémentaire :

- Sass (npm install -g sass)
- Axios (npm install axios)

# Installation

Après avoir cloné le projet, et en supposant que nodeJS et NPM sont déjà installés, il suffira de se placer dans le répertoire téléchargé et de lancer la commande npm install pour installer les bonnes dépendances.

# Application

Lancer la commande npm start ; l'application se lancera alors dans une nouvelle fenêtre de navigateur sur un port préalablement choisi.

L'écran se présente en 3 zones :

- la moitié droite qui affiche les différents livres par le scroll de la souris
- la partie gauche centrale qui affiche le contenu du panier ainsi que le résultat de la remise appliquée
- le coin en bas à gauche (loupe) qui propose un champ de recherche

# Code

Le choix de code s'est orienté sur un développement en react associé à une gestion d'état via Redux.
L'ajout de Redux-toolkit vient surcharger Redux afin d'en simplifier l'écriture
