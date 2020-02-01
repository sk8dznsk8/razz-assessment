const CryptoJS = require('crypto-js');

const crypto = () => {
    return {
        encryptObject(object) {
            return CryptoJS.AES.encrypt(JSON.stringify(object), process.env.AES_SECRET).toString();
        },
        decryptCipher(cipher) {
            const bytes = CryptoJS.AES.decrypt(cipher, process.env.AES_SECRET);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        },
        generateCipherObject(object) {
            return {
                cipher: this.encryptObject(object)
            };
        }
    }
}

module.exports = crypto;