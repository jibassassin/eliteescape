// Struttura dati completa per la configurazione del catamarano
const DEFAULT_CATAMARAN_CONFIG = {
  // Tema e stile
  theme: {
    primaryColor: "#0a5c8f",
    secondaryColor: "#f8b400",
    logo: {
      type: "text", // "text" or "image"
      imageUrl: "",
      text: "logo"
    }
  },
  
  // Informazioni base
  basic: {
    name: "Bali Catsmart - Violante",
    basePrice: 3499, // Prezzo base per calcoli (questa settimana)
    startingPrice: 2999, // Prezzo di partenza (solo marketing)
    year: 2025,
    length: "11,8 metri",
    cabins: "4 cabine +1 skipper",
    bathrooms: "2 bagni +1 skipper",
    maxGuests: 8,
    defaultGuests: 6,
    location: "Cagliari, Sardegna"
  },
  
  // Immagini
  images: {
    main: "https://readdy.ai/api/search-image?query=luxury%2520catamaran%2520Fountaine%2520Pajot%252045%2520sailing%2520in%2520crystal%2520clear%2520turquoise%2520waters%2520near%2520Sardinia%2520coast%252C%2520Italy.%2520The%2520catamaran%2520is%2520white%2520with%2520elegant%2520lines%252C%2520spacious%2520deck%2520and%2520modern%2520design.%2520Beautiful%2520coastal%2520scenery%2520with%2520rocky%2520cliffs%2520and%2520sandy%2520beaches%2520visible%2520in%2520the%2520background.%2520Bright%2520sunny%2520day%2520with%2520deep%2520blue%2520sky.&width=1200&height=600&seq=10001&orientation=landscape",
    summary: "https://readdy.ai/api/search-image?query=luxury%2520catamaran%2520Fountaine%2520Pajot%252045%2520sailing%2520in%2520crystal%2520clear%2520turquoise%2520waters%252C%2520close-up%2520view%2520of%2520the%2520elegant%2520white%2520hull%2520and%2520modern%2520design.%2520Professional%2520product%2520photography%2520with%2520clean%2520background.&width=100&height=100&seq=20001&orientation=squarish"
  },
  
  // Descrizione
  description: "Violante è il nostro Bali Catsmart, varato nel 2025, pensato per vivere il mare in modo confortevole e autentico. Ogni mattina può iniziare in una caletta tranquilla, con il comfort di casa a portata di mano.\nLa dinette si apre sul pozzetto grazie a un portellone posteriore, creando uno spazio conviviale unico. A prua, un prendisole con tavolino sostituisce la classica rete, ideale per aperitivi e relax.\nGrazie al dissalatore da 200 litri/ora e all'energia garantita da pannelli solari e batterie a 220V, Violante offre piena autonomia. Il tender da 6 posti con motore da 9 cavalli consente di raggiungere facilmente la costa.\nSenza fly bridge, la randa più ampia garantisce prestazioni a vela superiori. Navigare con Violante è silenzioso, sostenibile e in armonia con la natura.\nSalpa e vivi il mare con uno spirito libero e consapevole.",
  
  // Caratteristiche principali
  mainFeatures: [
    "4 cabine doppie per gli ospiti ed una cabina aggiuntiva per lo skipper",
    "Cucina attrezzata e ampia dinette con portellone apribile",
    "Piena autonomia: nessuna necessità di sosta per acqua, carburante ed energia elettrica",
    "Ampio prendisole a prua al posto della rete, con tavolino per aperitivi indimenticabili"
  ],
  
  // Dotazioni incluse
  includedEquipment: [
    "Tender 8 posti con motore fuoribordo da 9hp",
    "Dissalatore per acqua dolce da 200 l/h",
    "Casse acustiche bluetooth di alta qualità",
    "Pannelli solari e pacco batterie",
    "Barbecue a gas"
  ],
  
  // Prezzi e sconti
  pricing: {
    instagramDiscount: {
      enabled: true,
      percentage: 10,
      amount: 349.90,
      label: "Sconto Instagram -10%"
    }
  },
  
  // Pacchetti obbligatori
  mandatoryPackages: {
    charter: {
      price: 400,
      name: "Pacchetto charter obbligatorio",
      includes: [
        "Pulizie finali",
        "Tender con motore fuoribordo",
        "1 bombola del gas"
      ]
    },
    fuel: {
      price: 350,
      name: "Carburante no stress",
      includes: [
        "Nessun obbligo di pieno al rientro, nessuna coda al distributore",
        "Goditi la vacanza fino all'ultimo secondo",
        "Rifornimento gratuito illimitato al distributore convenzionato in porto"
      ]
    },
    linens: {
      pricePerGuest: 20,
      name: "Lenzuola e salviette toilette"
    }
  },
  
  // Servizi aggiuntivi
  additionalServices: {
    skipper: {
      name: "Skipper Professionale",
      price: 200,
      unit: "giorno",
      description: "Affidati a un capitano professionista che si occuperà della navigazione e ti guiderà alla scoperta delle baie più belle e suggestive. Con il servizio skipper, la cauzione passa da €3.500 a €1.500.",
      recommended: true,
      icon: "ri-steering-2-line",
      recommendedText: "Raccomandato per chi ha poca esperienza di navigazione nelle acque della Sardegna e vuole godersi la vacanza senza preoccupazioni"
    },
    watersports: {
      name: "Attrezzature Sport Acquatici",
      price: 300,
      unit: "tantum",
      description: "Set completo con due SUP, 8 set di maschere con boccaglio e pinne per snorkeling.",
      recommended: false,
      icon: "ri-snorkel-line"
    },
    wifi: {
      name: "Wi-Fi",
      price: 50,
      unit: "tantum",
      description: "Connessione internet ad alta velocità disponibile a bordo per tutta la durata del viaggio.",
      recommended: false,
      icon: "ri-wifi-line"
    },
    pizza: {
      name: "Pizza Perfetta",
      price: 150,
      unit: "tantum",
      description: "Forno per pizza Ooni Koda con kit completo per pizza, pale, tagliere e ingredienti base per 2 serate",
      recommended: false,
      icon: "ri-restaurant-2-line"
    },
    bimby: {
      name: "Bimby",
      price: 250,
      unit: "tantum", 
      description: "Robot da cucina Bimby TM7 con ricettario digitale e accessori inclusi",
      recommended: false,
      icon: "ri-blender-line"
    },
    kitchen: {
      name: "Pacchetto \"come la cucina di casa tua\"",
      price: 150,
      unit: "tantum",
      description: "Macchina Nespresso con 100 capsule incluse, microonde, tostapane, frullatore ad immersione",
      recommended: false,
      icon: "ri-restaurant-line"
    },
    fishing: {
      name: "Attrezzatura per la pesca",
      price: 75,
      unit: "tantum",
      description: "Una canna da pesca con esche, retino e una cassetta attrezzi per la pesca",
      recommended: false,
      icon: "ri-fish-line"
    }
  },
  
  // Politiche
  policies: {
    payment: {
      depositPercentage: 50,
      remainingDays: 15,
      securityDeposit: 3500,
      securityDepositWithSkipper: 1500,
      description: [
        "50% alla prenotazione, 50% 15 giorni prima dell'imbarco",
        "Cauzione di €3.500 da versare prima dell'imbarco, rimborsabile in assenza di danni",
        "Cauzione ridotta a €1.500 se si sceglie il servizio skipper"
      ]
    },
    cancellation: {
      freeDays: 30,
      halfRefundDays: 15,
      noRefundDays: 15,
      description: [
        "Cancellazione gratuita fino a 30 giorni prima della partenza",
        "50% di rimborso fino a 15 giorni prima della partenza",
        "Nessun rimborso per cancellazioni a meno di 15 giorni dalla partenza"
      ]
    }
  },
  
  // Informazioni di check-in/out
  boarding: {
    checkinTime: "16:00",
    checkoutTime: "10:00",
    checkinDay: "Sabato",
    checkoutDay: "Sabato"
  },
  
  // Calendario
  calendar: {
    defaultDate: "2025-05-23",
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
  },
  
  // Testi dell'interfaccia
  ui: {
    pageTitle: "Prenota il tuo Catamarano - Vacanze in Sardegna",
    mainHeading: "Prenota il tuo Catamarano",
    backToOffers: "Torna alle offerte",
    bookingButton: "Invia Richiesta di Prenotazione",
    bookingSubtext: "Sarai ricontattato da Cagliari Sailing Charter entro 24h per confermare e procedere al pagamento dell'anticipo",
    termsText: "Accetto i termini e condizioni e la Privacy Policy",
    newsletterText: "Desidero ricevere offerte speciali e aggiornamenti via email"
  },
  
  // Informazioni footer
  footer: {
    company: {
      name: "Catamarani Sardegna",
      description: "Offriamo indimenticabili vacanze in catamarano nelle acque cristalline della Sardegna, combinando lusso, avventura e relax.",
      copyright: "© 2025 Catamarani Sardegna. Tutti i diritti riservati."
    },
    contact: {
      address: "Via del Porto 123, 07026 Olbia (SS), Sardegna",
      phone: "+39 0789 123456",
      email: "info@catamaranisardegna.it"
    },
    links: [
      "Chi siamo",
      "Termini e Condizioni", 
      "Privacy Policy",
      "Cookie Policy",
      "FAQ"
    ],
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#"
    }
  }
};

// Funzioni per gestire localStorage
const CatamaranStorage = {
  
  // Salva configurazione
  save: function(config) {
    try {
      localStorage.setItem('catamaran_config', JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Errore nel salvare la configurazione:', error);
      return false;
    }
  },
  
  // Carica configurazione
  load: function() {
    try {
      const saved = localStorage.getItem('catamaran_config');
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_CATAMARAN_CONFIG;
    } catch (error) {
      console.error('Errore nel caricare la configurazione:', error);
      return DEFAULT_CATAMARAN_CONFIG;
    }
  },
  
  // Reset alla configurazione di default
  reset: function() {
    try {
      localStorage.removeItem('catamaran_config');
      return true;
    } catch (error) {
      console.error('Errore nel reset della configurazione:', error);
      return false;
    }
  },
  
  // Aggiorna un campo specifico
  updateField: function(path, value) {
    const config = this.load();
    const keys = path.split('.');
    let current = config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return this.save(config);
  },
  
  // Aggiorna un array (per caratteristiche, dotazioni, etc.)
  updateArray: function(path, newArray) {
    return this.updateField(path, newArray);
  },
  
  // Aggiorna un servizio aggiuntivo
  updateService: function(serviceKey, serviceData) {
    const config = this.load();
    config.additionalServices[serviceKey] = serviceData;
    return this.save(config);
  }
};