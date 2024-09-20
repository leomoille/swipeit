# Swipe It 👆

Une web app simple, dans laquelle on peut jouer à dire si telle ou telle situation est drôle ou pas.

## Installation en local

Pour ça, tu vas forcément avoir besoin de node. Si tu l'as pas, pas possible d'aller plus loin. Désolé 🥹

### Récupérer le projet

Ok, première étape, tu clone le projet ou tu veux sur ta machine.

```bash
git clone https://github.com/leomoille/swipeit.git
```

Tu as récupéré les sources ? Top, on passe à la suite.

### Installer les dépendances

Je t'avais dit qu'on avait besoin de node, alors c'est parti.

```bash
npm install
```

> Essaie d'être dans le dossier du projet pour lancer la commande, sinon ça sert pas à grand chose.

### Configurer les variables d'environnement

Copie le contenu du fichier `.env` dans un fichier `.env.local`.

Swipe It utilise Firebase (Firestore), Auth et Analytics.

Configure Auth pour permettre la connexion et l'inscription par mail/mot de passe.

Pour Firebase, les questions sont stockées dans :

`swipe-it > questions > questions`

Pour la structure des questions on reste simple :

```JSON
{
    "title": String,
    "liked": Int,
    "disliked": Int,
    "random": Float
}
```

### Démarer le serveur local

Une fois que tu as tout installé, tu peux lancer le serveur local.

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Après c'est tout indiqué dans ton terminal.

## Plus d'infos ?

- [Next.js Documentation](https://nextjs.org/docs) - La documentation de Next.
- [Learn Next.js](https://nextjs.org/learn) - Si tu as envie d'apprendre des trucs.
