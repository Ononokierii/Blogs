<template>
  <n-layout>
    <n-layout-header bordered class="header">
      <n-space align="center" justify="space-between" class="header__content">
        <div>
          <h2>blogs</h2>
        </div>
        <div>
          <n-space align="center">
            <n-button @click="toggleTheme">light/dark</n-button>
            <n-button @click="router.push('/login')">Login</n-button>
          </n-space>
        </div>
      </n-space>
    </n-layout-header>
    <n-layout>
      <n-layout-content bordered class="content">
        <n-scrollbar>
          <n-space vertical>
            <n-card>
              <n-space align="center">
                <n-popselect
                  v-model:value="searchConditions.currentCategoryId"
                  trigger="click"
                  :options="categoryList"
                >
                  <n-button ghost type="success">{{
                    currentCategoryLabel
                  }}</n-button>
                </n-popselect>
                <n-input
                  v-model:value="searchConditions.keyword"
                  placeholder="请输入关键字"
                />
                <n-button ghost type="info" @click="getBlogList(true)"
                  >搜索</n-button
                >
              </n-space>
            </n-card>
            <n-card
              v-for="blog in blogList"
              :key="blog.id"
              hoverable
              :title="blog.title"
              class="blog--wrapper"
              @click="router.push(`/blogs/${blog.id}`)"
            >
              <template #default>
                <div>{{ blog.content }}</div>
              </template>
              <template #footer
                ><n-space align="center">
                  {{
                    formatDate(
                      blog.update_time ? blog.update_time : blog.create_time
                    )
                  }}
                </n-space></template
              >
            </n-card>
          </n-space>
          <n-divider />
          <n-pagination
            v-model:page="pageInfo.currentPage"
            :page-count="pageInfo.pageTotal"
            @update:page="getBlogList()"
          />
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, computed } from "vue";
import axios from "@/libs/axios";
import {
  BlogInfo,
  BlogResponse,
  CategoryInfo,
  SearchConditions,
} from "@/types";
import { useMessage, useLoadingBar } from "naive-ui";
import { useRouter } from "vue-router";

const message = useMessage();
const loadingBar = useLoadingBar();

const router = useRouter();

const blogList = ref<BlogInfo[]>([]);
const pageInfo = ref({
  currentPage: 1,
  pageSize: 10,
  pageTotal: 0,
});

const searchConditions = ref<SearchConditions>({
  keyword: "",
  currentCategoryId: "",
});

const categoryList = ref<{ label: string; value: string }[]>();

const currentCategoryLabel = computed(() => {
  if (!searchConditions.value.currentCategoryId) return "分类";
  const category = categoryList.value?.find(
    (item) => item.value === searchConditions.value.currentCategoryId
  );
  return category?.label;
});

const toggleTheme = inject<() => void>("toggleTheme");

const formatDate = (date: string | undefined) => {
  if (!date) return;
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const getCategoryList = async () => {
  try {
    const res = await axios.get("/category/list");
    if (res.status) {
      categoryList.value = res.data.result.map((item: CategoryInfo) => ({
        label: item.name,
        value: item.id,
      }));
      categoryList.value?.push({
        label: "全部",
        value: "",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const getBlogList = async (isSearch?: boolean) => {
  try {
    loadingBar.start();
    isSearch && (pageInfo.value.currentPage = 1);
    const getQuery = () => {
      const tem = {
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize,
        keyword: searchConditions.value.keyword,
        category_id: searchConditions.value.currentCategoryId,
      };
      return Object.keys(tem)
        .reduce((acc: string[], cur) => {
          if (tem[cur]) {
            acc.push(`${cur}=${tem[cur]}`);
          }
          return acc;
        }, [])
        .join("&");
    };
    const res = (await axios.get(`/blogs/list?${getQuery()}`)) as BlogResponse;
    if (res.status) {
      blogList.value = res.data.result;
      pageInfo.value.pageTotal = Math.ceil(
        res.data.total / pageInfo.value.pageSize
      );
      loadingBar.finish();
    }
  } catch (error) {
    loadingBar.error();
    message.error("获取文章列表失败");
    console.log(error);
  }
};

onMounted(() => {
  getBlogList();
  getCategoryList();
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

.blog--wrapper {
  &:hover {
    cursor: pointer;
    background-color: rgb(126, 126, 126);
  }
}
</style>
