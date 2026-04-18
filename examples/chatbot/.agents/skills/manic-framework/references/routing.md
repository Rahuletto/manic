# Routing

Manic uses file-based routing with React components.

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

## Dynamic Routes

```tsx
// app/routes/posts/[id].tsx → /posts/:id
export default function Post({ params }: { params: { id: string } }) {
  return <div>Post {params.id}</div>;
}
```

## Catch-all Routes

```tsx
// app/routes/[...slug].tsx → /:slug*
export default function CatchAll({ params }: { params: { slug: string[] } }) {
  return <div>Slug: {params.slug.join('/')}</div>;
}
```

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
