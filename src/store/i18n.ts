import { defineStore } from "pinia";
import { ref } from "vue";
import { getLang, getLangList, getDefaultLang } from "@/api/common";
import { useI18n } from "vue-i18n";
import type { LangListItem } from "@/types/common";
import { useStorageData } from "@/hooks";

export const useI18nStore = defineStore("i18n", () => {
    // 语言列表
    const langList = ref<LangListItem[]>([]);
    // 默认语言编码
    const defaultLocaleCode = ref("");

    const { locale, setLocaleMessage, messages } = useI18n();
    // 使用本地存储
    const { data, setStorageData } = useStorageData("localeLang");

    // 获取语言列表
    const getLangListData = async () => {
        try {
            const result = await getLangList();
            langList.value = result;
        } catch (error) {
            console.error(error);
        }
    };

    // 获取语言数据
    const getLangData = async (localeCode: string) => {
        try {
            const result = await getLang(localeCode);
            setDefaultLocaleCode(localeCode);
            setLangData(localeCode, result);

            // console.log('messages', messages.value);
        } catch (error) {
            console.error(error);
        }
    };

    // 获取默认语言配置
    const getDefaultLangConfig = async (code?: string) => {
        // 本地语言缓存数据是否存在
        if (data.value) {
            setDefaultLocaleCode(data.value.localeCode);
            setLangData(data.value.localeCode, data.value.langData);
            return;
        }

        const codeStr = code || uni.getLocale();
        try {
            const result = await getDefaultLang(codeStr);
            await getLangData(result.localeCode);
        } catch (error) {
            console.error(error);
        }
    };

    // 设置默认语言编码
    const setDefaultLocaleCode = (localeCode: string) => {
        defaultLocaleCode.value = localeCode;
        uni.setLocale(localeCode);
    };

    // 设置语言数据
    const setLangData = (localeCode: string, langData: any) => {
        locale.value = localeCode;
        setLocaleMessage(localeCode, langData);
        setStorageData({
            localeCode,
            langData
        });
    };

    return {
        langList,
        defaultLocaleCode,
        getLangData,
        getLangListData,
        getDefaultLangConfig
    };
});
