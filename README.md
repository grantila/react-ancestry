# react-ancenstry

This package provides a React component which tells you the ancestry of this component, up until the root component.

It uses React internals, and can therefore potentially fail for certain versions of React, but is tested on React 16 (dev/prod build) and React 17 (dev/prod build).

# API

Place the `Ancestry` component where you want to know the ancestry and use the prop `onAncestry` to get a callback of the ancestry as an array of `AncestryElement` on the form:

```ts
interface AncestryElement
{
    name: string;
    type: 'component' | 'element';
}
```

Example:

```tsx
import { useCallback } from 'react'
import { Ancestry, AncestryElement } from 'react-ancestry'

function MyComponent( )
{
    const onAncestry = useCallback(
        ( ancestry: Array< AncestryElement > ) =>
        {
            console.log( "Ancestry:", ancestry );
        },
        [ ]
    );

    return <>
        ...
        <Ancestry onAncestry={ onAncestry } />
        ...
    </>
}
```

When used as:

```jsx
<Foo>
    <Bar>
        <div>
            <Baz>
                <MyComponent />
            </Baz>
        </div>
    </Bar>
</Foo>
```

will console.log:

```
[
    { name: 'Foo', type: 'component' },
    { name: 'Bar', type: 'component' },
    { name: 'div', type: 'element' },
    { name: 'Baz', type: 'component' },
    { name: 'MyComponent', type: 'component' },
]
```
