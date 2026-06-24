# Extensions, Events, and Animation

## Plugins

```ts
definePlugin<P, S extends object | void, M>(
  name: string,
  plugin: {
    setup(props: P, meta: Meta<M>): S;
    render?(time: number): void;
    destroyed?(): void;
  }
): DefinedPlugin<P, S, M>
```

`name` and `setup` are required. Calling the resulting factory accepts optional props at runtime and returns a creator. `meta.plugin.use(creator)` runs setup. If `render` exists it is registered in the shared frame queue and invoked with `this` bound to setup result. Removal invokes `destroyed` and unregisters render.

```ts
const rotatePlugin = definePlugin<{ speed: number }, { stop(): void }, WebglCreator>(
  "rotate-component",
  {
    setup({ speed }, meta) {
      let active = true;
      const component = meta.component;
      return { stop: () => { active = false; } };
    },
    render(time) {
      // Keep render state in the setup result when implementing real logic.
    },
    destroyed() {
      this.stop();
    }
  }
);
const rotation = meta.plugin.use(rotatePlugin({ speed: 0.001 }));
```

Common errors: duplicate names return an earlier plugin instance; render hooks are global; setup must return the state expected by render/destroyed; cleanup belongs in `destroyed`.

## Animation definitions

```ts
defineAnimation<P, S extends object, M extends DTModel>(
  matcher: string | RegExp | ((component: Component<M>) => boolean),
  animation: (component: Component<M>, props: P) => S
): AnimationCreator<P, S, M>
```

The creator exposes `isMatch` and async `apply`. String matches `component.type`. A mismatch warns but still applies. For models exposing `optimize`, application disables optimization before invoking an animation method and restores it after the wrapped async call. Errors inside methods are logged and swallowed.

```ts
const blink = defineAnimation("Light", (component, { color }: { color: string }) => ({
  async run() {
    component.model.color = color;
  }
}));
await (await blink.apply(light, { color: "#ffff00" })).run();
```

## Base animation adapters

All return `BaseAnimation`, which has `start`, `pause`, `resume`, `stop`, `update`, event methods, UUID, and `poor`.

- `createAnimationFromTween(tween)`: wraps `TWEEN.Tween`; start registers frame update and stop/complete/pause removes it.
- `createAnimationFromTweenGroup(group)`: wraps all group tweens and aggregates complete/stop.
- `createAnimationFromSimilarAnimation(handler)`: expects compatible handler functions; missing `start` causes an error because source calls it unconditionally.

```ts
const state = { angle: 0 };
const tween = new TWEEN.Tween(state).to({ angle: Math.PI * 2 }, 2000);
const animation = createAnimationFromTween(tween);
animation.start();
// animation.stop() during teardown
```

`TWEEN` is the package's root-exported `@tweenjs/tween.js` namespace.

## Events

`DTEvent<P>(type, params?)` stores payload in `.params`; `.stopPropagation()` stops Component parent bubbling. Event emitters expose:

- `addEventListener(type, listener) => remover`
- `once(type, listener) => emitter`
- `removeEventListener`
- `removeAllListener`
- `hasEventListener`, `getEventListener`, `count`, `emit`

```ts
const removeClick = meta.addEventListener("click", (event: DTEvent<{component?: Component<any>}>) => {
  event.params.component?.model && (event.params.component.model.visible = false);
});
// teardown
removeClick();
```

Use returned remover functions. `meta.dispose()` removes engine listeners, but closures and external listeners remain your responsibility.

Known runtime event names include `click`, `hover`, `blur`, `contextmenu`, `dblclick`, `mousemove`, `loading`, `loaded`, `progress`, `before-change`, `change`, `mounted`, `dispose`, and `resize`.

## Event method call index

```ts
const event = new DTEvent("custom", { value: 1 });
event.stopPropagation();

const off = meta.addEventListener("custom", console.log);
meta.once("custom", console.log);
meta.hasEventListener("custom", console.log);
meta.getEventListener("custom");
meta.count("custom");
meta.emit(new DTEvent("custom"));
meta.removeEventListener("custom", console.log);
meta.removeAllListener("custom");
off();
```

Use the same listener function identity with `hasEventListener` and `removeEventListener`; the compact example uses `console.log` only to demonstrate that requirement.
