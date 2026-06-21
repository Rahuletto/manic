import { useRouter } from 'manicjs';

export async function loader({ params }: { params: Record<string, string> }) {
  return {
    title: `Post: ${params.slug}`,
    slug: params.slug,
    timestamp: new Date().toISOString(),
  };
}

export default function PostPage({ loaderData }: { loaderData: any }) {
  const { params } = useRouter();
  return (
    <main className="py-24 md:px-24 px-12 mx-auto max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4">Dynamic Route Test</h1>
      <div className="flex flex-col gap-3 p-4 rounded-xl border-2 border-foreground/10 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/50">Params slug</span>
          <span>{params.slug}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/50">Loader slug</span>
          <span>{loaderData?.slug}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/50">Server Time</span>
          <span>{loaderData?.timestamp}</span>
        </div>
      </div>
    </main>
  );
}
