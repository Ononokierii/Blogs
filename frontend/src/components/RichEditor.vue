<template>
  <div ref="editorRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Alert from "editorjs-alert";
import ToggleBlock from "editorjs-toggle-block";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";

let editor: EditorJS;
let updatingModel = false;
const editorRef = ref(undefined);

const props = defineProps(["modelValue", "placeholder", "readOnly"]);
const emit = defineEmits(["update:modelValue"]);

const modelToView = () => {
  if (!props.modelValue) return;
  if (typeof props.modelValue === "string") {
    editor.blocks?.renderFromHTML(props.modelValue);
    return;
  }
  editor.blocks?.render(props.modelValue);
};

const viewToModel = async () => {
  updatingModel = true;

  editor
    .save()
    .then((outputData) => {
      emit("update:modelValue", outputData);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      updatingModel = false;
    });
};

onMounted(() => {
  editor = new EditorJS({
    holder: editorRef.value,
    tools: {
      header: Header,
      alert: Alert,
      list: List,
      table: Table,
      code: CodeTool,
      inlineCode: InlineCode,
      toggle: {
        class: ToggleBlock,
        inlineToolbar: true,
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: `${import.meta.env.VITE_API_URI}/upload/file_upload`, // Your backend file uploader endpoint
            // byUrl: "http://localhost:3000/fetchUrl", // Your endpoint that provides uploading by Url
          },
        },
      },
    },
    inlineToolbar: true,
    data: props.modelValue,
    onReady: modelToView,
    onChange: viewToModel,
    readOnly: props.readOnly,
  });
});

watch(
  () => props.modelValue,
  () => {
    if (!updatingModel) {
      modelToView();
    }
  }
);

onUnmounted(() => {
  editor.destroy();
});
</script>

<style lang="scss">
.n-tabs .n-tab-pane {
  .ce-inline-toolbar {
    background-color: #fff !important;
    color: rgb(51, 54, 57) !important;
  }

  .ce-conversion-toolbar {
    background-color: #fff !important;
    color: rgb(51, 54, 57) !important;
  }
}
</style>
