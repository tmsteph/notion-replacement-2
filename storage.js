// Use IPFS client from the CDN
const { create } = window.IpfsHttpClient;

// Initialize IPFS client
const ipfs = create({ url: "https://ipfs.io" });

const StorageManager = {
    local: {
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        load: (key) => JSON.parse(localStorage.getItem(key)) || [],
    },
    ipfs: {
        save: async (key, data) => {
            try {
                const { cid } = await ipfs.add(JSON.stringify(data));
                console.log(`Saved to IPFS with CID: ${cid.toString()}`);
                localStorage.setItem(`${key}-cid`, cid.toString()); // Save CID locally
                return cid.toString();
            } catch (error) {
                console.error("Error saving to IPFS:", error);
            }
        },
        load: async (key) => {
            const cid = localStorage.getItem(`${key}-cid`);
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
