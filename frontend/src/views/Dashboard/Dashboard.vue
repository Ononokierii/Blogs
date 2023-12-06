<template>
  <n-layout>
    <n-layout-header bordered class="header">
      <n-space align="center" justify="space-between" class="header__content">
        <div>
          <router-link to="/dashboard">blog后台</router-link>
        </div>
        <div>
          <n-space align="center">
            <n-button @click="toggleTheme">light/dark</n-button>
            <n-button @click="authStore.logout">logout</n-button>
          </n-space>
        </div>
      </n-space>
    </n-layout-header>
    <n-layout has-sider class="wrapper">
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="10"
        :width="180"
        :native-scrollbar="true"
        show-trigger="arrow-circle"
        bordered
        class="sidebar"
      >
        <n-menu :options="menus" />
      </n-layout-sider>
      <n-layout-content bordered class="content">
        <n-scrollbar>
          <router-view></router-view>
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, inject, h } from "vue";
import { RouterLink } from "vue-router";
import { AuthStore } from "@/stores/AuthStore";

const authStore = AuthStore();

const toggleTheme = inject<() => void>("toggleTheme");

const menus = ref([
  {
    label: () =>
      h(RouterLink, { to: { name: "blog" } }, { default: () => "文章管理" }),
    key: "article",
  },
  {
    label: () =>
      h(
        RouterLink,
        { to: { name: "category" } },
        { default: () => "分类管理" }
      ),
    key: "category",
  },
  {
    label: () =>
      h(RouterLink, { to: { name: "blogs" } }, { default: () => "公开页面" }),
    key: "public",
  },
]);
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  &__content {
    width: 100%;
  }
}

.sidebar,
.content {
  height: calc(100vh - 60px);
}

.content {
  padding: 20px;
}
</style>
