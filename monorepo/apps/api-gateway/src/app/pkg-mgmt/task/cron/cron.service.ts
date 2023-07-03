import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  public scheduleCron(
    jobName: string,
    hours: string,
    minutes: string,
    dayMonth: string,
    month: string,
    dayWeek: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function,
  ) {
    const job = new CronJob({
      cronTime: `0 ${minutes} ${hours} ${dayMonth} ${month} ${dayWeek}`,
      onTick: () => {
        callback();
        console.log(`Cron job ${jobName} executed successfully.`);
        if (Date.now() % 2) {
          const s = this.schedulerRegistry.getCronJob('notifications');

          s.stop();
          console.log(s.lastDate());
        }
      },
      timeZone: 'Asia/Ho_Chi_Minh',
      onComplete: () => {
        console.log(`Cron job ${jobName} stopped successfully.`);
      },
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    console.log(`Cron will execute at ${hours}:${minutes} `);
  }

  public deleteCron(jobName: string) {
    this.schedulerRegistry.deleteCronJob(jobName);
    console.log(`Job ${jobName} deleted`);
  }

  public getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      console.log(`job: ${key} -> next: ${next}`);
    });
  }

  public scheduleInterval(jobName: string, milliseconds: number) {
    const callback = () => {
      console.warn(`Interval ${jobName} executing at time (${milliseconds})!`);
    };
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(jobName, interval);
  }

  public deleteInterval(jobName: string) {
    this.schedulerRegistry.deleteInterval(jobName);
    console.warn(`Interval ${name} deleted!`);
  }

  public getIntervals() {
    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((key) => console.log(`Interval: ${key}`));
  }

  public scheduleTimeout(jobName: string, milliseconds: number) {
    const callback = () => {
      console.warn(`Timeout ${name} executing after (${milliseconds})!`);
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(jobName, timeout);
  }

  public deleteTimeout(jobName: string) {
    this.schedulerRegistry.deleteTimeout(jobName);
    console.warn(`Timeout ${jobName} deleted!`);
  }

  public getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => {
      console.log(`Timeout: ${key}`);
    });
  }
}
