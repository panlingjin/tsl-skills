import { onBeforeUnmount, onMounted, shallowRef, unref } from "vue";

function resolveElement(target) {
  const value = typeof target === "function" ? target() : unref(target);
  if (typeof value === "string") return document.querySelector(value);
  return value || null;
}

export function calculateCanvasScale(
  viewportWidth,
  viewportHeight,
  designWidth = 1920,
  designHeight = 1080,
) {
  const nextScale = Math.min(
    Number(viewportWidth) / Number(designWidth),
    Number(viewportHeight) / Number(designHeight),
  );
  return Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
}

function normalizeDesignSize(widthOrOptions, legacyHeight) {
  if (typeof widthOrOptions === "number" && legacyHeight === undefined) {
    return { width: 1920, height: widthOrOptions };
  }
  if (typeof widthOrOptions === "number") {
    return { width: widthOrOptions, height: legacyHeight || 1080 };
  }
  return {
    width: widthOrOptions?.width || 1920,
    height: widthOrOptions?.height || 1080,
  };
}

export function useScale(target, widthOrOptions = {}, legacyHeight) {
  const scale = shallowRef(1);
  const design = normalizeDesignSize(widthOrOptions, legacyHeight);
  let resizeObserver = null;

  const updateScale = () => {
    if (typeof window === "undefined") return;
    const element = resolveElement(target);
    if (!element) return;

    scale.value = calculateCanvasScale(
      window.innerWidth,
      window.innerHeight,
      design.width,
      design.height,
    );

    Object.assign(element.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${design.width}px`,
      height: `${design.height}px`,
      transform: `translate(-50%, -50%) scale(${scale.value})`,
      transformOrigin: "center center",
    });
  };

  onMounted(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(document.documentElement);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScale);
    resizeObserver?.disconnect();
    resizeObserver = null;
  });

  return { scale, updateScale };
}
