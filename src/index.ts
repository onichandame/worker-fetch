type Request<T> = { requestId: number; resource: string; data: T };
type Response<T> = {
  requestId: number;
  resource: string;
  data: T;
  state: "completed" | "streaming"; // streaming not impl yet
};

export class WorkerRouter {
  private handlerMap = new Map<string, (req: any) => Promise<any>>();

  constructor(worker: SharedWorkerGlobalScope) {
    worker.onconnect = (e) => {
      const port = e.ports[0]!;
      port.onmessage = (e) => {
        switch (e.type) {
          case `message`:
            const payload = e.data as Request<any>;
            const handler = this.handlerMap.get(payload.resource);
            handler?.(payload.data).then((res) => {
              console.log(payload);
              port.postMessage({
                data: res,
                requestId: payload.requestId,
                resource: payload.resource,
                state: "completed",
              } as Response<any>);
            });
            break;
          default:
            console.error(`event type ${e.type} unknown`);
        }
      };
    };
  }

  on<TRequest, TResponse>(
    resource: string,
    handler: (req: TRequest) => Promise<TResponse>,
  ) {
    this.handlerMap.set(resource, handler);
  }
}

export class WorkerFetcher {
  private requestId = 0;
  private requestMap = new Map<number, (res: any) => void>();

  constructor(private port: MessagePort) {
    const that = this;
    port.onmessage = (e) => {
      if (e.type !== "message") return;
      const payload = e.data as Response<any>;
      const requestHandler = that.requestMap.get(payload.requestId);
      console.log(payload, that.requestMap);
      console.log(requestHandler);
      if (requestHandler) {
        requestHandler?.(payload.data);
        that.requestMap.delete(payload.requestId);
      }
    };
  }

  async fetch<TReturn, TData>(resource: string, data: TData): Promise<TReturn> {
    const requestId = ++this.requestId;
    return new Promise((r) => {
      this.requestMap.set(requestId, r);
      this.port.postMessage({ requestId, data, resource } as Request<any>);
    });
  }
}
