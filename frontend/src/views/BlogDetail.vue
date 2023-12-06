<template>
  <n-layout>
    <n-layout-header bordered class="header">
      <n-space align="center" justify="space-between" class="header__content">
        <div><n-button @click="router.push(`/blogs`)">返回</n-button></div>
        <div>
          <h1>{{ blogData.title }}</h1>
        </div>
        <div>
          <n-space align="center">
            <n-button @click="toggleTheme">light/dark</n-button>
          </n-space>
        </div>
      </n-space>
    </n-layout-header>
    <n-layout>
      <n-layout-content bordered class="content">
        <n-scrollbar>
          <RichEditor v-model:modelValue="blogData.content" :readOnly="true" />
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject } from "vue";
import axios from "@/libs/axios";
import { useLoadingBar } from "naive-ui";
import RichEditor from "@/components/RichEditor.vue";

const loadingBar = useLoadingBar();
const route = useRoute();
const router = useRouter();

const toggleTheme = inject<() => void>("toggleTheme");

const blogData = ref<{
  title: string;
  content: string | object;
  category_id: string;
}>({
  title: "",
  content: "",
  category_id: "",
});

const getBlogDetail = async () => {
  try {
    loadingBar.start();
    const res = await axios.get(`/blogs/detail?id=${route.params.id}`);
    if (res.status) {
      blogData.value = res.data.result;
      loadingBar.finish();
    }
  } catch (e) {
    loadingBar.error();
    console.log(e);
  }
};

onMounted(() => {
  getBlogDetail();
});
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
.content {
  height: calc(100vh - 60px);
  padding: 20px;
}
</style>
