// Imports

import { scheduleCronJob } from '../lib/cores/cron';
import { cronExpression } from '../constants';
import { getTimeFromDate } from '../lib/cores/date';

// Function

async function runAutomation(runAt: Date) {
    try{

        console.log('Automation started');
        console.log('Running at:', runAt);

        const time = await getTimeFromDate(runAt);
        if (!time.status || !time.data) {
            console.error(time.message);
            return;
        }

        console.log('Time:', time.data);

        if(time.data === '10:00'){
            console.log('Turning on the lazy spa');
        } else if(time.data === '22:00'){
            console.log('Turning off the lazy spa');
        } else {
            console.log('Invalid time:', time.data);
        }

    } catch (error) {
        console.error(error);
    }
}

// Setup Cron Jobs

scheduleCronJob(cronExpression, () => {
    const runAt = new Date();
    runAutomation(runAt);
})
    .then((result) => {
        if (!result.status || !result.data) {
            console.error(result.message);
        }
    }).catch((error) => {
        console.error((error as Error).message);
    });

