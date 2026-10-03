# AFRIG TREND — Agent IA WhatsApp

Starter complet pour connecter l'Agent IA AFRIG TREND à WhatsApp Cloud API.

## Ce que le projet fait

- Reçoit les messages WhatsApp via un webhook.
- Envoie le message à l'Agent IA.
- Utilise les 6 produits AFRIG TREND fournis dans la conversation.
- Répond automatiquement au client.
- Conserve une petite mémoire de conversation en mémoire du serveur.
- Envoie la réponse au client via WhatsApp Cloud API.

## Installation

1. Installer Node.js 20+.
2. Copier `.env.example` vers `.env`.
3. Ajouter une clé OpenAI.
4. Créer/configurer une application Meta avec WhatsApp Cloud API.
5. Renseigner le token WhatsApp, le Phone Number ID et la version Graph API actuelle dans `.env`.
6. Installer:
   `npm install`
7. Démarrer:
   `npm start`

## Webhook Meta

URL:
`https://TON-DOMAINE/webhook`

Verify Token:
la valeur de `WHATSAPP_VERIFY_TOKEN`.

Le serveur doit être accessible en HTTPS pour la configuration réelle du webhook.

## Important

Ce projet est un starter technique. Il n'est pas encore déployé et ne peut pas répondre aux clients tant que les identifiants OpenAI/Meta et l'hébergement ne sont pas configurés.

Avant mise en production:
- remplacer la mémoire Map par une vraie base de données;
- ajouter gestion des stocks;
- ajouter prise de commande structurée;
- ajouter journalisation et monitoring;
- ajouter validation humaine pour les cas sensibles;
- tester les politiques de fenêtre de messagerie et les modèles de messages WhatsApp de Meta.
