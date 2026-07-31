<script setup lang="ts">
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!event.currentTarget || (event.currentTarget as HTMLButtonElement).disabled) return
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
