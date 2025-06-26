# 🏖️ Elite Escape - Catamarano Violante

Sistema di prenotazione online per catamarano in Sardegna.

## 🚀 Live Demo
- **Sito Prenotazioni**: [prenotazione_violante.html](./prenotazione_violante.html)
- **Admin Panel**: [Admin-Configurazione-Catamarano.html](./Admin-Configurazione-Catamarano.html)

## 🛠️ Tecnologie
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Email**: EmailJS
- **Hosting**: Netlify

## 📁 Struttura Progetto
```
├── prenotazione_violante.html     # Pagina prenotazione clienti
├── Admin-Configurazione-Catamarano.html  # Pannello amministratore
├── catamaran-config.js            # Configurazione catamarani
├── supabase-client.js             # Client database
├── auth-manager.js                # Gestione autenticazione
├── storage-wrapper.js             # Wrapper storage
├── template-email-prenotazione.html  # Template email
└── test-*.html                    # File di test e debug
```

## ⚙️ Configurazione

### Database (Supabase)
1. Segui le istruzioni in `RLS_SETUP_INSTRUCTIONS.md`
2. Configura le policy RLS per sicurezza

### Email (EmailJS)
1. Segui la guida in `ISTRUZIONI-CONFIGURAZIONE-EMAIL.md`
2. Configura Service ID, Template ID, Public Key nel pannello admin

## 🚀 Deploy Automatico
- **Push su `master`** → Deploy automatico su Netlify
- **Preview branch** → Deploy di test automatico

## 📊 Versioni
- **V23**: Sistema autenticazione admin completo
- **V22**: Loading screen UX
- **V21**: Integrazione Supabase completa
- **V20**: Campi admin dinamici

## 🔧 Sviluppo Locale
1. Clona il repository
2. Apri `prenotazione_violante.html` nel browser
3. Per admin: apri `Admin-Configurazione-Catamarano.html`

## 📞 Supporto
- **Repository**: https://github.com/jibassassin/eliteescape
- **Issues**: Per bug reports e feature requests

---
🌊 **Elite Escape S.R.L** - Vacanze in Sardegna