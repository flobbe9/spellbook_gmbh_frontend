import { getRandomString, isBlank, log, logError, logReturnNull, logWarn, stringToNumber, tryCatchReturnNull } from "../utils/genericUtils";
import { CRYPTO_ALG, CRYPTO_COUNTER, CRYPTO_KEY, CRYPTO_LENGTH } from "../utils/constants";


/**
 * @since 0.0.1
 */
export class CryptoHelper {

    private crypto: SubtleCrypto;

    private key: CryptoKey;

    private algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams;

    private algorithmName: string;

    private counter: ArrayBuffer;


    constructor() {

        this.crypto = window.crypto.subtle;
        this.algorithmName = CRYPTO_ALG;
        this.counter = CRYPTO_COUNTER;
        this.algorithm = {
            name: this.algorithmName,
            counter: this.counter,
            length: CRYPTO_LENGTH
        };
    }


    /**
     * Generate encryption key using the {@link CRYPTO_KEY}.
     * 
     * @returns ```this```
     */
    async build(): Promise<CryptoHelper> {

        this.key = await this.crypto.importKey("raw", CRYPTO_KEY, this.algorithmName, true, ["encrypt", "decrypt"]);

        return this;
    }
    

    /**
     * @param decryptedValue raw string or object to encrypt
     * @param debug if true, errors will be logged (not containing sensitive details). Default is false
     * @returns the encrypted string or null in case of error
     */
    async encrypt(decryptedValue: string | object, debug = false): Promise<string | null> {

        if (!decryptedValue)
            return logReturnNull(debug, "Failed to encrypt. 'decryptedValue' is falsy.");

        const decryptedArrayBuffer = this.anyToArrayBuffer(decryptedValue);
        if (decryptedArrayBuffer === null)
            return logReturnNull(debug, "Failed to encrypt. 'decryptedArrayBuffer' is falsy.");

        const encryptedArrayBuffer = await this.crypto.encrypt(this.algorithm, this.key, decryptedArrayBuffer);

        const encrytpedValue = this.arrayBufferToString(encryptedArrayBuffer);
        if (!encrytpedValue)
            return logReturnNull(debug, "Failed to encrypt. 'encrytpedValue' is falsy.");

        return encrytpedValue;
    }


    /**
     * 
     * @param encryptedValue encrypted value as string. Use {@link arrayBufferToString} for conversion
     * @param parseJson if true, the value will be parsed to json after beeing decrypted
     * @param debug if true, errors will be logged (not containing sensitive details). Default is false
     * @returns 
     */
    async decrypt(encryptedValue: string, parseJson: boolean, debug = false): Promise<object | string | null> {

        if (!encryptedValue)
            return logReturnNull(debug, "Failed to decrypt. 'encryptedValue' is falsy.");

        const encryptedArrayBuffer = this.stringToArrayBuffer(encryptedValue);
        if (!encryptedArrayBuffer)
            return logReturnNull(debug, "Failed to decrypt. 'encryptedArrayBuffer' is falsy.");
        
        const decryptedArrayBuffer = await this.crypto.decrypt(this.algorithm, this.key, encryptedArrayBuffer);

        const decryptedvalue = this.arrayBufferToAny(decryptedArrayBuffer, parseJson);
        if (!decryptedvalue)
            return logReturnNull(debug, "Faiiled to decrypt. 'decryptedValue' is falsy.");

        return decryptedvalue;
    }
    
    
    /**
     * @param obj object to convert to array buffer. Expected to be of type string or a json object
     * @returns ArrayBuffer of given string or if type is not string, the stringified json. Return null if json could not be stringified
     */
    private anyToArrayBuffer(obj: object | string): ArrayBuffer | null {

        if (typeof obj === "string")
            return this.stringToArrayBuffer(obj);

        return tryCatchReturnNull(() => 
            this.stringToArrayBuffer(JSON.stringify(obj)));
    }


    /**
     * @param arrayBuffer to convert to object or string
     * @param parseJson if true, converted arrayBuffer will be parsed to JSON
     * @returns the result from the conversion, either a string or an object. Return null in case of error.
     */
    private arrayBufferToAny(arrayBuffer: ArrayBuffer, parseJson: boolean): object | string | null {

        if (!parseJson)
            return this.arrayBufferToString(arrayBuffer);

        return tryCatchReturnNull(() => 
            JSON.parse(this.arrayBufferToString(arrayBuffer)!));
    }


    /**
     * @param arrayBuffer to convert to string
     * @returns converted string
     */
    private arrayBufferToString(arrayBuffer: ArrayBuffer): string {

        return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer));
    }


    /**
     * From https://gist.github.com/skratchdot/e095036fad80597f1c1a
     * 
     * @param str to convert to ArrayBuffer
     * @returns an array buffer from given string or null
     */
    private stringToArrayBuffer(str: string): ArrayBuffer {

        const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        const bufView = new Uint16Array(buf);

        for (var i = 0, strLen = str.length; i < strLen; i++)
            bufView[i] = str.charCodeAt(i);
        
        return buf;
    }
}
