# 🔐 Configurazione RLS (Row Level Security) per Elite Escape

## Problemi Identificati
1. ❌ `403 Forbidden` e `42501 new row violates row-level security policy` = **policy RLS non configurate**
2. ❌ `column configurations.updated_at does not exist` = **colonna mancante** 
3. ❌ Modifiche non sincronizzate tra browser = **manca refresh automatico**

## ✅ Soluzione: Eseguire queste SQL nel Dashboard Supabase

### 1. Vai su Dashboard Supabase
- URL: https://supabase.com/dashboard
- Progetto: Elite Escape
- Vai su **SQL Editor**

### 2. Esegui queste SQL queries nell'ordine:

```sql
-- 1. Policy per lettura pubblica (permette alla pagina prenotazione di leggere)
CREATE POLICY "Lettura pubblica configurazioni" ON public.configurations
FOR SELECT USING (true);
```

```sql
-- 2. Policy per scrittura solo admin autenticati
CREATE POLICY "Scrittura solo admin autenticati" ON public.configurations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);
```

### 3. Verifica Policy Attive
Prima di tutto, controlla le policy esistenti:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'configurations';
```

### 4. Se Policy Già Esistenti
Se ottieni errore `policy already exists`, usa questi comandi per sostituire:
```sql
-- Rimuovi policy esistenti se necessario
DROP POLICY IF EXISTS "Lettura pubblica configurazioni" ON public.configurations;
DROP POLICY IF EXISTS "Scrittura solo admin autenticati" ON public.configurations;

-- Ricrea policy corrette
CREATE POLICY "Lettura pubblica configurazioni" ON public.configurations
FOR SELECT USING (true);

CREATE POLICY "Scrittura solo admin autenticati" ON public.configurations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);
```

## 🎯 Risultato Atteso
- ✅ Pagina prenotazione: può leggere configurazioni senza login
- ✅ Admin autenticati: possono salvare/modificare configurazioni  
- ❌ Utenti non autenticati: NON possono modificare configurazioni

## 🚨 Se i problemi persistono
Prova questa policy alternativa più permissiva (temporaneamente):
```sql
-- Policy temporanea più permissiva per debug
CREATE POLICY "Debug - accesso completo autenticati" ON public.configurations
FOR ALL USING (auth.uid() IS NOT NULL);
```

## 📋 File Modificati per Gestire gli Errori
- `supabase-client.js`: ✅ Rimossa `updated_at` dalle query + messaggi di errore più chiari
- `storage-wrapper.js`: ✅ Gestione graceful degli errori RLS + funzione `forceRefresh()`
- `RLS_SETUP_INSTRUCTIONS.md`: Queste istruzioni

## 🔄 Nuove Funzionalità Anti-Desync
- **Refresh automatico**: `CatamaranStorage.forceRefresh()` per sincronizzare tra browser
- **Notifiche configurazione**: Callback automatici quando la config viene aggiornata

## 🧪 Test Dopo Setup RLS
1. Esegui le SQL nel Dashboard Supabase
2. Ricarica pagina admin - dovrebbe caricare senza errori `updated_at`
3. Salva una modifica - dovrebbe salvare senza errori `42501`
4. Apri altro browser - dovrebbe vedere le modifiche (con un piccolo delay)

Una volta eseguite le SQL, ricarica le pagine per testare.