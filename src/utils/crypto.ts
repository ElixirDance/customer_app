import CryptoJS from "crypto-js";

//接口加密密钥--请自行修改
export const KEY = "TigShopApiSecret";
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word: any, keyWord = "XwKsGlMcdPMEhR1B") {
    const key = CryptoJS.enc.Utf8.parse(keyWord);
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}
