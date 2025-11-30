import { WorkerRouter } from "../../../dist";

const router = new WorkerRouter(self);

router.on(`add`, async (nums: number[]) => {
  return nums.reduce((a, b) => a + b);
});
