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
            config_data: config
          }]);
      }

      if (result.error) {
        console.error('❌ Errore dettagliato Supabase:', result.error);
        resolve({ success: false, error: result.error.message, details: result.error });
      } else {
        console.log('✅ Salvataggio Supabase completato');
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

      const { data, error } = await client
        .from('configurations')
        .select('config_data')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        resolve({ success: false, error: error.message });
      } else if (data && data.length > 0) {
        resolve({ success: true, config: data[0].config_data });
      } else {
        resolve({ success: true, config: null }); // Nessuna configurazione trovata
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
  isReady: () => {
    const client = initializeSupabase();
    return client !== null;
  }
};

console.log('📦 Supabase client module caricato');