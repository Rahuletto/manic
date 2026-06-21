'use client';

import { useCallback, useState } from 'react';
import { rpc } from '@/components/rpc';

interface TimestampData {
  timestamp: string;
  unix: number;
  timezone: string;
}

export default function TimestampFetcher() {
  const [tsData, setTsData] = useState<TimestampData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTimestamp = useCallback(() => {
    setLoading(true);
    setError('');
    rpc.timestamp
      .$get()
      .then(res => res.json())
      .then(result => {
        setTsData(result);
      })
      .catch(() => {
        setError('Failed to fetch timestamp');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-xl font-bold">Hono RPC Timestamp</h2>
      <p className="text-sm text-foreground/60">
        Fetch the current server timestamp via Hono&apos;s native RPC mechanism
        over dynamic file-system routes.
      </p>

      <button
        id="fetch-timestamp-btn"
        onClick={fetchTimestamp}
        disabled={loading}
        className="btn-primary w-fit disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Fetching…' : 'Fetch Timestamp'}
      </button>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      {tsData ? (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-foreground/10 p-4 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/50">ISO</span>
            <span id="ts-iso">{tsData.timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Unix</span>
            <span id="ts-unix">{tsData.unix}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">TZ</span>
            <span id="ts-tz">{tsData.timezone}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
