<template>
  <n-card class="wrapper">
    <div class="content">
      <div>not found</div>
      <n-button>
        <router-link to="/blogs">回到首页</router-link>
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
