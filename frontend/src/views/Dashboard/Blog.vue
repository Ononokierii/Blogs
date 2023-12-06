<template>
  <n-tabs
    v-model:value="currentTab"
    default-value="list"
    animated
    @before-leave="handleBeforeLeave"
  >
    <n-tab-pane name="list" tab="文章列表">
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
              <n-button ghost type="info" @click="getBlogDetail(blog.id)"
                >编辑</n-button
              >
              <n-button ghost type="error" @click="deleteBlog(blog.id)"
                >删除</n-button
              >
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
    </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form class="blogform">
        <n-form-item label="标题">
          <n-input placeholder="请输入标题" v-model:value="blogData.title" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="blogData.category_id"
            :options="categoryList"
          />
        </n-form-item>
        <n-form-item>
          <n-space align="center" justify="center" style="width: 100%">
            <n-button @click="addBlog">提交</n-button>
            <n-button @click="clearBlogData">清空</n-button>
          </n-space>
        </n-form-item>
      </n-form>
      <RichEditor v-model:modelValue="blogData.content" />
    </n-tab-pane>
    <n-tab-pane name="edit" tab="修改文章">
      <n-form class="blogform">
        <n-form-item label="标题">
          <n-input placeholder="请输入标题" v-model:value="blogData.title" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="blogData.category_id"
            :options="categoryList"
          />
        </n-form-item>
        <n-form-item>
          <n-space align="center" justify="center" style="width: 100%">
            <n-button @click="updateBlog">提交</n-button>
            <n-button @click="clearBlogData">清空</n-button>
          </n-space>
        </n-form-item>
      </n-form>
      <RichEditor v-model:modelValue="blogData.content" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "@/libs/axios";
import {
  BlogInfo,
  BlogResponse,
  CategoryInfo,
  SearchConditions,
} from "@/types";
import RichEditor from "@/components/RichEditor.vue";
import { useMessage, useDialog, useLoadingBar } from "naive-ui";

const message = useMessage();
const dialog = useDialog();
const loadingBar = useLoadingBar();

const currentTab = ref("list");
const searchConditions = ref<SearchConditions>({
  keyword: "",
  currentCategoryId: "",
});

const currentCategoryLabel = computed(() => {
  if (!searchConditions.value.currentCategoryId) return "分类";
  const category = categoryList.value?.find(
    (item) => item.value === searchConditions.value.currentCategoryId
  );
  return category?.label;
});

const handleBeforeLeave = (tabName: string) => {
  if (tabName === "edit") {
    message.warning("请先选择文章");
    return false;
  }
  return true;
};

const blogData = ref<{
  title: string;
  content: string;
  category_id: string;
}>({
  title: "",
  content: "",
  category_id: "",
});

const categoryList = ref<{ label: string; value: string }[]>();
const blogList = ref<BlogInfo[]>([]);
const pageInfo = ref({
  currentPage: 1,
  pageSize: 10,
  pageTotal: 0,
});

const formatDate = (date: string | undefined) => {
  if (!date) return;
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const clearBlogData = () => {
  blogData.value = {
    title: "",
    content: "",
    category_id: "",
  };
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

const getBlogDetail = async (blogId: string) => {
  currentTab.value = "edit";
  try {
    loadingBar.start();
    const res = await axios.get(`/blogs/detail?id=${blogId}`);
    if (res.status) {
      blogData.value = res.data.result;
      loadingBar.finish();
    }
  } catch (e) {
    loadingBar.error();
    message.error("获取文章失败");
    console.log(e);
  }
};

const addBlog = async () => {
  try {
    const res = await axios.post("/blogs/add", blogData.value);
    if (res.status) {
      console.log(res.data);
      getBlogList();
      currentTab.value = "list";
      clearBlogData();
      message.success("添加文章成功");
    }
  } catch (e) {
    message.error("添加文章失败");
    console.log(e);
  }
};

const updateBlog = async () => {
  try {
    const res = await axios.put("/blogs/update", blogData.value);
    if (res.status) {
      console.log(res.data);
      getBlogList();
      currentTab.value = "list";
      clearBlogData();
      message.success("修改文章成功");
    }
  } catch (e) {
    message.error("修改文章失败");
    console.log(e);
  }
};

const deleteBlog = async (blogId: string) => {
  dialog.warning({
    title: "删除文章",
    content: "确定要删除文章吗?",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      try {
        const res = await axios.delete(`/blogs/delete?id=${blogId}`);
        if (res.status) {
          console.log(res.data);
          getBlogList();
          message.success("删除文章成功");
        }
      } catch (e) {
        console.log(e);
        message.error("删除文章失败");
      }
    },
    onNegativeClick: () => {
      return;
    },
  });
};

onMounted(() => {
  getBlogList();
  getCategoryList();
});
</script>

<style scoped lang="scss">
.blogform {
  width: 50%;
  margin: 0 auto;
  min-width: 300px;
}
</style>
