<template>
  <n-modal v-model:show="show" preset="dialog">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);

const openModal = () => {
  show.value = true;
};
const closeModal = () => {
  show.value = false;
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped></style>
