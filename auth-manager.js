// Gestore autenticazione per Elite Escape Admin Panel
// Integrato con Supabase Auth

class AuthManager {
    constructor() {
        this.user = null;
        this.profile = null;
        this.isAuthenticated = false;
        this.onAuthStateChange = null;
        
        // Inizializza quando Supabase è pronto
        this.initializeAuth();
    }

    async initializeAuth() {
        // Attende che Supabase sia disponibile
        await this.waitForSupabase();
        
        // Controlla sessione esistente
        await this.checkExistingSession();
        
        // Ascolta cambiamenti di stato auth
        this.setupAuthListener();
        
    }

    async waitForSupabase() {
        let attempts = 0;
        while (attempts < 30) {
            // Controlla se Supabase JS è disponibile
            if (typeof window.supabase !== 'undefined') {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        }
        throw new Error('Supabase JS non disponibile per autenticazione');
    }

    async checkExistingSession() {
        try {
            const client = window.supabase.createClient(
                'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
            );

            const { data: { session }, error } = await client.auth.getSession();
            
            if (error) {
                console.warn('Errore controllo sessione:', error);
                return;
            }

            if (session?.user) {
                await this.setUser(session.user);
            }
        } catch (error) {
            console.error('Errore controllo sessione:', error);
        }
    }

    setupAuthListener() {
        // Implementazione semplificata - sarà completata nel passo successivo
    }

    async setUser(user) {
        this.user = user;
        this.isAuthenticated = !!user;
        
        if (user) {
            await this.loadUserProfile(user.id);
        } else {
            this.profile = null;
        }

        // Notifica cambiamento stato
        if (this.onAuthStateChange) {
            this.onAuthStateChange(this.isAuthenticated, this.user, this.profile);
        }

        this.updateUI();
    }

    async loadUserProfile(userId) {
        try {
            const client = window.supabase.createClient(
                'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
            );

            const { data: profile, error } = await client
                .from('admin_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Errore caricamento profilo:', error);
                return;
            }

            this.profile = profile;
        } catch (error) {
            console.error('Errore caricamento profilo:', error);
        }
    }

    // Metodi di autenticazione
    async signIn(email, password) {
        try {
            const client = window.supabase.createClient(
                'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
            );

            const { data, error } = await client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Errore login:', error.message);
                return { success: false, error: error.message };
            }

            await this.setUser(data.user);
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Errore login:', error);
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, fullName) {
        try {
            const client = window.supabase.createClient(
                'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
            );

            const { data, error } = await client.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                console.error('Errore registrazione:', error.message);
                return { success: false, error: error.message };
            }
            return { success: true, user: data.user, needsConfirmation: !data.session };
        } catch (error) {
            console.error('Errore registrazione:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const client = window.supabase.createClient(
                'https://aaqqkxrhtgxxfeexbpgs.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcXFreHJodGd4eGZlZXhicGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTY5NDcsImV4cCI6MjA2NjA5Mjk0N30.5fLV8_EmkbdSx0vCUd8HXMP1SDsOG1p0fyYMqdVmUAQ'
            );

            const { error } = await client.auth.signOut();
            
            if (error) {
                console.error('Errore logout:', error);
                return { success: false, error: error.message };
            }

            await this.setUser(null);
            
            return { success: true };
        } catch (error) {
            console.error('Errore logout:', error);
            return { success: false, error: error.message };
        }
    }

    // UI Management
    updateUI() {
        this.updateAuthButtons();
        this.updateUserInfo();
        this.updateAccessControl();
    }

    updateAuthButtons() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const saveButton = document.getElementById('save-button');
        const saveButtonBottom = document.getElementById('save-button-bottom');

        if (this.isAuthenticated) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) {
                logoutBtn.style.display = 'flex';
                logoutBtn.classList.remove('hidden');
            }
            if (userInfo) {
                userInfo.style.display = 'flex';
                userInfo.classList.remove('hidden');
            }
            if (saveButton) {
                saveButton.style.display = 'flex';
                saveButton.classList.remove('hidden');
            }
            if (saveButtonBottom) {
                saveButtonBottom.style.display = 'flex';
                saveButtonBottom.classList.remove('hidden');
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'flex';
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
                logoutBtn.classList.add('hidden');
            }
            if (userInfo) {
                userInfo.style.display = 'none';
                userInfo.classList.add('hidden');
            }
            if (saveButton) {
                saveButton.style.display = 'none';
                saveButton.classList.add('hidden');
            }
            if (saveButtonBottom) {
                saveButtonBottom.style.display = 'none';
                saveButtonBottom.classList.add('hidden');
            }
        }
    }

    updateUserInfo() {
        const userEmail = document.getElementById('user-email');
        const userName = document.getElementById('user-name');

        if (userEmail && this.user) {
            userEmail.textContent = this.user.email;
        }

        if (userName && this.profile) {
            userName.textContent = this.profile.full_name || 'Admin';
        }
    }

    updateAccessControl() {
        const adminContent = document.getElementById('admin-content');
        const authRequired = document.getElementById('auth-required');

        if (this.isAuthenticated) {
            if (adminContent) {
                adminContent.style.display = 'block';
                adminContent.style.opacity = '1';
            }
            if (authRequired) authRequired.style.display = 'none';
        } else {
            if (adminContent) {
                adminContent.style.display = 'none';
                adminContent.style.opacity = '0';
            }
            if (authRequired) authRequired.style.display = 'block';
        }
    }

    // Utility methods
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getCurrentUser() {
        return this.user;
    }

    getUserProfile() {
        return this.profile;
    }
}

// Inizializza il gestore auth globalmente
window.authManager = new AuthManager();

