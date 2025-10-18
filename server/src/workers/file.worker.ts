import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

const worker = new Worker(
  "file",
  async (job) => {
    if (job.name === "processFile") {
      console.log(`📂 Processing file ${job.data.fileId} at ${job.data.path}`);
      // Example: generate thumbnail, scan for viruses, etc.
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log(`✅ File job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ File job ${job?.id} failed: ${err.message}`));
