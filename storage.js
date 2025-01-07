const { create } = window.IpfsHttpClient;

// Initialize IPFS client with HTTPS gateway
const ipfs = create({ url: "https://infura-ipfs.io" });

const StorageManager = {
    local: {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        load: (key) => JSON.parse(localStorage.getItem(key)) || [],
        saveCID: (key, cid) => localStorage.setItem(`${key}-cid`, cid), // Save CID locally
        loadCID: (key) => localStorage.getItem(`${key}-cid`), // Load CID from localStorage
    },
    ipfs: {
        save: async (key, data) => {
            try {
                const { cid } = await ipfs.add({ content: JSON.stringify(data) });
                console.log(`Saved to IPFS with CID: ${cid.toString()}`);
                StorageManager.local.saveCID(key, cid.toString());
                return cid.toString();
            } catch (error) {
                console.error("Error saving to IPFS:", error);
            }
        },
        load: async (key) => {
            const cid = StorageManager.local.loadCID(key);
            if (!cid) return [];
            try {
                const chunks = [];
                for await (const chunk of ipfs.cat(cid)) {
                    chunks.push(chunk);
                }
                return JSON.parse(Buffer.concat(chunks).toString());
            } catch (error) {
                console.error("Error loading from IPFS:", error);
                return [];
            }
        },
    },
};

export default StorageManager;
