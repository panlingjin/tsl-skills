import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  unref,
  watch,
} from "vue";
import * as echarts from "echarts";

function resolveSource(source) {
  return typeof source === "function" ? source() : unref(source);
}

function measureElement(element) {
  if (!element?.isConnected) return null;
  const rect = element.getBoundingClientRect();
  // Prefer layout-space dimensions so root zoom/transform does not get applied twice.
  const width = Math.round(element.clientWidth || rect.width || 0);
  const height = Math.round(element.clientHeight || rect.height || 0);
  return width > 0 && height > 0 ? { width, height } : null;
}

export function useECharts(containerRef, optionSource, config = {}) {
  const chart = shallowRef(null);
  const ready = shallowRef(false);
  let resizeObserver = null;
  let observedElement = null;
  let animationFrame = 0;
  let mounted = false;

  const dispose = () => {
    if (chart.value && !chart.value.isDisposed()) chart.value.dispose();
    chart.value = null;
    ready.value = false;
  };

  const render = () => {
    if (!mounted) return false;
    const element = resolveSource(containerRef);
    const size = measureElement(element);
    if (!size) return false;

    if (chart.value && chart.value.getDom() !== element) dispose();
    if (!chart.value) {
      const initOptions = {
        ...(resolveSource(config.initOptions) || {}),
        width: size.width,
        height: size.height,
      };
      chart.value = echarts.init(element, resolveSource(config.theme), initOptions);
    } else {
      chart.value.resize({ ...size, silent: true });
    }

    const option = resolveSource(optionSource);
    if (option && typeof option === "object") {
      chart.value.setOption(option, resolveSource(config.setOptionOptions) || {});
    }
    ready.value = true;
    return true;
  };

  const scheduleRender = () => {
    if (!mounted || typeof window === "undefined") return;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = 0;
      render();
    });
  };

  const observe = (element) => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    observedElement = element || null;

    if (!element || typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((item) => item.target === observedElement);
      if (!entry || entry.contentRect.width <= 0 || entry.contentRect.height <= 0) return;
      scheduleRender();
    });
    resizeObserver.observe(element);
  };

  const bindElement = (element, previousElement) => {
    if (previousElement && previousElement !== element) dispose();
    observe(element);
    scheduleRender();
  };

  watch(
    () => resolveSource(containerRef),
    (element, previousElement) => {
      if (mounted) bindElement(element, previousElement);
    },
    { flush: "post" },
  );

  watch(
    () => resolveSource(optionSource),
    () => scheduleRender(),
    { deep: true, flush: "post" },
  );

  onMounted(async () => {
    mounted = true;
    await nextTick();
    if (!mounted) return;
    bindElement(resolveSource(containerRef));
    window.addEventListener("resize", scheduleRender);
  });

  onBeforeUnmount(() => {
    mounted = false;
    resizeObserver?.disconnect();
    resizeObserver = null;
    observedElement = null;
    window.removeEventListener("resize", scheduleRender);
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    dispose();
  });

  return {
    chart,
    ready,
    render,
    resize: scheduleRender,
    dispose,
  };
}
