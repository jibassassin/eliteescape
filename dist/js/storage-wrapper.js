// Wrapper per compatibilità tra localStorage e Supabase
// Mantiene l'API esistente ma aggiunge il supporto Supabase

// Flag per abilitare/disabilitare Supabase
let SUPABASE_ENABLED = true;
let SYNC_IN_PROGRESS = false;

// Estende CatamaranStorage con supporto Supabase
if (typeof CatamaranStorage !== 'undefined') {
  
  // Backup delle funzioni originali
  const originalSave = CatamaranStorage.save;
  const originalLoad = CatamaranStorage.load;
  
  // Funzione di salvataggio ibrida
  CatamaranStorage.save = function(config) {
    // Salva sempre in localStorage (fallback immediato)
    const localSuccess = originalSave.call(this, config);
    
    // Se Supabase è abilitato e disponibile, salva anche lì
    if (SUPABASE_ENABLED && window.SupabaseManager) {
      SYNC_IN_PROGRESS = true;
      
      // Salvataggio sincrono - attende il completamento
      window.SupabaseManager.save(config).then(response => {
        if (response.success) {
          // Notifica salvataggio completato
          if (typeof window.onSupabaseSaved === 'function') {
            window.onSupabaseSaved(config);
          }
        } else {
          console.warn('Errore sincronizzazione Supabase:', response.error);
          if (response.needsRLSSetup) {
            console.warn('CONFIGURAZIONE RICHIESTA: Vai su Dashboard Supabase per configurare le policy RLS');
          }
        }
        
        SYNC_IN_PROGRESS = false;
      }).catch(error => {
        console.warn('Errore sincronizzazione Supabase:', error);
        SYNC_IN_PROGRESS = false;
      });
    }
    
    return localSuccess;
  };
  
  // Funzione di caricamento ibrida
  CatamaranStorage.load = function() {
    // Carica sempre da localStorage prima (veloce)
    const localConfig = originalLoad.call(this);
    
    // Se Supabase è abilitato, prova a caricare da lì in background
    // MA SOLO se non c'è un salvataggio in corso
    if (SUPABASE_ENABLED && window.SupabaseManager && !SYNC_IN_PROGRESS) {
      // Caricamento asincrono per aggiornamenti futuri
      window.SupabaseManager.load().then(response => {
        if (response.success && response.config && !SYNC_IN_PROGRESS) {
          // Se la config da Supabase è diversa, aggiorna localStorage
          const supabaseConfig = response.config;
          const currentLocal = originalLoad.call(CatamaranStorage);
          
          // Confronto semplice: se diversi, aggiorna localStorage
          if (JSON.stringify(currentLocal) !== JSON.stringify(supabaseConfig)) {
            originalSave.call(CatamaranStorage, supabaseConfig);
            
            // Notifica che ci sono aggiornamenti disponibili
            if (typeof window.onConfigUpdated === 'function') {
              window.onConfigUpdated(supabaseConfig);
            }
          }
        }
      }).catch(error => {
        console.warn('Errore caricamento Supabase:', error);
        if (error.message?.includes('40') || error.message?.includes('RLS')) {
          console.warn('POSSIBILE PROBLEMA RLS: Controlla policy nel Dashboard Supabase');
        }
      });
    }
    
    return localConfig;
  };
  
  // Funzione per forzare sincronizzazione
  CatamaranStorage.syncFromSupabase = function() {
    return new Promise((resolve) => {
      if (!SUPABASE_ENABLED || !window.SupabaseManager) {
        resolve({ success: false, error: 'Supabase non disponibile' });
        return;
      }
      
      window.SupabaseManager.load().then(response => {
        if (response.success && response.config) {
          originalSave.call(this, response.config);
          resolve({ success: true, config: response.config });
        } else {
          resolve({ success: false, error: response.error || 'Configurazione non trovata' });
        }
      }).catch(error => {
        resolve({ success: false, error: error.message });
      });
    });
  };
  
  // Funzione per forzare salvataggio su Supabase
  CatamaranStorage.syncToSupabase = function() {
    return new Promise((resolve) => {
      if (!SUPABASE_ENABLED || !window.SupabaseManager) {
        resolve({ success: false, error: 'Supabase non disponibile' });
        return;
      }
      
      const config = originalLoad.call(this);
      window.SupabaseManager.save(config).then(response => {
        if (response.success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: response.error });
        }
      }).catch(error => {
        resolve({ success: false, error: error.message });
      });
    });
  };
  
  // Funzione per controllare stato sincronizzazione
  CatamaranStorage.getSupabaseStatus = function() {
    return {
      enabled: SUPABASE_ENABLED,
      available: !!(window.SupabaseManager),
      connected: window.SupabaseManager ? window.SupabaseManager.isReady() : false
    };
  };
  
  // Funzione per abilitare/disabilitare Supabase
  CatamaranStorage.setSupabaseEnabled = function(enabled) {
    SUPABASE_ENABLED = !!enabled;
  };
  
  // Funzione per forzare refresh da Supabase
  CatamaranStorage.forceRefresh = function() {
    return new Promise((resolve) => {
      if (!SUPABASE_ENABLED || !window.SupabaseManager) {
        resolve({ success: false, error: 'Supabase non disponibile' });
        return;
      }
      
      window.SupabaseManager.refresh().then(response => {
        if (response.success && response.config) {
          const currentConfig = originalLoad.call(CatamaranStorage);
          
          // Salva sempre la nuova config
          originalSave.call(CatamaranStorage, response.config);
          
          // Notifica che la configurazione è stata aggiornata
          if (typeof window.onConfigUpdated === 'function') {
            window.onConfigUpdated(response.config);
          }
          
          resolve({ success: true, config: response.config, refreshed: true });
        } else {
          resolve({ success: false, error: response.error || 'Refresh fallito' });
        }
      }).catch(error => {
        console.error('Errore SupabaseManager.refresh():', error);
        resolve({ success: false, error: error.message });
      });
    });
  };
  
} else {
  console.warn('CatamaranStorage non trovato - wrapper non attivato');
}

// Funzione globale per callback di aggiornamento configurazione
window.onConfigUpdated = function(newConfig) {
  // Le pagine possono sovrascrivere questa funzione per reagire agli aggiornamenti
};