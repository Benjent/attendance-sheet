<script setup>
import Form from '../components/Form.vue';
import Preview from '../components/Preview.vue';
</script>

<template>
  <main>
    <Form class="form" />
    <Preview class="preview" />
  </main>
</template>

<style scoped>
main {
    display: flex;
    background: rgb(204,204,204);
}

.form {
    width: 33%;
}
</style>