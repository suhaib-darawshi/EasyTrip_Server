import * as cron from 'cron';

const job = new cron.CronJob('0 0 12 * * *', function() {
  
});

job.start();
