
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
    console.log("filtering...");
    return filterValue 
        ? pet.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) 
        : true
}), [filterValue, pets]) 
// if either the pets array or the user input filterValue change
// filterPets would need to be recalculated
```

### useCallback()

The `useCallback()` hook is used to memoize function definitions. If you are memoizing the _output_ of a function, use `useMemo`, if you need to memoize the _function itself_, use `useCallback`. A common use-case is to memoize a function that needs to be referenced in a dependency array:

```ts
const getData = async() => {
    try {
        const response = await fetch(baseURL + "/pets?search=" + filterValue)
        const result: Pet[] = await response.json()
        console.log(result)
        setPets(result)
    } catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    getData();  
}, [filterValue])
// functional, but React will complain about a missing dependency
```

```ts
const getData = useCallback(async() => {
    console.log("getting data")
    try {
        const response = await fetch(baseURL + "/pets?search=" + filterValue)
        const result: Pet[] = await response.json()
        console.log(result)
        setPets(result)
    } catch (error) {
        console.log(error)
    }
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

## Debouncing & AbortController

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

A similar logic can be applied to the `fetch` api. If your user is impatient and clicking many things, you might need to  Imagine you need to cancel a request _after_ it has been sent - set a fetch to a controller signal, and you can **abort** that request manually:

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

**Note** aborting a controller unnecessarily triggers an error, a condition will need to be included in the catch block: `if (error.name !== "AbortError")` to avoid handling this error.

## Optimistic state updates

While there is a `useOptimistic()` React Hook, this is more of a UX logic pattern. Make the assumption that your async request will succeed, e.g. the profile changes will update, the item will be added to favorites, etc. What state changes are made 

## Suspense
