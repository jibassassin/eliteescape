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
    console.error('Supabase JS non caricato');
    return null;
  }
  
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Errore inizializzazione Supabase:', error);
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

      // CONTROLLO AUTENTICAZIONE RLS
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) {
        resolve({ success: false, error: 'Autenticazione richiesta per salvare le configurazioni' });
        return;
      }

      // Controlla dimensione config per debug
      const configSize = JSON.stringify(config).length;
      if (configSize > 1000000) { // >1MB
        console.warn('Configurazione molto grande, potrebbe fallire');
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

      // Genera timestamp versione per cache busting
      const version = Date.now();
      const versionedConfig = {
        version: version,
        data: config,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existing && existing.length > 0) {
        // Aggiorna configurazione esistente
        result = await client
          .from('configurations')
          .update({ 
            config_data: versionedConfig
          })
          .eq('id', existing[0].id);
      } else {
        // Inserisci nuova configurazione
        result = await client
          .from('configurations')
          .insert([{ 
            config_data: versionedConfig,
            created_by: session.user.id
          }]);
      }

      if (result.error) {
        console.error('Errore Supabase:', result.error);
        if (result.error.code === '42501') {
          console.error('ERRORE RLS: Policy non configurata. Vai su Dashboard Supabase → SQL Editor e esegui:');
          console.error('CREATE POLICY "Lettura pubblica configurazioni" ON public.configurations FOR SELECT USING (true);');
          console.error('CREATE POLICY "Scrittura solo admin autenticati" ON public.configurations FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));');
        }
        resolve({ success: false, error: result.error.message, details: result.error, needsRLSSetup: result.error.code === '42501' });
      } else {
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

      // CONTROLLO AUTENTICAZIONE RLS (per accesso admin)
      const { data: { session } } = await client.auth.getSession();

      const { data, error } = await client
        .from('configurations')
        .select('config_data, id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Errore caricamento Supabase (potrebbero mancare policy RLS):', error.message);
        resolve({ success: false, error: error.message, needsRLSSetup: true });
      } else if (data && data.length > 0) {
        const configData = data[0].config_data;
        
        // Gestisce nuovo formato con versioning
        if (configData.version && configData.data) {
          resolve({ 
            success: true, 
            config: configData.data,
            version: configData.version,
            updated_at: configData.updated_at,
            configId: data[0].id
          });
        } else {
          // Compatibilità con formato precedente
          resolve({ 
            success: true, 
            config: configData,
            version: 0,
            configId: data[0].id
          });
        }
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

      const { data, error } = await client
        .from('configurations')
        .select('config_data, id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        resolve({ success: false, error: error.message });
      } else if (data && data.length > 0) {
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

// Funzione per check versione leggero (solo version e timestamp)
function checkConfigVersion() {
  return new Promise(async (resolve) => {
    try {
      const client = initializeSupabase();
      if (!client) {
        resolve({ success: false, error: 'Client non inizializzato' });
        return;
      }

      // Query leggera: solo config_data per estrarre version e updated_at
      const { data, error } = await client
        .from('configurations')
        .select('config_data')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        resolve({ success: false, error: error.message });
      } else if (data && data.length > 0) {
        const configData = data[0].config_data;
        const version = configData?.version || 0;
        const updated_at = configData?.updated_at;
        
        resolve({ 
          success: true, 
          version: version,
          updated_at: updated_at
        });
      } else {
        resolve({ success: true, version: 0 });
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
  checkVersion: checkConfigVersion,
  isReady: () => {
    const client = initializeSupabase();
    return client !== null;
  }
};

