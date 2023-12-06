<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import { type GlobalTheme, darkTheme } from "naive-ui";

const theme = ref<GlobalTheme | null>(darkTheme);

const toggleTheme = () => {
  theme.value = theme.value ? null : darkTheme;
};

provide("toggleTheme", toggleTheme);
</script>

<style>
a {
  color: inherit;
  text-decoration: none;
}
</style>
