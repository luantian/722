<template>
  <div>
    <!-- <button @click="formatCode">Format JSON</button> -->
    <div
      ref="container"
      style="width: 800px; height: 600px; border: 1px solid #ccc"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as monaco from "monaco-editor";

const container = ref(null);
let editor = null;

onMounted(() => {
  window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.40.0/min/'
            };
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.40.0/min/vs/base/worker/workerMain.js');`)}`;
    },
  };

  editor = monaco.editor.create(container.value, {
    value: '{"a":"a","b":"b"}',
    language: "json",
    automaticLayout: true,
  });

  const code = editor.getValue();
  try {
    const formatted = JSON.stringify(JSON.parse(code), null, 2);
    editor.setValue(formatted);
  } catch (e) {
    alert("Invalid JSON");
  }
});
</script>

<style>
button {
  margin-bottom: 10px;
}
</style>
