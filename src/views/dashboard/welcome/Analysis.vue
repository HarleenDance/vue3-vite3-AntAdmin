<template>
  <div>
    <div style="width: 100%; text-align: right; margin-top: 20px">
      请选择首页样式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">统计图表</a-radio>
        <a-radio :value="2">统计图表2</a-radio>
        <a-radio :value="3">任务表格</a-radio>
      </a-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const indexStyle = ref(1);
</script>
