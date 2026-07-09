<script setup>
defineProps({
  disabled: Boolean
})
</script>

<template>
  <a role="button" :disabled="disabled ? 'true' : undefined" @click="!disabled && $emit('click', $event)">
    <slot />
  </a>
</template>
