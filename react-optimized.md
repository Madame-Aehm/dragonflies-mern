
# React Optimization

## Memoization

**Memoization** is the caching/storing of expensive computed values. If a value must be computed each time a process runs, then that process will be at least as slow as the computation. If the value does not change between runs, then the additional time taken to recalculate the same value each time is unnecessary. Store that value somewhere, and reuse the same pre-calculated value, to optimize performance. 

React 19's [React Compiler](https://react.dev/learn/react-compiler) means very soon manual memoization is no longer something developers will need to consider. Vite, however, have not included it by default in their boilerplate. To upgrade your project to include React Compiler, follow the [documentation](https://react.dev/learn/react-compiler/installation).

### memo

The [`memo` function](https://react.dev/reference/react/memo) in React let's you memoize an entire component. If the parent component re-renders, a memoized child component will not re-render _unless_ its props have changed since the previous render. 

Memoize any existing React component by wrapping the function definition in a `memo()`:

```js
import { memo } from 'react';

const PetCard = memo(({ pet }: Props) => {
    // ...
})
```

### useMemo() 

The `useMemo()` hook is used to memoize a value _within_ a component between renders. Only if values defined in the `useMemo` **dependency array** change, will the value be recalculated and re-cached, preventing lag in component re-renders. Memoizing a large variable (such as an array or object) might also be necessary to make it useable in a dependency array.

```ts
const filteredPets = pets.filter(pet => {
    for (let i = 0; i < 1000000000; i++) {;} // empty loop to simulate a slow process
    console.log("filtering...");
    return filterValue 
        ? pet.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) 
        : true
})
```

```ts
const filteredPets = useMemo(() => pets.filter(pet => {
    for (let i = 0; i < 1000000000; i++) {;}
    // ..
}), [filterValue, pets]) 
// if either the pets array or the user input filterValue change
// filterPets would need to be recalculated
```

### useCallback()

The `useCallback()` hook is used to memoize function definitions. If you are memoizing the _output_ of a function, use `useMemo`, if you need to memoize the _function itself_, use `useCallback`. A common use-case is to memoize a function that needs to be referenced in a dependency array:

```ts
const getData = async() => {
    const response = await fetch(baseURL + "/pets?search=" + filterValue)
    // ..
}

useEffect(() => {
    getData();  
}, [filterValue])
// functional, but React will complain about a missing dependency
```

```ts
const getData = useCallback(async() => {
    const response = await fetch(baseURL + "/pets?search=" + filterValue)
    // ..
}, [filterValue])

useEffect(() => {
    getData();
}, [getData])
```

Be aware that while memoization can reduce rerenders, it will require additional memory to hold the memoized values. React is very fast, and it is generally advised not to "optimize prematurely". These measures should only be implemented when there is a noticeable problem in performance. [Here](https://kentcdodds.com/blog/usememo-and-usecallback) is a good article for further reading.

## useRef()

The `useRef()` hook can be used to hold values that need to persist between renders, but which themselves do not _trigger_ a component to rerender when updated. The value of `useRef` is accessed by `ref.current`. 

```ts
// component render counter
const count = useRef(0);
console.log(count.current);

useEffect(() => {
    count.current = count.current + 1;
});
```

It is commonly used to target elements in the HTML, so much so that each JSX DOM element has a `ref` property which can be set to a `useRef` output. It can be a convenient way to trigger methods such as `input.focus()` and `form.reset()`.

```tsx
// focus input
function Component() {
    const ref = useRef<HTMLInputElement | null>(null)
    console.log(ref)

    return (<>
        // ...
        <input ref={ref}  />
        <button onClick={() => ref.current?.focus()}>focus input</button>
    </>)
}
```

## Handling Async Operations

### Debouncing

Debouncing is the practice of delaying a function call until a timeout period has elapsed. For example, instead of sending a request to the server for _every_ `onChange` of an input, wait until the user has paused in typing before sending the request. Each keystroke refreshes the countdown. Use a `useRef()` and the `useEffect()` cleanup to achieve this for fetching:

```tsx
const useFetch = ({ filterValue }: Props) => {
    // ... initialize state variables
    const debounceTimeout = useRef(0)

    useEffect(() => {
        const fetchData = async() => {
            // .. set loading + error states
            debounceTimeout.current = setTimeout(async() => {
                //.. fetch data
            }, 500)
        }
        fetchData();

        return () => {
            clearTimeout(debounceTimeout.current)
        }
    }, [filterValue])
}
```

### Throttling

The same logic can be applied in reverse to ensure the same function cannot be executed again _within a timeout period_ after being called. This is called **throttling**, and might be applied to a function triggered by a scroll event:

```tsx
const useFetch = ({ filterValue }: Props) => {
    // ... initialize state variables
    const throttle = useRef(false)

    useEffect(() => {
        const fetchData = async() => {
            throttle.current = true;
            setTimeout(() => {
                throttle.current = false
            }, 500)
            //.. fetch data
        }
        
        if (!throttle.current) {
            fetchData()
        }
    }, [filterValue])
}
```

If you find you need to do this often, consider creating custom hooks, or use libraries such as [Lodash](https://lodash.com/) that can help implementing these functionalities.

### Aborting

A similar logic can be applied to the `fetch` api. If your user is impatient and clicking many things, they can create a race condition - multiple async operations are being resolved, but they may not resolve in the expected order, creating confusion in your UI. In this case, you might cancel an active request when the user triggers a new one. Do this by setting the fetch to a controller signal, which you can then **abort** manually:

```ts
useEffect(() => {
    let controller = new AbortController()

    const fetchData = async() => {
        await fetch("url", { signal: controller.signal })
    }
    fetchData();

    return () => {
        if (controller) {
            controller.abort()
        }
        controller = null
    }

}, [filterValue])
```

**Note:** aborting a controller triggers an error, a condition will need to be included in the catch block: `if (error.name !== "AbortError")` to avoid handling this error.

## Optimistic state updates

While there is a new [`useOptimistic()` React Hook](https://react.dev/reference/react/useOptimistic), this is more of a UX logic pattern. Make the assumption that your async request will succeed, e.g. the profile will updated, the item will be added to favorites, etc. What state changes are made in that instance? If you can immediately apply the changes (i.e. you're not waiting for data from the server), then apply them. In the case of an error, **revert** those state changes. If the promise successfully resolves, then no further state updates are required. 