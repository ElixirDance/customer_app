import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getMobileNav } from "@/api/tabbar";
import { useConfigStore } from "@/store/config";
import { urlFormat } from "@/utils/format";
import ico1 from "@/static/images/common/ico_1.png";
import ico2 from "@/static/images/common/ico_2.png";
import ico3 from "@/static/images/common/ico_3.png";
import ico4 from "@/static/images/common/ico_4.png";
import ico1h from "@/static/images/common/ico_1h.png";
import ico2h from "@/static/images/common/ico_2h.png";
import ico3h from "@/static/images/common/ico_3h.png";
import ico4h from "@/static/images/common/ico_4h.png";

export const useTabbarStore = defineStore("tabbar", () => {
    
    const tabbarList = ref<any[]>([]);
    const tabbarHeightNum = ref(60);
    const currRoute = ref("");

    const tabbarHeight = computed(() => {
        const configStore = useConfigStore();
        return tabbarHeightNum.value + configStore.safeBottom + "px";
    });

    const formatTabarList = ref<string[]>([]);

    const currentActiveValue = computed(() => {
        
        const index = [...formatTabarList.value, '/pages/index/index','pages/demo/index'].findIndex((item) => {
            return `/${currRoute.value}` === item;
        });
        return index;
    });

    async function getTabbarList() {
        
        try {
            const result = await getMobileNav();
            formatTabarList.value = result.data.navList.map((item: any) => {
                return urlFormat(item.picLink).split("?")[0];
            });
            tabbarList.value = result.data.navList.map((item: any) => {
                return {
                    link: item.picLink,
                    image: item.picThumb,
                    activeImage: item.picActiveThumb,
                    text: item.picTitle,
                    isMall:true
                };
            });
			
			const firstItem = tabbarList.value[0]
			
			tabbarList.value = [...tabbarList.value, {
				link: '/pages/index/index',
				image: firstItem.image,
				activeImage: firstItem.activeImage,
                text: '首页',
                isMall:false
			},{
				link: '/pages/mall/index/index',
				image: firstItem.image,
				activeImage: firstItem.activeImage,
                text: '商城',
                isMall:false
			},{
				link: '/pages/demo/index',
				image: firstItem.image,
				activeImage: firstItem.activeImage,
                text: '测试',
                isMall:false
			}]
			
        } catch (error) {
            tabbarList.value = [
                {
                    link: '/pages/index/index',
                    image: ico1,
                    activeImage: ico1h,
                    text: '首页',
                    isMall:false
                },{
                    link: '/pages/mall/index/index',
                    image: ico1,
                    activeImage: ico1h,
                    text: '商城',
                    isMall:false
                },{
                    link: '/pages/demo/index',
                    image: ico1,
                    activeImage: ico1h,
                    text: '测试',
                    isMall:false
                },
                {
                    link: "/pages/mall/index/index",
                    image: ico1,
                    activeImage: ico1h,
                    text: "首页",
                    isMall:true
                },
                {
                    link: "/pages/mall/productCate/index",
                    image: ico2,
                    activeImage: ico2h,
                    text: "分类",
                    isMall:true
                },
                {
                    link: "/pages/mall/cart/index",
                    image: ico3,
                    activeImage: ico3h,
                    text: "购物车",
                    isMall:true
                },
                {
                    link: "/pages/user/index",
                    image: ico4,
                    activeImage: ico4h,
                    text: "我的",
                    isMall:true
                }
            ];
            console.error(error);
        }
    }

    const isMallPage = computed(() => {
        return currRoute.value.includes('pages/mall')
    })

   

    return {
        tabbarList,
        tabbarHeightNum,
        tabbarHeight,
        formatTabarList,
        currentActiveValue,
        currRoute,
        getTabbarList,
        isMallPage
    };
});
