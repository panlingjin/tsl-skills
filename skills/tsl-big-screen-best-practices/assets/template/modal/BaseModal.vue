<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import {
  computed,
  getCurrentInstance,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
} from "vue";
import { useModalLifecycle } from "@/hooks/use-modal-lifecycle";

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  variant: {
    type: String,
    default: "dialog",
    validator: (value) => ["dialog", "confirm", "drawer", "media"].includes(value),
  },
  size: {
    type: String,
    default: "",
    validator: (value) => !value || ["sm", "md", "lg", "xl"].includes(value),
  },
  layer: {
    type: String,
    default: "main",
    validator: (value) => ["main", "confirm"].includes(value),
  },
  placement: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right"].includes(value),
  },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: undefined },
  closeOnEsc: { type: Boolean, default: undefined },
  busy: { type: Boolean, default: false },
  keepMounted: { type: Boolean, default: false },
  teleportTo: { type: String, default: "#infraApp" },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits([
  "update:open",
  "close",
  "after-enter",
  "after-leave",
]);

const attrs = useAttrs();
const slots = useSlots();
const panelRef = shallowRef(null);
const pendingCloseReason = shallowRef("");
const lastCloseReason = shallowRef("");
const instance = getCurrentInstance();
const titleId = `modal-title-${instance?.uid ?? "base"}`;

const actualSize = computed(() => {
  if (props.size) return props.size;
  if (props.variant === "confirm") return "sm";
  if (props.variant === "media") return "xl";
  return "md";
});
const actualLayer = computed(() => (
  props.variant === "confirm" ? "confirm" : props.layer
));
const actualCloseOnBackdrop = computed(() => (
  props.closeOnBackdrop ?? props.variant !== "confirm"
));
const actualCloseOnEsc = computed(() => props.closeOnEsc ?? true);
const hasTitle = computed(() => Boolean(props.title || slots.title));
const hasHeader = computed(() => (
  hasTitle.value || Boolean(slots["header-extra"]) || props.closable
));
const shouldRender = computed(() => props.keepMounted || props.open);
const role = computed(() => (
  props.variant === "confirm" ? "alertdialog" : "dialog"
));
const transitionName = computed(() => (
  props.variant === "drawer"
    ? `modal-slide-${props.placement}`
    : "modal-fade-scale"
));
const layerClasses = computed(() => [
  "modal-layer",
  `modal-layer--${actualLayer.value}`,
  `modal-layer--${props.variant}`,
  props.variant === "drawer" ? `modal-layer--${props.placement}` : null,
  { "is-busy": props.busy },
]);
const shellClasses = computed(() => [
  "modal-shell",
  `modal-shell--${props.variant}`,
  `modal-shell--${actualSize.value}`,
  props.variant === "drawer" && !props.size ? "modal-shell--drawer-default" : null,
  props.variant === "drawer" ? `modal-shell--${props.placement}` : null,
]);

function requestClose(reason) {
  const isUserExit = ["close-button", "backdrop", "escape"].includes(reason);
  if (!props.open || (props.busy && isUserExit)) return;
  pendingCloseReason.value = reason;
  emit("update:open", false);
}

function handleBackdrop() {
  if (actualCloseOnBackdrop.value) requestClose("backdrop");
}

const { focusInitialElement, completeClose } = useModalLifecycle({
  open: computed(() => props.open),
  layer: actualLayer,
  busy: computed(() => props.busy),
  closeOnEsc: actualCloseOnEsc,
  panelRef,
  requestClose,
});

watch(
  () => props.open,
  (isOpen, wasOpen) => {
    if (!isOpen && wasOpen) {
      lastCloseReason.value = pendingCloseReason.value || "programmatic";
      emit("close", {
        reason: lastCloseReason.value,
      });
      pendingCloseReason.value = "";
    }
  },
);

watch(
  [() => props.open, hasTitle, () => props.ariaLabel],
  ([isOpen, titleAvailable, label]) => {
    if (
      isOpen
      && !titleAvailable
      && !label
      && process.env.NODE_ENV !== "production"
    ) {
      console.warn("[BaseModal] A titleless modal requires ariaLabel.");
    }
  },
  { immediate: true },
);

function handleAfterEnter() {
  focusInitialElement();
  emit("after-enter");
}

function handleAfterLeave() {
  completeClose();
  lastCloseReason.value = "";
  emit("after-leave");
}
</script>

<template>
  <Teleport :to="teleportTo">
    <Transition
      :name="transitionName"
      appear
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="shouldRender"
        v-show="open"
        :class="layerClasses"
        :aria-busy="busy || undefined"
      >
        <div
          class="modal-backdrop"
          aria-hidden="true"
          @click="handleBackdrop"
        />

        <section
          ref="panelRef"
          v-bind="attrs"
          :class="shellClasses"
          :role="role"
          aria-modal="true"
          :aria-labelledby="hasTitle ? titleId : undefined"
          :aria-label="hasTitle ? undefined : ariaLabel || undefined"
          tabindex="-1"
          @click.stop
        >
          <header v-if="hasHeader" class="modal__header">
            <h2 v-if="hasTitle" :id="titleId" class="modal__title">
              <slot name="title">{{ title }}</slot>
            </h2>
            <div v-if="$slots['header-extra']" class="modal__extra">
              <slot name="header-extra" />
            </div>
            <button
              v-if="closable"
              class="modal__close"
              type="button"
              aria-label="关闭弹窗"
              :disabled="busy"
              @click="requestClose('close-button')"
            >
              <span class="modal__close-icon" aria-hidden="true" />
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
