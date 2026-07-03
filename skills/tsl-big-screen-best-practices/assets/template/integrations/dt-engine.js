import Engine, { unityPlugin, webglPlugin } from "@tslfe/dt-engine";
import { TACOS_LOAD_MODE, THREE_SELECTOR } from "@/constant";

let cachedMeta = null;
let pending = null;
let removeClickListener = null;

function addPlugins(plugins, meta) {
  Object.keys(plugins).forEach((name) => {
    if (!meta.plugin.has(name)) meta.plugin.use(plugins[name].call());
  });
}

function installPlugins(meta) {
  const mode = process.env.VUE_APP_TACOS_LOAD_MODE;
  addPlugins(mode === TACOS_LOAD_MODE.WEBGL ? webglPlugin : unityPlugin, meta);
}

async function createEngine(idSelector) {
  const container = document.getElementById(idSelector);
  if (!container) throw new Error(`dt-engine container "${idSelector}" was not found`);

  const meta = await Engine.createCloudEngine((config) => {
    config.url = process.env.VUE_APP_DTENGINE_WS;
    config.mode = "client";
    return config;
  });
  meta.amount(idSelector);
  container.style.background = "transparent";
  installPlugins(meta);
  return meta;
}

export async function loadEngine(idSelector = THREE_SELECTOR) {
  if (cachedMeta) return { meta: cachedMeta };
  if (!pending) {
    pending = createEngine(idSelector)
      .then((meta) => {
        cachedMeta = meta;
        return { meta };
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export async function init(idSelector = THREE_SELECTOR) {
  const { meta } = await loadEngine(idSelector);
  if (!removeClickListener) {
    removeClickListener = meta.addEventListener("click", (event) => {
      if (!event.params?.component) return;
    });
  }
  return meta;
}

export async function disposeEngine() {
  const current = cachedMeta || (pending ? (await pending).meta : null);
  removeClickListener?.();
  removeClickListener = null;
  cachedMeta = null;
  pending = null;
  if (current) await current.dispose();
}
