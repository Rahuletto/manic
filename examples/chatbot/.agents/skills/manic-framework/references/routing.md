# Routing

<Callout type="note">
Manic uses file-based routing with React components. Routes are automatically discovered from the `app/routes/` directory.
</Callout>

## Basic Routes

```tsx
// app/routes/index.tsx → /
export default function Home() {
  return <div>Home</div>;
}

// app/routes/about.tsx → /about
export default function About() {
  return <div>About</div>;
}
```

<Callout type="tip">
Use `index.tsx` for root routes and nested index routes.
</Callout>

## Dynamic Routes

```tsx
// app/routes/posts/[id].tsx → /posts/:id
export default function Post({ params }: { params: { id: string } }) {
  return <div>Post {params.id}</div>;
}
```

<Callout type="important">
Dynamic route parameters are accessed via the `params` prop.
</Callout>

## Catch-all Routes

```tsx
// app/routes/[...slug].tsx → /:slug*
export default function CatchAll({ params }: { params: { slug: string[] } }) {
  return <div>Slug: {params.slug.join('/')}</div>;
}
```

<Callout type="warning">
Catch-all routes have the lowest priority and will match last.
</Callout>

## Route Hooks

```tsx
import { useLocation, useParams, useNavigate } from 'manicjs';

export default function Page() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  return <div>Page</div>;
}
```

<Callout type="caution">
Route hooks must be used within a `<Router>` component.
</Callout>
