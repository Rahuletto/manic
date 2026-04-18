# Features

## Theme Toggle

```tsx
import { useTheme, ThemeToggle } from 'manicjs/theme';
import { Sun, MoonStar } from 'lucide-react';

export default function Page() {
  const { isDark } = useTheme();

  return (
    <ThemeToggle>
      {theme => (theme === 'dark' ? <Sun /> : <MoonStar />)}
    </ThemeToggle>
  );
}
```

## View Transitions

```tsx
import { ViewTransitions } from 'manicjs';

export default function Page() {
  return (
    <ViewTransitions.div name="content">
      <h1>Animated Content</h1>
    </ViewTransitions.div>
  );
}
```

## Link Prefetching

```tsx
import { Link } from 'manicjs';

export default function Page() {
  return (
    <Link to="/about" prefetch="hover">
      About
    </Link>
  );
}
```

## Environment Variables

```ts
// .env
API_KEY = secret;

// In code
const key = process.env.API_KEY;
```
