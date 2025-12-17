/**
 * AUTO CLEAN 40 FINAL PRO
 * Modern Invoice/Quote Manager with Firebase Cloud Sync
 * Using Firebase Compat SDK + Realtime Database
 */

// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAc2lgqmAAxBjuik3yEOO26T6IlT3qmAQI",
    authDomain: "auto-clean-40-pro.firebaseapp.com",
    projectId: "auto-clean-40-pro",
    storageBucket: "auto-clean-40-pro.firebasestorage.app",
    messagingSenderId: "1088322147826",
    appId: "1:1088322147826:web:e08aaf7babd6c9bf68876b",
    measurementId: "G-FDWWWTCNDF",
    databaseURL: "https://auto-clean-40-pro-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    company: {
        name: 'PRO MANAGER',
        address: 'Votre Adresse\nCode Postal Ville',
        phone: '00 00 00 00 00',
        email: 'contact@exemple.com',
        siret: '000 000 000 00000',
        website: 'votre-site.com',
        legal: 'TVA non applicable, art. 293 B du CGI.',
        logo: ''
    },
    notes: [],
    services: [
        { id: 1, name: 'Formule LUXE (Int + Ext)', desc: 'Nettoyage intégral : Extérieur manuel, jantes, séchage, démoustiquage, joints, détachage sièges, plastiques, cuirs, aspiration, tapis, poils, sable, parfum, vitres, coffre.', price: 165 },
        { id: 2, name: 'Intérieur Prestige', desc: 'Détachage sièges, plastiques, cuirs, aspiration complète, tapis, poils, sable, parfum, vitres, coffre.', price: 125 },
        { id: 3, name: 'Intérieur Clean', desc: 'Aspiration complète, plastiques, cuirs rapide, tapis, sable, parfum, vitres.', price: 95 },
        { id: 4, name: 'Extérieur Brillance', desc: 'Lavage manuel approfondi, brillance carrosserie, jantes, séchage minutieux, démoustiquage.', price: 65 },
        { id: 5, name: 'Nettoyage Moteur', desc: 'Dégraissage, rénovation plastiques, décontamination, finition détaillée.', price: 70 },
        { id: 6, name: 'Rénovation Optique Phares', desc: 'Ponçage multi-grains, élimination oxydation, résultat brillant (la paire).', price: 90 },
        { id: 7, name: 'Nettoyage Complet Canapé', desc: 'Élimination poils, taches, à domicile. (Sur devis)', price: 0 },
        { id: 8, name: 'Nettoyage Complet Matelas', desc: 'Élimination poils, taches, à domicile. (Sur devis)', price: 0 },
        { id: 9, name: 'Nettoyage Vitres Maison', desc: 'Vitres, menuiseries, encadrements. (Sur devis)', price: 0 },
        { id: 10, name: 'Option: Détachage Sièges', desc: 'Supplément par siège', price: 20 },
        { id: 11, name: 'Option: Poils Animaux', desc: 'Supplément poils incrustés', price: 10 },
        { id: 12, name: 'Option: Joints Portes', desc: 'Nettoyage joints et contours', price: 20 },
        { id: 13, name: 'Supplément Siège (+5)', desc: 'Par siège supplémentaire', price: 10 }
    ],
    counters: { facture: 100, devis: 48 },
    documents: [],
    currentDoc: null,
    editingServiceId: null,
    charts: { revenue: null, services: null }
};

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    loadingScreen: () => document.getElementById('loading-screen'),
    syncToast: () => document.getElementById('sync-toast'),
    toast: () => document.getElementById('toast'),
    toastMessage: () => document.getElementById('toast-message'),
    navItems: () => document.querySelectorAll('.nav-item'),
    views: () => document.querySelectorAll('.view'),
    pageTitle: () => document.getElementById('page-title'),
    currentDate: () => document.getElementById('current-date'),
    logoImg: () => document.getElementById('logo-img'),
    logoIcon: () => document.getElementById('logo-icon'),
    mobileLogoImg: () => document.getElementById('mobile-logo-img'),
    mobileLogoIcon: () => document.getElementById('mobile-logo-icon'),
    logoPreview: () => document.getElementById('logo-preview'),
    statRevenue: () => document.getElementById('stat-revenue'),
    statDocs: () => document.getElementById('stat-docs'),
    statAvg: () => document.getElementById('stat-avg'),
    recentActivities: () => document.getElementById('recent-activities'),
    revenueChart: () => document.getElementById('revenueChart'),
    servicesChart: () => document.getElementById('servicesChart'),
    btnFacture: () => document.getElementById('btn-facture'),
    btnDevis: () => document.getElementById('btn-devis'),
    docDate: () => document.getElementById('doc-date'),
    docNumberAuto: () => document.getElementById('doc-number-auto'),
    docNumberManual: () => document.getElementById('doc-number-manual'),
    clientName: () => document.getElementById('client-name'),
    clientAddress: () => document.getElementById('client-address'),
    clientPhone: () => document.getElementById('client-phone'),
    clientEmail: () => document.getElementById('client-email'),
    clientSiret: () => document.getElementById('client-siret'),
    clientVehicle: () => document.getElementById('client-vehicle'),
    clientPlate: () => document.getElementById('client-plate'),
    catalogSelect: () => document.getElementById('catalog-select'),
    linesContainer: () => document.getElementById('lines-container'),
    pdfPreview: () => document.getElementById('pdf-preview'),
    historyList: () => document.getElementById('history-list'),
    historyEmpty: () => document.getElementById('history-empty'),
    searchHistory: () => document.getElementById('search-history'),
    logoUpload: () => document.getElementById('logo-upload'),
    confCompany: () => document.getElementById('conf-company'),
    confSiret: () => document.getElementById('conf-siret'),
    confPhone: () => document.getElementById('conf-phone'),
    confEmail: () => document.getElementById('conf-email'),
    confWebsite: () => document.getElementById('conf-website'),
    confAddress: () => document.getElementById('conf-address'),
    confLegal: () => document.getElementById('conf-legal'),
    confCounterFacture: () => document.getElementById('conf-counter-facture'),
    confCounterDevis: () => document.getElementById('conf-counter-devis'),
    serviceName: () => document.getElementById('service-name'),
    serviceDesc: () => document.getElementById('service-desc'),
    servicePrice: () => document.getElementById('service-price'),
    catalogList: () => document.getElementById('catalog-list'),
    catalogFormTitle: () => document.getElementById('catalog-form-title'),
    btnAddService: () => document.getElementById('btn-add-service'),
    noteInput: () => document.getElementById('note-input'),
    btnAddNote: () => document.getElementById('btn-add-note'),
    notesList: () => document.getElementById('notes-list'),
    hiddenPdfContainer: () => document.getElementById('hidden-pdf-container')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    formatDate(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    formatDateShort(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('fr-FR');
    },
    today() {
        return new Date().toISOString().split('T')[0];
    },
    todayFormatted() {
        return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================
const Toast = {
    show(message, type = 'success') {
        const toast = DOM.toast();
        const icon = toast.querySelector('i');
        const msgEl = DOM.toastMessage();
        msgEl.textContent = message;
        toast.className = `toast show ${type}`;
        icon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'alert-circle');
        lucide.createIcons();
        setTimeout(() => toast.classList.remove('show'), 3000);
    },
    sync() {
        const toast = DOM.syncToast();
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
};

// ============================================
// FIREBASE REALTIME DATABASE OPERATIONS
// ============================================
const Firebase = {
    async loadAll() {
        try {
            // Load company settings
            const companySnap = await db.ref('settings/company').once('value');
            if (companySnap.exists()) Object.assign(state.company, companySnap.val());

            // Load services catalog
            const servicesSnap = await db.ref('settings/services').once('value');
            if (servicesSnap.exists()) {
                const data = servicesSnap.val();
                if (Array.isArray(data)) {
                    state.services = data;
                } else if (data) {
                    state.services = Object.values(data);
                }
            }

            // Load counters
            const countersSnap = await db.ref('settings/counters').once('value');
            if (countersSnap.exists()) state.counters = countersSnap.val();

            // Load documents
            const docsSnap = await db.ref('documents').once('value');
            if (docsSnap.exists()) {
                state.documents = Object.entries(docsSnap.val())
                    .map(([id, data]) => ({ id, ...data }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            }

            // Load notes
            const notesSnap = await db.ref('notes').once('value');
            if (notesSnap.exists()) {
                state.notes = Object.entries(notesSnap.val())
                    .map(([id, data]) => ({ id, ...data }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            }
        } catch (error) {
            console.error('Firebase load error:', error);
        }
    },

    setupListeners() {
        // Listen to documents changes
        db.ref('documents').on('value', snapshot => {
            if (snapshot.exists()) {
                state.documents = Object.entries(snapshot.val())
                    .map(([id, data]) => ({ id, ...data }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            } else {
                state.documents = [];
            }
            UI.renderHistory();
            UI.renderStats();
            UI.renderRecentActivities();
            UI.renderRecentActivities();
            Toast.sync();
        });

        // Listen to notes changes
        db.ref('notes').on('value', snapshot => {
            if (snapshot.exists()) {
                state.notes = Object.entries(snapshot.val())
                    .map(([id, data]) => ({ id, ...data }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            } else {
                state.notes = [];
            }
            UI.renderNotes();
        });

        // Listen to company settings
        db.ref('settings/company').on('value', snapshot => {
            if (snapshot.exists()) {
                Object.assign(state.company, snapshot.val());
                UI.updateLogos();
                UI.renderPDFPreview();
            }
        });

        // Listen to services catalog
        db.ref('settings/services').on('value', snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (Array.isArray(data)) {
                    state.services = data;
                } else if (data) {
                    state.services = Object.values(data);
                }
                UI.renderCatalogSelect();
                UI.renderCatalogList();
            }
        });

        // Listen to counters
        db.ref('settings/counters').on('value', snapshot => {
            if (snapshot.exists()) state.counters = snapshot.val();
        });
    },

    async saveCompany() {
        try {
            await db.ref('settings/company').set(state.company);
        } catch (error) {
            console.error('Save company error:', error);
        }
    },

    async saveServices() {
        try {
            await db.ref('settings/services').set(state.services);
        } catch (error) {
            console.error('Save services error:', error);
        }
    },

    async saveCounters() {
        try {
            await db.ref('settings/counters').set(state.counters);
        } catch (error) {
            console.error('Save counters error:', error);
        }
    },

    async saveDocument(docData) {
        try {
            const data = { ...docData, timestamp: Date.now() };
            delete data.id;
            await db.ref('documents').push(data);
            return true;
        } catch (error) {
            console.error('Save document error:', error);
            return false;
        }
    },

    async deleteDocument(id) {
        try {
            await db.ref(`documents/${id}`).remove();
            return true;
        } catch (error) {
            console.error('Delete document error:', error);
            return false;
        }
    },

    async saveNote(text) {
        try {
            const note = { text, timestamp: Date.now() };
            await db.ref('notes').push(note);
            return true;
        } catch (error) {
            console.error('Save note error:', error);
            return false;
        }
    },

    async deleteNote(id) {
        try {
            await db.ref(`notes/${id}`).remove();
            return true;
        } catch (error) {
            console.error('Delete note error:', error);
            return false;
        }
    }
};

// ============================================
// UI RENDERING
// ============================================
const UI = {
    init() {
        DOM.currentDate().textContent = Utils.todayFormatted();
        this.updateLogos();
        this.renderAll();
    },

    renderAll() {
        this.renderStats();
        this.renderRecentActivities();
        this.renderHistory();
        this.renderCharts();
        this.renderCatalogSelect();
        this.renderCatalogList();
        this.renderSettings();
    },

    updateLogos() {
        const logo = state.company.logo;
        const elements = [
            { img: DOM.logoImg(), icon: DOM.logoIcon() },
            { img: DOM.mobileLogoImg(), icon: DOM.mobileLogoIcon() },
            { img: DOM.logoPreview(), icon: null }
        ];
        elements.forEach(({ img, icon }) => {
            if (img) {
                if (logo) {
                    img.src = logo;
                    img.classList.add('visible');
                    if (icon) icon.classList.add('hidden');
                } else {
                    img.classList.remove('visible');
                    if (icon) icon.classList.remove('hidden');
                }
            }
        });
    },

    renderStats() {
        const total = state.documents.length;
        const revenue = state.documents.reduce((sum, doc) => sum + (doc.totalTTC || 0), 0);
        const avg = total > 0 ? revenue / total : 0;
        DOM.statRevenue().textContent = Utils.formatCurrency(revenue);
        DOM.statDocs().textContent = total;
        DOM.statAvg().textContent = Utils.formatCurrency(avg);
    },

    renderRecentActivities() {
        const tbody = DOM.recentActivities();
        const recent = state.documents.slice(0, 5);
        tbody.innerHTML = recent.map(doc => `
            <tr>
                <td data-label="N°"><strong>N° ${Utils.escapeHtml(doc.number)}</strong></td>
                <td data-label="Client">${Utils.escapeHtml(doc.client?.name || '-')}</td>
                <td data-label="Date">${Utils.formatDateShort(doc.date)}</td>
                <td data-label="Type"><span class="badge ${doc.type === 'facture' ? 'badge-blue' : 'badge-green'}">${doc.type}</span></td>
                <td data-label="Montant" class="text-right" style="font-weight:700;color:var(--primary);">${Utils.formatCurrency(doc.totalTTC || 0)}</td>
            </tr>
        `).join('');
        lucide.createIcons();
    },

    renderHistory() {
        const tbody = DOM.historyList();
        const emptyState = DOM.historyEmpty();
        if (state.documents.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }
        emptyState.style.display = 'none';
        tbody.innerHTML = state.documents.map(doc => `
            <tr>
                <td data-label="Numéro"><strong>N° ${Utils.escapeHtml(doc.number)}</strong></td>
                <td data-label="Client">${Utils.escapeHtml(doc.client?.name || '-')}</td>
                <td data-label="Date">${Utils.formatDateShort(doc.date)}</td>
                <td data-label="Type"><span class="badge ${doc.type === 'facture' ? 'badge-blue' : 'badge-green'}">${doc.type}</span></td>
                <td data-label="Montant" class="text-right" style="font-weight:700;color:var(--primary);">${Utils.formatCurrency(doc.totalTTC || 0)}</td>
                <td data-label="Actions" class="text-right">
                    <div class="action-btns">
                        <button class="action-btn preview" onclick="App.previewDocument('${doc.id}')" title="Aperçu"><i data-lucide="eye"></i></button>
                        <button class="action-btn edit" onclick="App.loadDocument('${doc.id}')" title="Modifier"><i data-lucide="pencil"></i></button>
                        <button class="action-btn download" onclick="App.downloadDocument('${doc.id}')" title="Télécharger"><i data-lucide="download"></i></button>
                        <button class="action-btn delete" onclick="App.deleteDocument('${doc.id}')" title="Supprimer"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    },

    renderCharts() {
        this.renderRevenueChart();
        this.renderServicesChart();
    },

    renderRevenueChart() {
        const ctx = DOM.revenueChart();
        if (!ctx) return;
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const currentMonth = new Date().getMonth();
        const labels = [], data = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            labels.push(months[monthIndex]);
            const monthRevenue = state.documents
                .filter(doc => doc.date && new Date(doc.date).getMonth() === monthIndex)
                .reduce((sum, doc) => sum + (doc.totalTTC || 0), 0);
            data.push(monthRevenue);
        }
        if (state.charts.revenue) state.charts.revenue.destroy();
        state.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'CA', data, backgroundColor: 'rgba(232, 185, 35, 0.8)', borderRadius: 6, borderSkipped: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5c5c5c' } }, x: { grid: { display: false }, ticks: { color: '#5c5c5c' } } } }
        });
    },

    renderServicesChart() {
        const ctx = DOM.servicesChart();
        if (!ctx) return;
        const counts = {};
        state.documents.forEach(doc => {
            (doc.lines || []).forEach(line => {
                const name = (line.desc || '').split('\n')[0].substring(0, 20);
                if (name) counts[name] = (counts[name] || 0) + 1;
            });
        });
        const labels = Object.keys(counts).slice(0, 6);
        const data = labels.map(l => counts[l]);
        const total = data.reduce((a, b) => a + b, 0);
        const colors = ['#e8b923', '#22d47e', '#38bdf8', '#a855f7', '#ec4899', '#14b8a6'];
        if (state.charts.services) state.charts.services.destroy();
        if (labels.length === 0) return;
        state.charts.services = new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 12,
                            font: { size: 11, weight: '500' },
                            boxWidth: 12,
                            generateLabels: (chart) => {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, i) => ({
                                    text: `${label} (${Math.round(dataset.data[i] / total * 100)}%)`,
                                    fillStyle: dataset.backgroundColor[i],
                                    fontColor: '#ffffff',
                                    hidden: false,
                                    index: i
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const percentage = Math.round(value / total * 100);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderCatalogSelect() {
        const select = DOM.catalogSelect();
        select.innerHTML = '<option value="">-- Choisir une prestation --</option>' + state.services.map((s, i) => `<option value="${i}">${Utils.escapeHtml(s.name)} (${s.price}€)</option>`).join('');
    },

    renderCatalogList() {
        const tbody = DOM.catalogList();
        tbody.innerHTML = state.services.map((s, i) => `
            <tr>
                <td data-label="Nom"><strong>${Utils.escapeHtml(s.name)}</strong>${s.desc ? `<br><small style="color:var(--text-muted)">${Utils.escapeHtml(s.desc)}</small>` : ''}</td>
                <td data-label="Prix" class="text-right" style="font-weight:600;color:var(--primary);">${s.price} €</td>
                <td data-label="Actions" class="text-right">
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="App.editService(${i})" title="Modifier"><i data-lucide="pencil"></i></button>
                        <button class="action-btn delete" onclick="App.deleteService(${i})" title="Supprimer"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    },

    renderNotes() {
        const list = DOM.notesList();
        if (!list) return;

        if (state.notes.length === 0) {
            list.innerHTML = '<div class="text-muted" style="font-size:0.9rem; padding:10px;">Aucune note pour le moment.</div>';
            return;
        }

        list.innerHTML = state.notes.map(note => `
            <div class="note-item" style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: rgba(255,255,255,0.03); margin-bottom: 8px; border-radius: 8px; border: 1px solid var(--border);">
                <div style="flex:1;">
                    <div style="font-size:0.95rem; color:var(--text-primary);">${Utils.escapeHtml(note.text)}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${Utils.formatDate(note.timestamp)}</div>
                </div>
                <button class="action-btn delete" onclick="App.deleteNote('${note.id}')" style="margin-left:10px;">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    },
    renderSettings() {
        DOM.confCompany().value = state.company.name || '';
        DOM.confSiret().value = state.company.siret || '';
        DOM.confPhone().value = state.company.phone || '';
        DOM.confEmail().value = state.company.email || '';
        DOM.confWebsite().value = state.company.website || '';
        DOM.confAddress().value = state.company.address || '';
        DOM.confLegal().value = state.company.legal || '';
        DOM.confCounterFacture().value = state.counters.facture;
        DOM.confCounterDevis().value = state.counters.devis;
    },

    renderAccounting() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        // This month stats
        const thisMonthDocs = state.documents.filter(d => {
            if (!d.date) return false;
            const docDate = new Date(d.date);
            return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
        });
        const invoicesThisMonth = thisMonthDocs.filter(d => d.type === 'facture').length;
        const quotesThisMonth = thisMonthDocs.filter(d => d.type === 'devis').length;
        const revenueThisMonth = thisMonthDocs.filter(d => d.type === 'facture').reduce((sum, d) => sum + (d.totalTTC || 0), 0);

        document.getElementById('acc-invoices-month').textContent = invoicesThisMonth;
        document.getElementById('acc-quotes-month').textContent = quotesThisMonth;
        document.getElementById('acc-revenue-month').textContent = Utils.formatCurrency(revenueThisMonth);

        // Yearly stats
        const thisYearDocs = state.documents.filter(d => d.date && new Date(d.date).getFullYear() === currentYear);
        const totalInvoices = thisYearDocs.filter(d => d.type === 'facture').length;
        const totalQuotes = thisYearDocs.filter(d => d.type === 'devis').length;
        const yearlyRevenue = thisYearDocs.filter(d => d.type === 'facture').reduce((sum, d) => sum + (d.totalTTC || 0), 0);
        const conversionRate = totalQuotes > 0 ? Math.round((totalInvoices / (totalInvoices + totalQuotes)) * 100) : 0;
        const avgBasket = totalInvoices > 0 ? yearlyRevenue / totalInvoices : 0;

        document.getElementById('acc-total-invoices').textContent = totalInvoices;
        document.getElementById('acc-total-quotes').textContent = totalQuotes;
        document.getElementById('acc-conversion-rate').textContent = conversionRate + '%';
        document.getElementById('acc-yearly-revenue').textContent = Utils.formatCurrency(yearlyRevenue);
        document.getElementById('acc-avg-basket').textContent = Utils.formatCurrency(avgBasket);

        // Monthly breakdown
        const monthlyData = [];
        for (let m = 0; m <= currentMonth; m++) {
            const monthDocs = thisYearDocs.filter(d => new Date(d.date).getMonth() === m);
            const inv = monthDocs.filter(d => d.type === 'facture').length;
            const qts = monthDocs.filter(d => d.type === 'devis').length;
            const rev = monthDocs.filter(d => d.type === 'facture').reduce((sum, d) => sum + (d.totalTTC || 0), 0);
            monthlyData.push({ month: months[m], invoices: inv, quotes: qts, revenue: rev });
        }

        const tbody = document.getElementById('acc-monthly-breakdown');
        tbody.innerHTML = monthlyData.reverse().map(m => `
            <tr>
                <td data-label="Mois">${m.month}</td>
                <td data-label="Factures">${m.invoices}</td>
                <td data-label="Devis">${m.quotes}</td>
                <td data-label="CA" class="text-right" style="font-weight:600;color:var(--primary);">${Utils.formatCurrency(m.revenue)}</td>
            </tr>
        `).join('');
        lucide.createIcons();
    },

    renderLines() {
        const container = DOM.linesContainer();
        container.innerHTML = state.currentDoc.lines.map((line, i) => `
            <div class="line-row">
                <textarea class="input" placeholder="Description" onchange="App.updateLine(${i}, 'desc', this.value)">${Utils.escapeHtml(line.desc)}</textarea>
                <input type="number" class="input" value="${line.qty}" onchange="App.updateLine(${i}, 'qty', this.value)" placeholder="Qté">
                <input type="number" class="input" value="${line.price}" onchange="App.updateLine(${i}, 'price', this.value)" placeholder="Prix">
                <input type="number" class="input" value="${line.discount || 0}" onchange="App.updateLine(${i}, 'discount', this.value)" placeholder="%">
                <button class="action-btn delete" onclick="App.removeLine(${i})"><i data-lucide="trash-2"></i></button>
            </div>
        `).join('');
        lucide.createIcons();
    },

    renderPDFPreview() {
        const doc = state.currentDoc;
        if (!doc) return;
        const c = state.company;
        const num = doc.manualNumber || doc.autoNumber;
        let total = 0;
        const linesHtml = doc.lines.map(line => {
            const subtotal = line.qty * line.price;
            const discount = subtotal * (line.discount || 0) / 100;
            const lineTotal = subtotal - discount;
            total += lineTotal;
            const parts = (line.desc || '').split('\n');
            return `<tr><td style="padding:12px;border-bottom:1px solid #eee;"><strong>${Utils.escapeHtml(parts[0])}</strong>${parts[1] ? `<br><small style="color:#666">${Utils.escapeHtml(parts.slice(1).join(' '))}</small>` : ''}</td><td style="text-align:center;padding:12px;border-bottom:1px solid #eee;">${line.qty}</td><td style="text-align:right;padding:12px;border-bottom:1px solid #eee;">${line.price.toFixed(2)}€</td><td style="text-align:right;padding:12px;border-bottom:1px solid #eee;font-weight:600;">${lineTotal.toFixed(2)}€${line.discount ? `<br><small style="color:#888">-${line.discount}%</small>` : ''}</td></tr>`;
        }).join('');
        const logoHtml = c.logo ? `<img src="${c.logo}" style="height:60px;border-radius:8px;">` : '';
        const dateFormatted = Utils.formatDate(doc.date);
        const vehicleInfo = (doc.client.vehicle || doc.client.plate) ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e5e5;font-size:0.85em;"><strong>Véhicule:</strong> ${Utils.escapeHtml(doc.client.vehicle || '-')} ${doc.client.plate ? `<span style="background:#111;color:#fff;padding:2px 8px;border-radius:4px;margin-left:8px;">${Utils.escapeHtml(doc.client.plate)}</span>` : ''}</div>` : '';
        const clientSiretHtml = doc.client.siret ? `<div style="font-size:0.8em;color:#666;margin-top:4px;">SIRET: ${Utils.escapeHtml(doc.client.siret)}</div>` : '';
        DOM.pdfPreview().innerHTML = `<div style="font-family:'Inter',sans-serif;color:#111;padding:40px;min-height:1123px;position:relative;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:25px;border-bottom:3px solid #111;"><div>${logoHtml}<h1 style="font-size:1.4em;font-weight:800;margin:12px 0 6px;">${Utils.escapeHtml(c.name)}</h1><div style="font-size:0.85em;color:#555;line-height:1.5;">${Utils.escapeHtml(c.address).replace(/\n/g, '<br>')}<br>${Utils.escapeHtml(c.phone)} • ${Utils.escapeHtml(c.email)}</div></div><div style="text-align:right;"><div style="font-size:2.5em;font-weight:900;letter-spacing:1px;">${doc.type.toUpperCase()}</div><div style="font-size:1.2em;font-weight:600;margin-top:6px;">N° ${Utils.escapeHtml(num)}</div><div style="margin-top:6px;color:#555;">${dateFormatted}</div></div></div><div style="display:flex;justify-content:flex-end;margin-bottom:35px;"><div style="width:45%;background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;padding:18px;"><div style="font-size:0.7em;text-transform:uppercase;font-weight:700;color:#888;margin-bottom:10px;">Facturé à</div><div style="font-weight:700;font-size:1.1em;margin-bottom:6px;">${Utils.escapeHtml(doc.client.name) || 'Client'}</div><div style="font-size:0.9em;color:#555;white-space:pre-wrap;">${Utils.escapeHtml(doc.client.address) || ''}</div>${doc.client.phone ? `<div style="margin-top:8px;font-size:0.9em;">${Utils.escapeHtml(doc.client.phone)}</div>` : ''}${doc.client.email ? `<div style="font-size:0.9em;">${Utils.escapeHtml(doc.client.email)}</div>` : ''}${clientSiretHtml}${vehicleInfo}</div></div><table style="width:100%;border-collapse:collapse;margin-bottom:35px;"><thead><tr style="background:#111;color:#fff;"><th style="text-align:left;padding:12px;font-size:0.8em;text-transform:uppercase;">Désignation</th><th style="text-align:center;padding:12px;width:10%;font-size:0.8em;">Qté</th><th style="text-align:right;padding:12px;width:15%;font-size:0.8em;">P.U.</th><th style="text-align:right;padding:12px;width:15%;font-size:0.8em;">Total</th></tr></thead><tbody>${linesHtml}</tbody></table><div style="display:flex;justify-content:flex-end;"><div style="width:250px;"><div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;"><span style="color:#666;">Total HT</span><span style="font-weight:600;">${total.toFixed(2)} €</span></div><div style="background:linear-gradient(135deg,#111,#333);color:#fff;padding:15px;margin-top:12px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:600;text-transform:uppercase;font-size:0.85em;">Net à payer</span><span style="font-weight:800;font-size:1.6em;">${total.toFixed(2)} €</span></div><div style="text-align:right;margin-top:6px;font-size:0.7em;color:#888;">TVA non applicable, art. 293 B du CGI</div></div></div><div style="position:absolute;bottom:30px;left:40px;right:40px;text-align:center;font-size:0.7em;color:#888;padding-top:15px;border-top:1px solid #eee;"><strong>${Utils.escapeHtml(c.name)}</strong> - SIRET: ${Utils.escapeHtml(c.siret)}<br>${Utils.escapeHtml(c.legal)}</div></div>`;
        this.adjustPDFScale();
    },

    adjustPDFScale() {
        const container = document.querySelector('.paper-container');
        const paper = DOM.pdfPreview();
        if (!container || !paper) return;
        paper.style.transform = 'none';
        if (window.innerWidth <= 1024) {
            const scale = Math.min((container.clientWidth - 16) / 794, 0.55);
            paper.style.transform = `scale(${scale})`;
            paper.style.transformOrigin = 'top center';
        }
    }
};

// ============================================
// APP CONTROLLER
// ============================================
const App = {
    async init() {
        // Force hide loading after 5 seconds max
        const loadingTimeout = setTimeout(() => {
            console.log('Timeout: Hiding loading screen');
            this.finishInit();
        }, 5000);

        try {
            await Firebase.loadAll();
            clearTimeout(loadingTimeout);
            this.finishInit();
            Firebase.setupListeners();
            Toast.sync();
        } catch (error) {
            console.error('Firebase init error:', error);
            clearTimeout(loadingTimeout);
            this.finishInit();
            Toast.show('Mode hors ligne', 'error');
        }
    },

    finishInit() {
        UI.init();
        this.setupNavigation();
        this.setupEventListeners();
        this.newDocument('facture');
        DOM.loadingScreen().classList.add('hidden');
    },

    setupNavigation() {
        const titles = { dashboard: 'Tableau de bord', editor: 'Facture & Devis', history: 'Historique', accounting: 'Comptabilité', settings: 'Configuration' };
        DOM.navItems().forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                if (!view) return;
                DOM.navItems().forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                DOM.views().forEach(v => v.classList.remove('active'));
                document.getElementById(`view-${view}`).classList.add('active');
                DOM.pageTitle().textContent = titles[view] || '';
                if (view === 'settings') UI.renderSettings();
                if (view === 'dashboard') UI.renderCharts();
                if (view === 'editor') setTimeout(() => UI.adjustPDFScale(), 50);
                if (view === 'accounting') UI.renderAccounting();
            });
        });
    },

    setupEventListeners() {
        DOM.btnFacture().addEventListener('click', () => this.newDocument('facture'));
        DOM.btnDevis().addEventListener('click', () => this.newDocument('devis'));
        DOM.docDate().addEventListener('input', e => { state.currentDoc.date = e.target.value; UI.renderPDFPreview(); });
        DOM.docNumberManual().addEventListener('input', e => { state.currentDoc.manualNumber = e.target.value; UI.renderPDFPreview(); });
        ['Name', 'Address', 'Phone', 'Email', 'Siret', 'Vehicle', 'Plate'].forEach(field => {
            const el = DOM[`client${field}`]();
            if (el) el.addEventListener('input', e => { state.currentDoc.client[field.toLowerCase()] = e.target.value; UI.renderPDFPreview(); });
        });
        DOM.catalogSelect().addEventListener('change', e => { if (e.target.value !== '') { this.addFromCatalog(parseInt(e.target.value)); e.target.value = ''; } });
        document.getElementById('btn-add-line').addEventListener('click', () => this.addLine());
        document.getElementById('btn-save-doc').addEventListener('click', () => this.saveDocument());
        document.getElementById('btn-download-pdf').addEventListener('click', () => this.generatePDF());
        document.getElementById('btn-save-doc-mobile').addEventListener('click', () => this.saveDocument());
        document.getElementById('btn-download-pdf-mobile').addEventListener('click', () => this.generatePDF());
        document.getElementById('btn-save-settings').addEventListener('click', () => this.saveSettings());
        DOM.logoUpload().addEventListener('change', e => this.handleLogoUpload(e));
        DOM.btnAddService().addEventListener('click', () => this.addService());
        DOM.searchHistory().addEventListener('input', e => this.filterHistory(e.target.value));

        const btnAddNote = DOM.btnAddNote();
        if (btnAddNote) btnAddNote.addEventListener('click', () => this.addNote());

        const noteInput = DOM.noteInput();
        if (noteInput) noteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addNote();
        });

        window.addEventListener('resize', () => UI.adjustPDFScale());
    },

    async addNote() {
        const input = DOM.noteInput();
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        const success = await Firebase.saveNote(text);
        if (success) {
            Toast.show('Note ajoutée', 'success');
        } else {
            Toast.show('Erreur lors de l\'ajout', 'error');
        }
    },

    async deleteNote(id) {
        if (!confirm('Supprimer cette note ?')) return;
        await Firebase.deleteNote(id);
        Toast.show('Note supprimée', 'success');
    },

    newDocument(type) {
        DOM.btnFacture().classList.toggle('active', type === 'facture');
        DOM.btnDevis().classList.toggle('active', type === 'devis');
        state.currentDoc = { type, autoNumber: String((state.counters[type] || 0) + 1), manualNumber: '', date: Utils.today(), client: { name: '', address: '', phone: '', email: '', siret: '', vehicle: '', plate: '' }, lines: [] };
        DOM.docDate().value = state.currentDoc.date;
        DOM.docNumberAuto().value = state.currentDoc.autoNumber;
        DOM.docNumberManual().value = '';
        DOM.clientName().value = '';
        DOM.clientAddress().value = '';
        DOM.clientPhone().value = '';
        DOM.clientEmail().value = '';
        DOM.clientSiret().value = '';
        DOM.clientVehicle().value = '';
        DOM.clientPlate().value = '';
        UI.renderLines();
        UI.renderPDFPreview();
    },

    addLine() { state.currentDoc.lines.push({ desc: '', qty: 1, price: 0, discount: 0 }); UI.renderLines(); UI.renderPDFPreview(); },
    updateLine(index, field, value) { state.currentDoc.lines[index][field] = field === 'desc' ? value : (parseFloat(value) || 0); UI.renderPDFPreview(); },
    removeLine(index) { state.currentDoc.lines.splice(index, 1); UI.renderLines(); UI.renderPDFPreview(); },
    addFromCatalog(index) { const s = state.services[index]; if (!s) return; state.currentDoc.lines.push({ desc: s.desc ? `${s.name}\n${s.desc}` : s.name, qty: 1, price: s.price, discount: 0 }); UI.renderLines(); UI.renderPDFPreview(); },

    async saveDocument() {
        if (!state.currentDoc.client.name) { Toast.show('Veuillez saisir le nom du client', 'error'); return; }
        let total = 0;
        state.currentDoc.lines.forEach(line => { const sub = line.price * line.qty; total += sub - sub * (line.discount || 0) / 100; });
        const num = state.currentDoc.manualNumber || state.currentDoc.autoNumber;
        const docData = { ...state.currentDoc, number: num, totalTTC: total };
        const success = await Firebase.saveDocument(docData);
        if (success) {
            if (!state.currentDoc.manualNumber) { state.counters[state.currentDoc.type]++; await Firebase.saveCounters(); }
            Toast.show(`Document N° ${num} enregistré !`, 'success');
            this.newDocument(state.currentDoc.type);
        } else { Toast.show('Erreur lors de la sauvegarde', 'error'); }
    },

    generatePDF() {
        const doc = state.currentDoc;
        const c = state.company;
        const num = doc.manualNumber || doc.autoNumber;
        const filename = `${doc.type}_${num}.pdf`;

        // Utiliser jsPDF directement (plus fiable que html2canvas sur mobile)
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = margin;

        // Couleurs
        const black = [17, 17, 17];
        const gray = [102, 102, 102];
        const lightGray = [200, 200, 200];

        // === EN-TÊTE ===
        // Logo ou placeholder
        if (c.logo) {
            try {
                pdf.addImage(c.logo, 'PNG', margin, y, 20, 20);
            } catch (e) {
                pdf.setFillColor(232, 185, 35);
                pdf.roundedRect(margin, y, 20, 20, 3, 3, 'F');
                pdf.setFontSize(10);
                pdf.setTextColor(...black);
                pdf.text('PM', margin + 10, y + 12, { align: 'center' });
            }
        } else {
            pdf.setFillColor(232, 185, 35);
            pdf.roundedRect(margin, y, 20, 20, 3, 3, 'F');
            pdf.setFontSize(10);
            pdf.setTextColor(...black);
            pdf.text('PM', margin + 10, y + 12, { align: 'center' });
        }

        // Nom entreprise
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...black);
        pdf.text(c.name || 'PRO MANAGER', margin, y + 28);

        // Infos entreprise
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...gray);
        const addressLines = (c.address || '').split('\n');
        let infoY = y + 33;
        addressLines.forEach(line => {
            pdf.text(line, margin, infoY);
            infoY += 4;
        });
        pdf.text(`${c.phone || ''} • ${c.email || ''}`, margin, infoY);

        // Type de document (droite)
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...black);
        pdf.text(doc.type.toUpperCase(), pageWidth - margin, y + 5, { align: 'right' });

        // Numéro
        pdf.setFontSize(12);
        pdf.text(`N° ${num}`, pageWidth - margin, y + 14, { align: 'right' });

        // Date
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...gray);
        pdf.text(Utils.formatDate(doc.date), pageWidth - margin, y + 21, { align: 'right' });

        // Ligne de séparation
        y = 65;
        pdf.setDrawColor(...black);
        pdf.setLineWidth(0.8);
        pdf.line(margin, y, pageWidth - margin, y);

        // === CLIENT ===
        y += 10;
        const clientBoxX = pageWidth - margin - 75;
        const clientBoxWidth = 75;

        // Fond gris pour la box client
        pdf.setFillColor(249, 249, 249);
        pdf.roundedRect(clientBoxX, y, clientBoxWidth, 40, 2, 2, 'F');
        pdf.setDrawColor(229, 229, 229);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(clientBoxX, y, clientBoxWidth, 40, 2, 2, 'S');

        // Label
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(136, 136, 136);
        pdf.text('FACTURÉ À', clientBoxX + 5, y + 6);

        // Nom client
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...black);
        pdf.text(doc.client.name || 'Client', clientBoxX + 5, y + 14);

        // Adresse client
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...gray);
        const clientAddressLines = (doc.client.address || '').split('\n');
        let clientY = y + 20;
        clientAddressLines.slice(0, 2).forEach(line => {
            pdf.text(line.substring(0, 35), clientBoxX + 5, clientY);
            clientY += 4;
        });

        if (doc.client.phone) {
            pdf.text(doc.client.phone, clientBoxX + 5, clientY);
            clientY += 4;
        }

        // Véhicule / Immat
        if (doc.client.vehicle || doc.client.plate) {
            clientY += 2;
            pdf.setFontSize(8);
            pdf.text(`${doc.client.vehicle || ''} ${doc.client.plate || ''}`, clientBoxX + 5, clientY);
        }

        // === TABLEAU DES PRESTATIONS ===
        y += 50;

        // En-tête du tableau
        pdf.setFillColor(...black);
        pdf.rect(margin, y, contentWidth, 10, 'F');

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('DÉSIGNATION', margin + 3, y + 7);
        pdf.text('QTÉ', margin + contentWidth * 0.6, y + 7, { align: 'center' });
        pdf.text('P.U.', margin + contentWidth * 0.75, y + 7, { align: 'center' });
        pdf.text('TOTAL', pageWidth - margin - 3, y + 7, { align: 'right' });

        y += 10;

        // Lignes du tableau
        let totalHT = 0;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...black);

        doc.lines.forEach((line, index) => {
            const subtotal = line.qty * line.price;
            const discount = subtotal * (line.discount || 0) / 100;
            const lineTotal = subtotal - discount;
            totalHT += lineTotal;

            const parts = (line.desc || '').split('\n');
            const mainDesc = parts[0] || '';
            const subDesc = parts.slice(1).join(' ');

            // Calculer la hauteur nécessaire
            const lineHeight = subDesc ? 14 : 10;

            // Vérifier si on dépasse la page
            if (y + lineHeight > pageHeight - 60) {
                pdf.addPage();
                y = margin;
            }

            // Ligne de séparation
            pdf.setDrawColor(...lightGray);
            pdf.setLineWidth(0.2);
            pdf.line(margin, y + lineHeight - 1, pageWidth - margin, y + lineHeight - 1);

            // Description principale
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.text(mainDesc.substring(0, 50), margin + 3, y + 6);

            // Sous-description
            if (subDesc) {
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(...gray);
                pdf.text(subDesc.substring(0, 60), margin + 3, y + 11);
                pdf.setTextColor(...black);
            }

            // Quantité, Prix, Total
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(String(line.qty), margin + contentWidth * 0.6, y + 6, { align: 'center' });
            pdf.text(`${line.price.toFixed(2)}€`, margin + contentWidth * 0.75, y + 6, { align: 'center' });

            pdf.setFont('helvetica', 'bold');
            pdf.text(`${lineTotal.toFixed(2)}€`, pageWidth - margin - 3, y + 6, { align: 'right' });

            // Remise
            if (line.discount) {
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(...gray);
                pdf.text(`-${line.discount}%`, pageWidth - margin - 3, y + 10, { align: 'right' });
                pdf.setTextColor(...black);
            }

            y += lineHeight;
        });

        // === TOTAUX ===
        y += 10;
        const totalsX = pageWidth - margin - 60;

        // Total HT
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...gray);
        pdf.text('Total HT', totalsX, y);
        pdf.setTextColor(...black);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${totalHT.toFixed(2)} €`, pageWidth - margin, y, { align: 'right' });

        // Box Net à payer
        y += 8;
        pdf.setFillColor(...black);
        pdf.roundedRect(totalsX - 5, y - 5, 65, 18, 2, 2, 'F');

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('NET À PAYER', totalsX, y + 4);

        pdf.setFontSize(14);
        pdf.text(`${totalHT.toFixed(2)} €`, pageWidth - margin - 3, y + 5, { align: 'right' });

        // Note TVA
        y += 18;
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...gray);
        pdf.text('TVA non applicable, art. 293 B du CGI', pageWidth - margin, y, { align: 'right' });

        // === PIED DE PAGE ===
        const footerY = pageHeight - 15;
        pdf.setDrawColor(...lightGray);
        pdf.setLineWidth(0.3);
        pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        pdf.setFontSize(7);
        pdf.setTextColor(...gray);
        pdf.text(`${c.name} - SIRET: ${c.siret || ''}`, pageWidth / 2, footerY, { align: 'center' });
        pdf.text(c.legal || 'TVA non applicable, art. 293 B du CGI', pageWidth / 2, footerY + 4, { align: 'center' });

        // Sauvegarder
        pdf.save(filename);
        Toast.show('PDF téléchargé !', 'success');
    },

    loadDocument(id) {
        const doc = state.documents.find(d => d.id === id);
        if (!doc) return;
        state.currentDoc = JSON.parse(JSON.stringify(doc));
        DOM.btnFacture().classList.toggle('active', doc.type === 'facture');
        DOM.btnDevis().classList.toggle('active', doc.type === 'devis');
        DOM.docDate().value = state.currentDoc.date || '';
        DOM.docNumberAuto().value = state.currentDoc.autoNumber || '';
        DOM.docNumberManual().value = state.currentDoc.manualNumber || '';
        DOM.clientName().value = state.currentDoc.client?.name || '';
        DOM.clientAddress().value = state.currentDoc.client?.address || '';
        DOM.clientPhone().value = state.currentDoc.client?.phone || '';
        DOM.clientEmail().value = state.currentDoc.client?.email || '';
        DOM.clientSiret().value = state.currentDoc.client?.siret || '';
        DOM.clientVehicle().value = state.currentDoc.client?.vehicle || '';
        DOM.clientPlate().value = state.currentDoc.client?.plate || '';
        UI.renderLines();
        UI.renderPDFPreview();
        document.querySelector('[data-view="editor"]').click();
    },

    downloadDocument(id) { this.loadDocument(id); setTimeout(() => this.generatePDF(), 500); },

    previewDocument(id) {
        const doc = state.documents.find(d => d.id === id);
        if (!doc) return;
        const c = state.company;
        const num = doc.manualNumber || doc.number || doc.autoNumber;
        let total = 0;
        const linesHtml = (doc.lines || []).map(line => {
            const sub = line.qty * line.price; const disc = sub * (line.discount || 0) / 100; total += sub - disc;
            const parts = (line.desc || '').split('\n');
            return `<tr><td style="padding:12px;border-bottom:1px solid #eee;"><strong>${Utils.escapeHtml(parts[0])}</strong>${parts[1] ? `<br><small style="color:#666">${Utils.escapeHtml(parts.slice(1).join(' '))}</small>` : ''}</td><td style="text-align:center;padding:12px;border-bottom:1px solid #eee;">${line.qty}</td><td style="text-align:right;padding:12px;border-bottom:1px solid #eee;">${line.price.toFixed(2)}€</td><td style="text-align:right;padding:12px;border-bottom:1px solid #eee;font-weight:600;">${(sub - disc).toFixed(2)}€${line.discount ? `<br><small style="color:#888">-${line.discount}%</small>` : ''}</td></tr>`;
        }).join('');
        const logoHtml = c.logo ? `<img src="${c.logo}" style="height:60px;border-radius:8px;">` : '';
        document.getElementById('modal-pdf-preview').innerHTML = `<div style="font-family:'Inter',sans-serif;color:#111;padding:40px;min-height:1123px;position:relative;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:25px;border-bottom:3px solid #111;"><div>${logoHtml}<h1 style="font-size:1.4em;font-weight:800;margin:12px 0 6px;">${Utils.escapeHtml(c.name)}</h1><div style="font-size:0.85em;color:#555;line-height:1.5;">${Utils.escapeHtml(c.address).replace(/\n/g, '<br>')}<br>${Utils.escapeHtml(c.phone)} • ${Utils.escapeHtml(c.email)}</div></div><div style="text-align:right;"><div style="font-size:2.5em;font-weight:900;letter-spacing:1px;">${(doc.type || 'FACTURE').toUpperCase()}</div><div style="font-size:1.2em;font-weight:600;margin-top:6px;">N° ${Utils.escapeHtml(num)}</div><div style="margin-top:6px;color:#555;">${Utils.formatDate(doc.date)}</div></div></div><div style="display:flex;justify-content:flex-end;margin-bottom:35px;"><div style="width:45%;background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;padding:18px;"><div style="font-size:0.7em;text-transform:uppercase;font-weight:700;color:#888;margin-bottom:10px;">Facturé à</div><div style="font-weight:700;font-size:1.1em;margin-bottom:6px;">${Utils.escapeHtml(doc.client?.name) || 'Client'}</div><div style="font-size:0.9em;color:#555;white-space:pre-wrap;">${Utils.escapeHtml(doc.client?.address) || ''}</div>${doc.client?.phone ? `<div style="margin-top:8px;font-size:0.9em;">${Utils.escapeHtml(doc.client.phone)}</div>` : ''}${doc.client?.email ? `<div style="font-size:0.9em;">${Utils.escapeHtml(doc.client.email)}</div>` : ''}</div></div><table style="width:100%;border-collapse:collapse;margin-bottom:35px;"><thead><tr style="background:#111;color:#fff;"><th style="text-align:left;padding:12px;font-size:0.8em;text-transform:uppercase;">Désignation</th><th style="text-align:center;padding:12px;width:10%;font-size:0.8em;">Qté</th><th style="text-align:right;padding:12px;width:15%;font-size:0.8em;">P.U.</th><th style="text-align:right;padding:12px;width:15%;font-size:0.8em;">Total</th></tr></thead><tbody>${linesHtml}</tbody></table><div style="display:flex;justify-content:flex-end;"><div style="width:250px;"><div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;"><span style="color:#666;">Total HT</span><span style="font-weight:600;">${(doc.totalTTC || total).toFixed(2)} €</span></div><div style="background:linear-gradient(135deg,#111,#333);color:#fff;padding:15px;margin-top:12px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:600;text-transform:uppercase;font-size:0.85em;">Net à payer</span><span style="font-weight:800;font-size:1.6em;">${(doc.totalTTC || total).toFixed(2)} €</span></div><div style="text-align:right;margin-top:6px;font-size:0.7em;color:#888;">TVA non applicable, art. 293 B du CGI</div></div></div><div style="position:absolute;bottom:30px;left:40px;right:40px;text-align:center;font-size:0.7em;color:#888;padding-top:15px;border-top:1px solid #eee;"><strong>${Utils.escapeHtml(c.name)}</strong> - SIRET: ${Utils.escapeHtml(c.siret)}<br>${Utils.escapeHtml(c.legal)}</div></div>`;
        document.getElementById('preview-modal-title').textContent = `${doc.type.toUpperCase()} N° ${num}`;
        document.getElementById('modal-download-btn').onclick = () => { this.downloadDocument(id); this.closePreviewModal(); };
        document.getElementById('preview-modal').classList.add('show');
        lucide.createIcons();
    },

    closePreviewModal() { document.getElementById('preview-modal').classList.remove('show'); },

    async deleteDocument(id) { if (!confirm('Supprimer ce document ?')) return; const ok = await Firebase.deleteDocument(id); if (ok) Toast.show('Document supprimé', 'success'); else Toast.show('Erreur lors de la suppression', 'error'); },

    filterHistory(query) { const rows = DOM.historyList().querySelectorAll('tr'); const q = query.toLowerCase(); rows.forEach(row => { row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none'; }); },

    async saveSettings() {
        state.company.name = DOM.confCompany().value;
        state.company.siret = DOM.confSiret().value;
        state.company.phone = DOM.confPhone().value;
        state.company.email = DOM.confEmail().value;
        state.company.website = DOM.confWebsite().value;
        state.company.address = DOM.confAddress().value;
        state.company.legal = DOM.confLegal().value;
        const facture = parseInt(DOM.confCounterFacture().value);
        const devis = parseInt(DOM.confCounterDevis().value);
        if (!isNaN(facture)) state.counters.facture = facture;
        if (!isNaN(devis)) state.counters.devis = devis;
        await Firebase.saveCompany();
        await Firebase.saveCounters();
        Toast.show('Paramètres enregistrés', 'success');
        UI.renderPDFPreview();
    },

    handleLogoUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => { state.company.logo = event.target.result; await Firebase.saveCompany(); UI.updateLogos(); UI.renderPDFPreview(); Toast.show('Logo mis à jour', 'success'); };
        reader.readAsDataURL(file);
    },

    editService(index) {
        const s = state.services[index];
        if (!s) return;
        state.editingServiceId = index;
        DOM.serviceName().value = s.name;
        DOM.serviceDesc().value = s.desc || '';
        DOM.servicePrice().value = s.price;
        DOM.btnAddService().textContent = 'Modifier';
        DOM.catalogFormTitle().textContent = 'Modifier la prestation';
    },

    async addService() {
        const name = DOM.serviceName().value.trim();
        const desc = DOM.serviceDesc().value.trim();
        const price = parseFloat(DOM.servicePrice().value);
        if (!name || isNaN(price)) { Toast.show('Nom et prix requis', 'error'); return; }
        if (state.editingServiceId !== null) {
            state.services[state.editingServiceId] = { id: state.services[state.editingServiceId].id, name, desc, price };
            state.editingServiceId = null;
            DOM.btnAddService().textContent = 'Ajouter';
            DOM.catalogFormTitle().textContent = 'Ajouter une prestation';
        } else { state.services.push({ id: Date.now(), name, desc, price }); }
        await Firebase.saveServices();
        DOM.serviceName().value = '';
        DOM.serviceDesc().value = '';
        DOM.servicePrice().value = '';
        UI.renderCatalogList();
        UI.renderCatalogSelect();
        Toast.show('Prestation enregistrée', 'success');
    },

    async deleteService(index) {
        if (!confirm('Supprimer cette prestation ?')) return;
        state.services.splice(index, 1);
        await Firebase.saveServices();
        UI.renderCatalogList();
        UI.renderCatalogSelect();
        Toast.show('Prestation supprimée', 'success');
    },

    exportCSV() {
        const headers = ['Numéro', 'Type', 'Date', 'Client', 'Véhicule', 'Immatriculation', 'Montant'];
        const rows = state.documents.map(d => [
            d.number || '',
            d.type || '',
            d.date || '',
            d.client?.name || '',
            d.client?.vehicle || '',
            d.client?.plate || '',
            (d.totalTTC || 0).toFixed(2)
        ]);
        const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `export_comptabilite_${Utils.today()}.csv`;
        link.click();
        Toast.show('Export CSV téléchargé', 'success');
    },

    async exportAllPDF() {
        const invoices = state.documents.filter(d => d.type === 'facture');
        if (invoices.length === 0) {
            Toast.show('Aucune facture à exporter', 'info');
            return;
        }

        Toast.show(`Début de l'export de ${invoices.length} factures...`, 'info');

        for (let i = 0; i < invoices.length; i++) {
            const doc = invoices[i];
            await this.generatePDFForDoc(doc);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between downloads to avoid browser blocking
        }

        Toast.show('Export terminé avec succès', 'success');
    },

    generatePDFForDoc(doc) {
        return new Promise((resolve) => {
            const c = state.company;
            const num = doc.manualNumber || doc.autoNumber || doc.number;
            const filename = `${doc.type}_${num}.pdf`;

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let y = margin;

            const black = [17, 17, 17];
            const gray = [102, 102, 102];
            const lightGray = [200, 200, 200];

            // Logo placeholder
            if (c.logo) {
                // If we had logo logic for PDF it would go here, 
                // but previously it was just a placeholder. 
                // For now, consistent with request, we remove the "PM" placeholder.
            }

            // Nom entreprise
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(c.name || 'PRO MANAGER', margin, y + 28);

            // Infos entreprise
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            const addressLines = (c.address || '').split('\n');
            let infoY = y + 33;
            addressLines.forEach(line => { pdf.text(line, margin, infoY); infoY += 4; });
            pdf.text(`${c.phone || ''} • ${c.email || ''}`, margin, infoY);

            // Type de document
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...black);
            pdf.text((doc.type || 'FACTURE').toUpperCase(), pageWidth - margin, y + 5, { align: 'right' });
            pdf.setFontSize(12);
            pdf.text(`N° ${num}`, pageWidth - margin, y + 14, { align: 'right' });
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            pdf.text(Utils.formatDate(doc.date), pageWidth - margin, y + 21, { align: 'right' });

            // Ligne séparation
            y = 65;
            pdf.setDrawColor(...black);
            pdf.setLineWidth(0.8);
            pdf.line(margin, y, pageWidth - margin, y);

            // Client box
            y += 10;
            const clientBoxX = pageWidth - margin - 75;
            pdf.setFillColor(249, 249, 249);
            pdf.roundedRect(clientBoxX, y, 75, 40, 2, 2, 'F');
            pdf.setDrawColor(229, 229, 229);
            pdf.setLineWidth(0.3);
            pdf.roundedRect(clientBoxX, y, 75, 40, 2, 2, 'S');

            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(136, 136, 136);
            pdf.text('FACTURÉ À', clientBoxX + 5, y + 6);

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...black);
            pdf.text(doc.client?.name || 'Client', clientBoxX + 5, y + 14);

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            let clientY = y + 20;
            (doc.client?.address || '').split('\n').slice(0, 2).forEach(line => {
                pdf.text(line.substring(0, 35), clientBoxX + 5, clientY);
                clientY += 4;
            });
            if (doc.client?.phone) { pdf.text(doc.client.phone, clientBoxX + 5, clientY); clientY += 4; }
            if (doc.client?.vehicle || doc.client?.plate) {
                pdf.setFontSize(8);
                pdf.text(`${doc.client.vehicle || ''} ${doc.client.plate || ''}`, clientBoxX + 5, clientY + 2);
            }

            // Tableau
            y += 50;
            pdf.setFillColor(...black);
            pdf.rect(margin, y, contentWidth, 10, 'F');
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text('DÉSIGNATION', margin + 3, y + 7);
            pdf.text('QTÉ', margin + contentWidth * 0.6, y + 7, { align: 'center' });
            pdf.text('P.U.', margin + contentWidth * 0.75, y + 7, { align: 'center' });
            pdf.text('TOTAL', pageWidth - margin - 3, y + 7, { align: 'right' });
            y += 10;

            let totalHT = 0;
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...black);

            (doc.lines || []).forEach(line => {
                const subtotal = line.qty * line.price;
                const discount = subtotal * (line.discount || 0) / 100;
                const lineTotal = subtotal - discount;
                totalHT += lineTotal;

                const parts = (line.desc || '').split('\n');
                const lineHeight = parts[1] ? 14 : 10;

                if (y + lineHeight > pageHeight - 60) { pdf.addPage(); y = margin; }

                pdf.setDrawColor(...lightGray);
                pdf.setLineWidth(0.2);
                pdf.line(margin, y + lineHeight - 1, pageWidth - margin, y + lineHeight - 1);

                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.text((parts[0] || '').substring(0, 50), margin + 3, y + 6);

                if (parts[1]) {
                    pdf.setFontSize(7);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...gray);
                    pdf.text(parts.slice(1).join(' ').substring(0, 60), margin + 3, y + 11);
                    pdf.setTextColor(...black);
                }

                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                pdf.text(String(line.qty), margin + contentWidth * 0.6, y + 6, { align: 'center' });
                pdf.text(`${line.price.toFixed(2)}€`, margin + contentWidth * 0.75, y + 6, { align: 'center' });
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${lineTotal.toFixed(2)}€`, pageWidth - margin - 3, y + 6, { align: 'right' });

                y += lineHeight;
            });

            // Totaux
            y += 10;
            const totalsX = pageWidth - margin - 60;
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            pdf.text('Total HT', totalsX, y);
            pdf.setTextColor(...black);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${totalHT.toFixed(2)} €`, pageWidth - margin, y, { align: 'right' });

            y += 8;
            pdf.setFillColor(...black);
            pdf.roundedRect(totalsX - 5, y - 5, 65, 18, 2, 2, 'F');
            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255);
            pdf.text('NET À PAYER', totalsX, y + 4);
            pdf.setFontSize(14);
            pdf.text(`${totalHT.toFixed(2)} €`, pageWidth - margin - 3, y + 5, { align: 'right' });

            y += 18;
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...gray);
            pdf.text('TVA non applicable, art. 293 B du CGI', pageWidth - margin, y, { align: 'right' });

            // Footer
            const footerY = pageHeight - 15;
            pdf.setDrawColor(...lightGray);
            pdf.setLineWidth(0.3);
            pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
            pdf.setFontSize(7);
            pdf.text(`${c.name} - SIRET: ${c.siret || ''}`, pageWidth / 2, footerY, { align: 'center' });
            pdf.text(c.legal || '', pageWidth / 2, footerY + 4, { align: 'center' });

            pdf.save(filename);
            resolve();
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    lucide.createIcons();
});
