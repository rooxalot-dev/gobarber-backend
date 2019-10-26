import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/cancellationMailJob';

const jobs = [CancellationMail];

class Queue {
    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach((job) => {
            const { key, handle } = job;

            this.queues[key] = {
                bee: new Bee(key, { redis: redisConfig }),
                handle,
            };
        });
    }

    add(queue, jobData) {
        return this.queues[queue]
            .bee
            .createJob(jobData)
            .save();
    }

    handleFailed(job, error) {
        console.log(`Job ${job.queue.name} FAILED: `, error);
    }

    processQueue() {
        jobs.forEach((job) => {
            const { key } = job;
            const enqueuedJob = this.queues[key];

            if (enqueuedJob) {
                enqueuedJob.bee
                    .on('failed', this.handleFailed)
                    .process(enqueuedJob.handle);
            }
        });
    }
}

export default new Queue();
