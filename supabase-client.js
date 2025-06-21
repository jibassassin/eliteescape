// Configurazione Supabase per Elite Escape
// File standalone - NON modificare altri file finché questo non è testato

const SUPABASE_CONFIG = {
  url: 'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
};

// Client Supabase - inizializzazione lazy
let supabaseClient = null;

// Funzione per inizializzare Supabase
function initializeSupabase() {
  if (supabaseClient) return supabaseClient;
  
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase JS non caricato');
    return null;
  }
  
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✓ Supabase client inizializzato');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Errore inizializzazione Supabase:', error);
    return null;
  }
}

// Funzione di test connessione - SINCRONA con Promise
function testSupabaseConnection() {
  return new Promise(async (resolve) => {
    try {
      const client = initializeSupabase();
      if (!client) {
        resolve({ success: false, error: 'Client non inizializzato' });
        return;
      }

      // Test semplice: select da configurations
      const { data, error } = await client
        .from('configurations')
        .select('id')
        .limit(1);

      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        resolve({ success: true, data });
      }
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// Funzione per salvare configurazione - SINCRONA con Promise
function saveConfigToSupabase(config) {
  return new Promise(async (resolve) => {
    try {
      const client = initializeSupabase();
      if (!client) {
        resolve({ success: false, error: 'Client non inizializzato' });
        return;
      }

      // 🔐 CONTROLLO AUTENTICAZIONE RLS
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) {
        console.warn('🚫 Tentativo di salvataggio senza autenticazione');
        resolve({ success: false, error: 'Autenticazione richiesta per salvare le configurazioni' });
        return;
      }

      console.log('🔑 Utente autenticato per salvataggio:', session.user.email);

      // Controlla dimensione config per debug
      const configSize = JSON.stringify(config).length;
      console.log(`📊 Dimensione configurazione: ${(configSize / 1024).toFixed(1)}KB`);
      
      if (configSize > 1000000) { // >1MB
        console.warn('⚠️ Configurazione molto grande, potrebbe fallire');
      }

      // Verifica se esiste già una configurazione
      const { data: existing, error: selectError } = await client
        .from('configurations')
        .select('id')
        .limit(1);

      if (selectError) {
        resolve({ success: false, error: selectError.message });
        return;
      }

      let result;
      if (existing && existing.length > 0) {
        // Aggiorna configurazione esistente
        result = await client
          .from('configurations')
          .update({ 
            config_data: config
          })
          .eq('id', existing[0].id);
      } else {
        // Inserisci nuova configurazione
        result = await client
          .from('configurations')
          .insert([{ 
            config_data: config,
            created_by: session.user.id
          }]);
      }

      if (result.error) {
        console.error('❌ Errore dettagliato Supabase:', result.error);
        if (result.error.code === '42501') {
          console.error('🚫 ERRORE RLS: Policy non configurata. Vai su Dashboard Supabase → SQL Editor e esegui:');
          console.error('CREATE POLICY "Lettura pubblica configurazioni" ON public.configurations FOR SELECT USING (true);');
          console.error('CREATE POLICY "Scrittura solo admin autenticati" ON public.configurations FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));');
        }
        resolve({ success: false, error: result.error.message, details: result.error, needsRLSSetup: result.error.code === '42501' });
      } else {
        console.log('✅ Salvataggio Supabase completato con RLS');
        resolve({ success: true, data: result.data });
      }
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// Funzione per caricare configurazione - SINCRONA con Promise
function loadConfigFromSupabase() {
  return new Promise(async (resolve) => {
    try {
      const client = initializeSupabase();
      if (!client) {
        resolve({ success: false, error: 'Client non inizializzato' });
        return;
      }

      // 🔐 CONTROLLO AUTENTICAZIONE RLS (per accesso admin)
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) {
        console.log('📖 Caricamento pubblico configurazione (modalità guest)');
      } else {
        console.log('🔑 Utente autenticato per caricamento:', session.user.email);
      }

      const { data, error } = await client
        .from('configurations')
        .select('config_data, id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('⚠️ Errore caricamento Supabase (potrebbero mancare policy RLS):', error.message);
        resolve({ success: false, error: error.message, needsRLSSetup: true });
      } else if (data && data.length > 0) {
        console.log('📥 Configurazione caricata da Supabase con RLS');
        resolve({ 
          success: true, 
          config: data[0].config_data,
          configId: data[0].id
        });
      } else {
        resolve({ success: true, config: null }); // Nessuna configurazione trovata
      }
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// Funzione per forzare il refresh della configurazione
function forceRefreshConfig() {
  return new Promise(async (resolve) => {
    try {
      const client = initializeSupabase();
      if (!client) {
        resolve({ success: false, error: 'Client non inizializzato' });
        return;
      }

      console.log('🔄 Refresh forzato configurazione da Supabase...');

      const { data, error } = await client
        .from('configurations')
        .select('config_data, id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        resolve({ success: false, error: error.message });
      } else if (data && data.length > 0) {
        console.log('✅ Refresh completato - configurazione aggiornata');
        resolve({ 
          success: true, 
          config: data[0].config_data,
          configId: data[0].id,
          refreshed: true
        });
      } else {
        resolve({ success: true, config: null });
      }
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// Oggetto pubblico per l'accesso alle funzioni
window.SupabaseManager = {
  test: testSupabaseConnection,
  save: saveConfigToSupabase,
  load: loadConfigFromSupabase,
  refresh: forceRefreshConfig,
  isReady: () => {
    const client = initializeSupabase();
    return client !== null;
  }
};

console.log('📦 Supabase client module caricato');