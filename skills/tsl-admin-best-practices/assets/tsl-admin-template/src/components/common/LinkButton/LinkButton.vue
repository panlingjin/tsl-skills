<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

function handleClick(event) {
  if (!event.currentTarget || event.currentTarget.disabled) return
  emit('click', event)
}
</script>

<template>
  <button class="link-button" type="button" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<style scoped>
.link-button {
  padding: 0;
  color: var(--ori-color-primary, #5e66f2);
  font: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.link-button:disabled {
  color: #c9cdd4;
  cursor: not-allowed;
}
</style>
