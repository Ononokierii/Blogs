<template>
  <div class="wrapper">
    <n-card title="管理页面" class="form">
      <n-form ref="formRef" :model="loginForm" :rules="rules">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="loginForm.username" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space align="center" justify="space-between">
          <n-checkbox v-model:checked="loginForm.remember" label="记住我" />
          <n-button @click="loginHandle">login</n-button>
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { FormRules } from "naive-ui";
import { ref, onMounted, onUnmounted } from "vue";
import axios from "@/libs/axios.ts";
import { AuthStore } from "@/stores/AuthStore";
import type { LoginResponse } from "@/types";
import { useMessage, FormInst } from "naive-ui";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

const authStore = AuthStore();
const message = useMessage();
const router = useRouter();

const loginForm = ref({
  username: "",
  password: "",
  remember: false,
});

const formRef = ref<FormInst | null>(null);

const rules: FormRules = {
  username: [
    { required: true, message: "please input account", trigger: "blur" },
    {
      min: 3,
      max: 12,
      message: "length must between 3 and 12",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "please input password", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "length must between 6 and 12",
      trigger: "blur",
    },
  ],
};

const loginHandle = async (e?: MouseEvent | KeyboardEvent): Promise<void> => {
  try {
    if (e instanceof KeyboardEvent && e.key !== "Enter") return;
    await formRef.value?.validate();

    await axios.post("/admin/login", loginForm.value).then((res) => {
      const result = res as unknown as LoginResponse;
      if (result.status) {
        authStore.login({
          ...result.data,
          ...(loginForm.value.remember && {
            password: loginForm.value.password,
            remember: loginForm.value.remember,
          }),
        });
        router.push("/dashboard");
        message.success("登录成功");
      }
    });
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      message.error("账号或密码错误");
    } else {
      message.error("账号或密码格式错误");
    }
    return;
  }
};

onMounted(() => {
  window.addEventListener("keyup", loginHandle);
  loginForm.value = {
    username: authStore.username,
    password: authStore.password ?? "",
    remember: authStore.remember ?? false,
  };
});

onUnmounted(() => {
  window.removeEventListener("keyup", loginHandle);
});
</script>

<style scoped lang="scss">
.wrapper {
  background-color: rgb(44, 44, 50);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .form {
    width: 80%;
    max-width: 400px;
  }
}
</style>
