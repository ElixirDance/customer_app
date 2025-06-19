<template>
    <tig-layout>
        <up-navbar title="demo" @leftClick="onBack" leftIconColor="#000000" :fixed="false" bgColor="#ffffff" titleColor="#000000">
        </up-navbar>
        <up-cell-group>
            <up-cell title="儿童专属档案" isLink url="/pages/childManage/index"></up-cell>
            <up-cell title="站内搜索" isLink url="/pages/siteSearch/index"></up-cell>
            <up-cell title="家庭管理" isLink url="/pages/familyManage/index"></up-cell>
            <up-cell title="分析" isLink url="/pages/analytics/index"></up-cell>
            <up-cell title="聊天AI" isLink url="/pages/chatAI/index"></up-cell>
            <up-cell title="跟孩子聊天" isLink url="/pages/chat/index"></up-cell>
            <up-cell title="课程教案生成" isLink url="/pages/lessonPlan/index"></up-cell>
        </up-cell-group>
    </tig-layout>
</template>

<script lang="ts" setup>
	function onBack() {
		uni.navigateBack()
	}
</script>

<style></style>
