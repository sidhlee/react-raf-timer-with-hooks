# React timer with rAF and hooks

Variations based on Dan Abramov's [codesandbox](https://codesandbox.io/s/1qwlpk4o8l).

- Original [sandbox](https://codesandbox.io/s/p35qwvr6rq) by Kent C. Dodds

## Memo

- Try to minimize dependencies.

  - Use functional updater form in setState.
    ```js
    setCount(c => c + 1);
    ```
  - If updating state depends on other state(s), `useReducer`
    ```js
    dispatch({ type: 'ORDER' });
    ```
  - It helps to send only the minimal necessary information from inside the effects into a component.
    - Just "ORDER" and delegate all other conditions,current items & prices, and update logic to the reducer.
  - If you use certain values returned from a function inside our effect, instead of adding that function to the dep, just move the function directly into the effect.
  - If you can't move the function (e.g. because it is re-used in many other places) you can hoist the function outside the component. Now you'll always be accessing the most-current values from the function even after the componenet re-renders.

- [`setState`](https://reactjs.org/docs/react-component.html#setstate) enqueues changes to the component state and tells React to re-render this component and it children asynchronously. (= after the call stack is empty. could be batched for perf reason.)

## Run 4

- step function gets called in every frame even though it cannot do anything unless 1000ms has passed.
  - called in about every 1 / 60 seconds ~ 16ms => only working 1 out of 60 times it gets called.

## Run 5

- Set `now` in every 1000 ms to only re-render every second.
- Better solution not lying to useEffect dep?
  - Solved with conditional [update function](https://reactjs.org/docs/hooks-reference.html#functional-updates).
    ```js
    setNow(now => {
      const time = performance.now();
      // if updater function returns the exact same value, rerender will be skipped.
      return time > now + 1000 ? time : now;
    });
    ```
- But step function still gets called in every frame only to work 1 out of 60 times.
- You can use rAF to create almost-continuous progression (at least to the user's eyes)
- If you are going to use that progression for VIS, the component is going to be re-rendered on every frame anyways. No point of trying to limit re-render to every second.

## Run 6

- [Making setInterval Declarative with React Hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)

## Reference

- [A Complete Guid to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
