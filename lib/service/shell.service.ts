// Imports

import dotenv from 'dotenv';
import { DefaultReturnObject } from '../../types';
import { getTimeFromDate } from '../cores/date';
import { turnOn } from '../cores/shelly';
import { timesToSwitch } from '../../constants';

// Load environment variables

dotenv.config();

// Environment variables

const lazySpaDeviceId = process.env.SHELLY_LAZY_SPA_DEVICE_ID;

if (!lazySpaDeviceId) {
    throw new Error('Missing environment variables');
}

// Exports

export async function switchLazySpa(runAt: Date): Promise<DefaultReturnObject<boolean>> {
    try{

        if (!lazySpaDeviceId) {
            return {
                status: false,
                data: false,
                message: 'Missing Device ID'
            }
        }

        const time = await getTimeFromDate(runAt);
        if (!time.status || !time.data) {
            return {
                status: false,
                data: false,
                message: time.message
            }
        }

        if(time.data === timesToSwitch.lazySpa.on){

            const result = await turnOn(true, lazySpaDeviceId);
            if (!result.status || !result.data) {
                return {
                    status: false,
                    data: false,
                    message: result.message
                }
            }
            
        } else if(time.data === timesToSwitch.lazySpa.off){

            const result = await turnOn(false, lazySpaDeviceId);
            if (!result.status || !result.data) {
                return {
                    status: false,
                    data: false,
                    message: result.message
                }
            }

        } else {
            return {
                status: false,
                data: false,
                message: `Invalid time: ${time.data}`
            }
        }

        return {
            status: true,
            data: true,
            message: `Lazy spa turned ${time.data === timesToSwitch.lazySpa.on ? 'on' : 'off'} successfully`
        }

    } catch (error) {
        return {
            status: false,
            data: false,
            message: (error as Error).message
        }
    }
}

