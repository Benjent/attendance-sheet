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
    align-items: center;
    height: 100vh;
}

.form {
    width: 33%;
}
</style>