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
// import ico5 from "@/static/images/common/store.png";
// import ico5h from "@/static/images/common/store_red.png";
const icon_shangcheng = 'https://oss.tigshop.com/img/gallery/202506/1750235706G3T0k4KjmVXSlLlBO5.png?x-oss-process=image/resize,m_pad,h_200,h_200'
const icon_shangcheng_active = 'https://oss.tigshop.com/img/gallery/202506/1750235723t3RllCno9e7TjiY5pu.png?x-oss-process=image/resize,m_pad,h_200,h_200'
const icon_xuexi = 'https://oss.tigshop.com/img/gallery/202506/17502367225OBvLROqi9Qqcsv31a.png?x-oss-process=image/resize,m_pad,h_200,h_200'
const icon_xuexi_active = 'https://oss.tigshop.com/img/gallery/202506/1750236722U8VxhtEUvshKQnhwak.png?x-oss-process=image/resize,m_pad,h_200,h_200'
const icon_shebei = 'https://oss.tigshop.com/img/gallery/202506/1750236722tDpqOsWqa6TCBJgOsN.png?x-oss-process=image/resize,m_pad,h_200,h_200'
const icon_shebei_active = 'https://oss.tigshop.com/img/gallery/202506/1750236722NBgVSHeVLc9ppjC34o.png?x-oss-process=image/resize,m_pad,h_200,h_200'




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
				image: icon_xuexi,
				activeImage: icon_xuexi_active,
                text: '学习',
                isMall:false
			},{
				link: '/pages/mall/index/index',
				image: icon_shangcheng,
				activeImage: icon_shangcheng_active,
                text: '商城',
                isMall:false
			},{
				link: '/pages/demo/index',
				image: icon_shebei,
				activeImage: icon_shebei_active,
                text: '设备',
                isMall:false
			}]
			
        } catch (error) {
            tabbarList.value = [
                {
                    link: '/pages/index/index',
                    image: icon_xuexi,
                    activeImage: icon_xuexi_active,
                    text: '学习',
                    isMall:false
                },{
                    link: '/pages/mall/index/index',
                    image: icon_shangcheng,
                    activeImage: icon_shangcheng_active,
                    text: '商城',
                    isMall:false
                },{
                    link: '/pages/demo/index',
                    image: icon_shebei,
                    activeImage: icon_shebei_active,
                    text: '设备',
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
