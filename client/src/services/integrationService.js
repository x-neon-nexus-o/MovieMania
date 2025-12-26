import api from './api';

const integrationService = {
    // Trakt Integration
    connectTrakt: async (code) => {
        const response = await api.post('/integrations/trakt/callback', { code });
        return response.data;
    },

    syncTrakt: async () => {
        const response = await api.post('/integrations/trakt/sync');
        return response.data;
    },

    // Import/Export
    getImportFormats: async () => {
        const response = await api.get('/import/formats');
        return response.data;
    },

    importCsv: async (file, format) => {
        const formData = new FormData();
        // Read file content as text since our backend expects raw CSV string in JSON body for simplicity in the current controller 
        // OR we can update backend to handle multipart. 
        // The current backend `importController.js` expects `{ csvData: "..." }`.

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const text = e.target.result;
                    const response = await api.post('/import', {
                        csvData: text,
                        skipDuplicates: true
                    });
                    resolve(response.data);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
    }
};

export default integrationService;
