// Imports

import cron from 'node-cron';
import { DefaultReturnObject } from '../../types';

// Exports

export async function scheduleCronJob(cronExpression: string, callback: () => void): Promise<DefaultReturnObject<boolean>> {
    try {

        cron.schedule(cronExpression, callback);
        return {
            status: true,
            data: true,
            message: 'Cron job scheduled successfully'
        }

    } catch (error) {
        return {
            status: false,
            data: false,
            message: (error as Error).message
        }
    }
}

