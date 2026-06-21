import { Image, Link } from 'manicjs';
import textContent from '@/test.txt';
import InteractiveChart from '@/components/InteractiveChart';
import Counter from '@/components/Counter';
import TimestampFetcher from '@/components/TimestampFetcher';

const LOGO_STYLE = { viewTransitionName: 'logo' };
const SUBTITLE_STYLE = { viewTransitionName: 'subtitle' };
const LINKBUTTON_STYLE = { viewTransitionName: 'linkbutton' };

interface HomeLoaderData {
  serverTime: string;
  buildInfo: { version: string; env: string };
}

export const loader = (): Promise<HomeLoaderData> => {
  return Promise.resolve({
    serverTime: new Date().toISOString(),
    buildInfo: {
      version: '1.0.0',
      env: process.env.NODE_ENV || 'development',
    },
  });
};

export default function Home({ loaderData }: { loaderData?: HomeLoaderData }) {
  return (
    <main className="py-24 md:px-24 px-12 mx-auto flex items-start justify-center gap-32 flex-col max-w-screen-lg min-h-screen text-foreground">
      <div className="flex gap-6 flex-col">
        {/* Theme-aware logo using pure Tailwind CSS classes */}
        <Image
          src="/assets/wordmark.png"
          alt="MANIC."
          width={582}
          height={122}
          className="hidden dark:block max-md:w-54 max-sm:w-54 transition-all duration-250"
          style={LOGO_STYLE}
        />
        <Image
          src="/assets/wordmark-dark.png"
          alt="MANIC."
          width={582}
          height={122}
          className="block dark:hidden max-md:w-54 max-sm:w-54 transition-all duration-250"
          style={LOGO_STYLE}
        />

        <p className="md:text-2xl text-xl font-medium" style={SUBTITLE_STYLE}>
          Stupidly fast, Crazy light React framework.
        </p>

        <p
          id="rosetta-transform-output"
          className="text-sm text-accent opacity-80 font-mono"
        >
          [Rosetta Transform]: {textContent}
        </p>
      </div>

      {loaderData && (
        <div className="flex flex-col gap-3 w-full max-w-md mb-8 rounded-xl border-2 border-foreground/10 p-4 font-mono text-sm bg-foreground/5">
          <div className="flex justify-between">
            <span className="text-foreground/50">Server Time (SSR)</span>
            <span>{loaderData.serverTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Build Version</span>
            <span>{loaderData.buildInfo.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Environment</span>
            <span>{loaderData.buildInfo.env}</span>
          </div>
        </div>
      )}

      {/* Interactive Counter Component (Client Component Island) */}
      <Counter />

      {/* Dynamic Timestamp Fetcher Component (Client Component Island) */}
      <TimestampFetcher />

      {/* Interactive Chart Component (Client Component Island) */}
      <InteractiveChart />

      <div className="mt-6 flex gap-6 md:flex-row flex-col items-start">
        <Link
          to="/post/hello-ssr"
          className="btn-primary flex items-center justify-center"
          style={LINKBUTTON_STYLE}
        >
          Dynamic Route Test →
        </Link>
        <Link
          to="https://www.manicjs.tech/docs/framework/benchmarks"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center"
          style={LINKBUTTON_STYLE}
        >
          How fast? →
        </Link>
        <Link
          to="https://manicjs.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center"
          style={LINKBUTTON_STYLE}
        >
          Documentation
        </Link>
      </div>
    </main>
  );
}
