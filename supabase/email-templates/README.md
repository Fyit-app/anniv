# Configuration des emails Supabase

## Comment configurer les templates d'email

1. Allez dans votre projet Supabase
2. Cliquez sur **Authentication** dans le menu de gauche
3. Allez dans l'onglet **Email Templates**

## Templates disponibles

### OTP (Code de connexion à 6 chiffres) ⭐ RECOMMANDÉ

**Fichier:** `otp.html`

**À coller dans:** Authentication > Email Templates > Magic Link

**Subject (Objet):**
```
🔐 Votre code de connexion - Yvonne 60 ans
```

**Note importante:** Ce template affiche un code à 6 chiffres au lieu d'un lien. L'utilisateur doit saisir ce code sur la page `/verify`.

---

### Magic Link (Connexion par lien - ANCIEN)

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
| `{{ .Token }}` | Code OTP à 6 chiffres |
| `{{ .TokenHash }}` | Hash du token |
| `{{ .SiteURL }}` | URL de votre site |
| `{{ .Email }}` | Email de l'utilisateur |

## Configuration pour OTP

Pour que l'authentification OTP fonctionne correctement :

### 1. Configuration Supabase

1. Allez dans **Authentication** > **Providers**
2. Dans la section **Email**, assurez-vous que "Enable Email provider" est activé
3. Vérifiez que "Confirm email" est configuré correctement

### 2. Rate Limiting

Par défaut, Supabase limite les envois d'OTP. Vous pouvez ajuster dans :
- **Authentication** > **Rate Limits**

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

## Flux d'authentification OTP

1. L'utilisateur entre son email sur `/login`
2. Supabase envoie un code OTP à 6 chiffres
3. L'utilisateur est redirigé vers `/verify`
4. L'utilisateur saisit le code
5. Après validation :
   - Si onboarding non complété → `/onboarding`
   - Sinon → `/dashboard` (avec WelcomeModal si première connexion)

## Test

Pour tester vos emails :
1. Allez sur `/login`
2. Entrez une vraie adresse email
3. Vérifiez que l'email arrive avec le code OTP
4. Saisissez le code sur `/verify`
