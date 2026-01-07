// Imports

import { scheduleCronJob } from '../lib/cores/cron';
import { cronExpression } from '../constants';
import { switchLazySpa } from '../lib/service/shell.service';

// Function

async function runAutomation(runAt: Date) {
    try{

        const result = await switchLazySpa(runAt);
        if (!result.status || !result.data) {
            console.error(result.message);
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

