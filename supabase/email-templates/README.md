# Configuration des emails Supabase

## Comment configurer les templates d'email

1. Allez dans votre projet Supabase
2. Cliquez sur **Authentication** dans le menu de gauche
3. Allez dans l'onglet **Email Templates**

## Templates disponibles

### Magic Link (Connexion sans mot de passe)

**Fichier:** `magic-link.html`

**À coller dans:** Authentication > Email Templates > Magic Link

**Subject (Objet):**
```
🎉 Connexion - Yvonne fête ses 60 ans
```

---

### Invitation

**Fichier:** `invite.html`

**À coller dans:** Authentication > Email Templates > Invite User

**Subject (Objet):**
```
💌 Vous êtes invité(e) aux 60 ans d'Yvonne à Marrakech !
```

---

## Variables disponibles

Ces variables sont remplacées automatiquement par Supabase :

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | URL de confirmation/connexion |
| `{{ .Token }}` | Token de confirmation |
| `{{ .TokenHash }}` | Hash du token |
| `{{ .SiteURL }}` | URL de votre site |
| `{{ .Email }}` | Email de l'utilisateur |

## Configuration SMTP (optionnel mais recommandé)

Pour un meilleur taux de délivrabilité, configurez un SMTP personnalisé :

1. Allez dans **Project Settings** > **Authentication**
2. Dans la section **SMTP Settings**, activez "Enable Custom SMTP"
3. Configurez avec vos identifiants (ex: SendGrid, Mailgun, Resend, etc.)

### Exemple avec Resend

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: re_votre_api_key
Sender email: noreply@votredomaine.com
Sender name: Yvonne 60 ans - Marrakech
```

## Test

Pour tester vos emails :
1. Allez sur votre page de connexion
2. Entrez une vraie adresse email
3. Vérifiez que l'email arrive et que le design est correct

