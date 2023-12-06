import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import naive from "naive-ui";
import { router } from "./routes/router";

import AppModal from "./components/AppModal.vue";

import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NButton,
  NSpace,
  NSelect,
  NMessageProvider,
  NLoadingBarProvider,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NConfigProvider,
  NDialogProvider,
  NModal,
  NTable,
  NTabs,
  NTabPane,
  NDivider,
  NScrollbar,
  NPagination,
  NPopselect,
  NEmpty,
} from "naive-ui";

const naiveUIComponents = {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NButton,
  NSpace,
  NSelect,
  NMessageProvider,
  NLoadingBarProvider,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NConfigProvider,
  NDialogProvider,
  NModal,
  NTable,
  NTabs,
  NTabPane,
  NDivider,
  NScrollbar,
  NPagination,
  NPopselect,
  NEmpty,
};

const app = createApp(App);

Object.entries(naiveUIComponents).forEach(([name, component]) => {
  app.component(name, component);
});

app.component("AppModal", AppModal);

app.use(createPinia());
app.use(naive);
app.use(router);

app.mount("#app");
