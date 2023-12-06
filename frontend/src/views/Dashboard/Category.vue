<template>
  <n-space vertical>
    <n-button ghost type="success" @click="openAddOrEditModal()"
      >添加分类</n-button
    >
    <n-table striped :single-line="false">
      <thead>
        <tr>
          <th>分类ID</th>
          <th>分类名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <n-button ghost type="info" @click="openAddOrEditModal(category)"
                >编辑</n-button
              >
              <n-button ghost type="error" @click="deleteCategory(category.id)"
                >删除</n-button
              >
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-space>
  <app-modal
    ref="addOrEditModal"
    :title="addOrEditCategoryInfo.id ? '编辑分类' : '添加分类'"
  >
    <template #default>
      <label
        >分类名称
        <n-input v-model:value="addOrEditCategoryInfo.name"></n-input>
      </label>
    </template>
    <template #action>
      <div>
        <n-space>
          <n-button type="error" @click="addOrEditModal?.closeModal"
            >取消</n-button
          >
          <n-button type="info" @click="addOrEditCategory">确定</n-button>
        </n-space>
      </div>
    </template>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/libs/axios.ts";
import { CategoryInfo, CategoryResponse } from "@/types";
import { useMessage, useDialog, useLoadingBar } from "naive-ui";
import AppModal from "@/components/AppModal.vue";

const message = useMessage();
const dialog = useDialog();
const loadingBar = useLoadingBar();

const categories = ref<CategoryInfo[]>([]);

const getCateGories = async () => {
  try {
    loadingBar.start();
    const res = (await axios.get(
      "/category/list"
    )) as unknown as CategoryResponse;
    if (res.status) {
      categories.value = res.data.result;
      loadingBar.finish();
    }
  } catch (error) {
    loadingBar.error();
    message.error("获取分类列表失败");
    return;
  }
};

const addOrEditModal = ref<InstanceType<typeof AppModal>>();
const openAddOrEditModal = (category?: CategoryInfo) => {
  addOrEditModal.value?.openModal();
  if (category) addOrEditCategoryInfo.value = { ...category };
};

const addOrEditCategoryInfo = ref<Partial<CategoryInfo>>({
  id: "",
  name: "",
});

const addOrEditCategory = async () => {
  const isNew = addOrEditCategoryInfo.value.id ? false : true;
  try {
    let res;
    if (isNew) {
      res = await axios.post("/category/add", {
        name: addOrEditCategoryInfo.value.name,
      });
    } else {
      res = await axios.put("/category/update", {
        id: addOrEditCategoryInfo.value.id,
        name: addOrEditCategoryInfo.value.name,
      });
    }
    if (res.status) {
      message.success(isNew ? "添加分类成功" : "更新分类成功");
      getCateGories();
    }
  } catch (error) {
    message.error(isNew ? "添加分类失败" : "更新分类失败");
  }
  addOrEditModal.value?.closeModal();
  addOrEditCategoryInfo.value = {} as CategoryInfo;
  return;
};

const deleteCategory = (categoryId: string) => {
  dialog.warning({
    title: "删除分类",
    content: "确定要删除分类吗?",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      try {
        const res = await axios.delete(`/category/delete?id=${categoryId}`);
        if (res.status) {
          message.success("删除分类成功");
          getCateGories();
        }
      } catch (error) {
        message.error("删除分类失败");
        return;
      }
    },
    onNegativeClick: () => {
      return;
    },
  });
};

onMounted(() => {
  getCateGories();
});
</script>

<style scoped></style>
