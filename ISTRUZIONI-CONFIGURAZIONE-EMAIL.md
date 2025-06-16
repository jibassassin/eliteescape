# 📧 Guida Configurazione Sistema Email - Elite Escape

## 🎯 Panoramica
Questa guida ti aiuterà a configurare il sistema di invio email per le richieste di prenotazione del catamarano utilizzando EmailJS.

## 📋 Prerequisiti
- Account EmailJS gratuito
- Template email configurato su EmailJS
- Servizio email (Gmail, Outlook, etc.)

---

## 🚀 STEP 1: Creazione Account EmailJS

1. **Registrati su EmailJS**
   - Vai su [https://www.emailjs.com/](https://www.emailjs.com/)
   - Clicca "Sign Up" e crea un account gratuito
   - Conferma l'email di verifica

2. **Piano Gratuito**
   - 200 email gratuite al mese
   - Perfetto per iniziare

---

## 📨 STEP 2: Configurazione Servizio Email

1. **Accedi alla Dashboard EmailJS**
   - Vai su "Email Services" nel menu laterale
   - Clicca "Add New Service"

2. **Scegli Provider Email**
   - **Gmail**: Più semplice da configurare
   - **Outlook**: Alternativa valida
   - **Altri**: SMTP personalizzato

3. **Configurazione Gmail** (Consigliato)
   - Seleziona "Gmail"
   - Clicca "Connect Account"
   - Autorizza EmailJS ad accedere al tuo account Gmail
   - **IMPORTANTE**: Usa un account Gmail dedicato per le prenotazioni (es. `prenotazioni@eliteescape.it`)

4. **Salva Configurazione**
   - Annota il **Service ID** (es. `service_abc123`)
   - Serve per la configurazione admin

---

## 📝 STEP 3: Creazione Template Email

1. **Vai su "Email Templates"**
   - Clicca "Create New Template"

2. **Configurazione Base Template**
   ```
   Template Name: Prenotazione Catamarano Elite Escape
   Subject: Nuova Richiesta Prenotazione - {{catamaran_name}}
   From Email: prenotazioni@eliteescape.it
   From Name: Elite Escape Prenotazioni
   To Email: {{to_email}}
   ```

3. **Content Template**
   - Copia il contenuto del file `template-email-prenotazione.html`
   - Incolla nell'editor EmailJS
   - Verifica che tutte le variabili `{{variabile}}` siano presenti

4. **Variabili Template Utilizzate**
   ```
   {{catamaran_name}}
   {{catamaran_year}}
   {{catamaran_details}}
   {{client_name}}
   {{client_email}}
   {{client_phone}}
   {{client_nationality}}
   {{selected_week}}
   {{number_of_guests}}
   {{checkin_info}}
   {{checkout_info}}
   {{selected_services}}
   {{base_price}}
   {{services_total}}
   {{discount_info}}
   {{final_total}}
   {{navigation_experience}}
   {{special_notes}}
   {{newsletter_subscription}}
   {{booking_timestamp}}
   {{booking_source}}
   {{to_email}}
   ```

5. **Test Template**
   - Clicca "Test" per verificare il template
   - Invia una email di prova
   - Controlla che arrivi correttamente

6. **Salva Template**
   - Annota il **Template ID** (es. `template_xyz789`)

---

## 🔑 STEP 4: Ottenere Public Key

1. **Vai su "Account" > "General"**
2. **Trova "Public Key"**
   - È una stringa tipo `user_abcdefghijklmnop`
   - Annota questa chiave

---

## ⚙️ STEP 5: Configurazione Admin Panel

1. **Apri Admin Panel**
   - Vai su `Admin-Configurazione-Catamarano.html`
   - Scorri fino alla sezione "Email & Call-to-Action"

2. **Inserisci Dati EmailJS**
   ```
   ✅ Abilita sistema invio email
   Service ID: service_abc123
   Template ID: template_xyz789
   Public Key: user_abcdefghijklmnop
   Email Destinatario: prenotazioni@eliteescape.it
   ```

3. **Configura Template**
   - Oggetto Email: `Nuova Richiesta Prenotazione Catamarano - {catamaran_name}`
   - Seleziona tutti i campi da includere
   - ✅ Abilita risposta automatica (opzionale)

4. **Personalizza CTA**
   - Testo Pulsante: `Invia Richiesta di Prenotazione`
   - Sottotesto: Personalizza il messaggio

5. **Salva Configurazione**
   - Clicca "Salva Modifiche"

---

## 🧪 STEP 6: Test Completo

1. **Test Admin Panel**
   - Vai alla pagina admin
   - Verifica che tutti i campi siano compilati
   - Controlla l'anteprima CTA

2. **Test Pagina Prenotazione**
   - Vai su `prenotazione_violante.html`
   - Compila tutti i campi obbligatori
   - Seleziona date e servizi
   - ✅ Accetta termini e condizioni
   - Clicca "Invia Richiesta di Prenotazione"

3. **Verifica Email**
   - Controlla che l'email arrivi a `prenotazioni@eliteescape.it`
   - Verifica che tutti i dati siano presenti
   - Controlla formattazione e layout

---

## 🛠️ Risoluzione Problemi

### ❌ "Sistema di invio email non configurato"
- Verifica che il checkbox "Abilita sistema invio email" sia attivato
- Controlla che Service ID, Template ID e Public Key siano inseriti

### ❌ "Configurazione EmailJS incompleta"
- Verifica Service ID e Template ID nell'admin panel
- Controlla che corrispondano ai valori su EmailJS

### ❌ Email non arriva
- Controlla spam/promozioni
- Verifica che l'email destinatario sia corretta
- Controlla log console del browser (F12)

### ❌ Errore invio EmailJS
- Verifica connessione internet
- Controlla limiti account EmailJS (200 email/mese)
- Verifica che il template sia pubblicato

---

## 📊 Monitoraggio

1. **Dashboard EmailJS**
   - Monitora numero email inviate
   - Controlla statistiche di consegna
   - Verifica utilizzo quota

2. **Log Browser**
   - Apri DevTools (F12)
   - Vai su "Console"
   - Monitora log del sistema email

---

## 🔒 Sicurezza

1. **Public Key EmailJS**
   - È sicura da includere nel codice frontend
   - Non permette invii non autorizzati
   - Limitata al dominio configurato

2. **Email Account**
   - Usa account dedicato per prenotazioni
   - Non condividere credenziali
   - Abilita autenticazione a due fattori

---

## 📈 Espansioni Future

1. **Risposta Automatica Cliente**
   - Configura secondo template per conferma al cliente
   - Personalizza messaggio di ringraziamento

2. **Notifiche Multiple**
   - Invia copie a più destinatari
   - Notifiche SMS tramite servizi esterni

3. **Integrazione CRM**
   - Connetti a sistemi di gestione clienti
   - Automatizza follow-up

---

## 📞 Supporto

- **EmailJS Docs**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **EmailJS Support**: support@emailjs.com
- **Console Browser**: F12 per debug

---

## ✅ Checklist Configurazione

- [ ] Account EmailJS creato
- [ ] Servizio email configurato (Gmail/Outlook)
- [ ] Template email creato con tutte le variabili
- [ ] Service ID, Template ID, Public Key ottenuti
- [ ] Admin panel configurato
- [ ] Test completo effettuato
- [ ] Email di prova ricevuta correttamente
- [ ] Sistema pronto per produzione

**🎉 Congratulazioni! Il sistema email è configurato e funzionante!**