import { useRouter } from 'manicjs/router';

export default function ChatDetail() {
  const { params } = useRouter();
  return (
    <main className="py-24 md:px-24 px-12 mx-auto max-w-screen-lg min-h-screen text-foreground">
      <h1 className="text-3xl font-bold">Chat {params.id}</h1>
      <p className="mt-4 opacity-60">Dynamic route: /chats/{params.id}</p>
    </main>
  );
}
