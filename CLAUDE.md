# Elite Escape - Catamarano Violante

Sistema di prenotazione online per catamarano in Sardegna. Sviluppato con HTML5, Tailwind CSS, Supabase e EmailJS.

## 🚀 Deploy
- **Hosting**: Netlify
- **Branch principale**: `master` (ex working-from-v1)
- **Deploy automatico**: Push su master → Deploy live
- **URL principale**: index.html (ex prenotazione_violante.html)

## 📁 File Principali
- `index.html` - Pagina prenotazione clienti
- `Admin-Configurazione-Catamarano.html` - Panel amministratore
- `catamaran-config.js` - Configurazione catamarani
- `supabase-client.js` - Client database Supabase
- `auth-manager.js` - Gestione autenticazione admin
- `storage-wrapper.js` - Wrapper localStorage
- `template-email-prenotazione.html` - Template email prenotazioni

## 🛠️ Tecnologie
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS 3.4.16
- **Database**: Supabase con RLS policies
- **Email**: EmailJS
- **Storage**: localStorage per configurazioni
- **Fonts**: Google Fonts (Playfair Display, Raleway, Pacifico)
- **Icons**: RemixIcon 4.6.0

## ⚙️ Configurazione
### Database Supabase
- Seguire `RLS_SETUP_INSTRUCTIONS.md`
- Configurare policy RLS per sicurezza tabelle

### Email EmailJS
- Seguire `ISTRUZIONI-CONFIGURAZIONE-EMAIL.md`
- Configurare Service ID, Template ID, Public Key nel panel admin

## 📊 Versione Attuale: V23
- ✅ Sistema autenticazione admin completo
- ✅ Loading screen UX implementato
- ✅ Integrazione Supabase completa con RLS
- ✅ Campi admin dinamici
- ✅ Sistema calendario prezzi settimanali
- ✅ Gestione servizi aggiuntivi e obbligatori
- ✅ Sconto Instagram gestibile da admin
- ✅ Logo management system
- ✅ Call-to-Action con sistema email funzionale
- ✅ Deploy automatico Netlify

## 🔧 Sviluppo
1. Aprire `index.html` per pagina prenotazioni
2. Aprire `Admin-Configurazione-Catamarano.html` per admin panel
3. Testare funzionalità con file `test-*.html` se necessario

## 📝 Note Sviluppo
- File di backup disponibili (*-BACKUP-*, *-OLD-*, *-BROKEN-*)
- File di test mantenuti per reference (*test-*.html)
- Branch `iniziale` contiene versione base
- Branch `step1-storage` e `step2-booking-integration` per riferimento

## 🚨 Problemi Noti
- Loading screen con bypass di emergenza implementato (1000ms timeout)

## 📞 Supporto
- Repository: https://github.com/jibassassin/eliteescape
- Issues per bug reports e feature requests