# worker-fetch

The event-based worker communication is a pain to work with, especially in projects where a shared worker exposes many functionalities.

This is part of my experiment of using shared worker as "sort-of" backend. Now web standard has evolved to a point where you can run legitimate SQL database on top of OPFS, it will surely steal some use cases from former backend-frontend webapp.

see <https://worker-fetch.onichandame.com> as example

## Usage

```ts
// worker
const router = new WorkerRouter(self);
router.on(`add`, async (nums: number[]) => {
  return nums.reduce((a, b) => a + b);
});

// main thread
const worker = new SharedWorker()
const fetcher = new WorkerFetcher(sharedWorker.port);
const sum = await fetcher.fetch<number, number[]>(`add`, [2, 1]) // 3
```

## Discussion

<https://matrix.to/#/#Xiao-OSS:envs.net>
