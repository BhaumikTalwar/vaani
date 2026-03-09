// @ts-check

/**
 * @typedef {object} Codec
 * @property {(data: any) => string | Uint8Array} encode the encode func
 * @property {(data: ArrayBuffer | Uint8Array) => any} decode the decode func
 * @property {string} contentType the Content type gheader
 * @property {string} accept the accept header
 * @property {(contentType: string) => boolean} supports the supported conten type header
 */

/** @type {Codec} */
export const JsonCodec = {
    contentType: "application/json",
    accept: "application/json",

    supports: (ct) =>
        ct.includes("application/json") ||
        ct.includes("+json"),

    encode: (data) => JSON.stringify(data),
    decode: (data) => {
        const buf =
            data instanceof Uint8Array
                ? data
                : new Uint8Array(data);

        return JSON.parse(new TextDecoder().decode(buf));
    },
};
