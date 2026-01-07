// Imports

import { DefaultReturnObject } from '../../types';
import { getTimeFromDate } from '../cores/date';
import { turnOn } from '../cores/shelly';
import { timesToSwitch } from '../../constants';

// Exports

export async function switchLazySpa(runAt: Date): Promise<DefaultReturnObject<boolean>> {
    try{

        const time = await getTimeFromDate(runAt);
        if (!time.status || !time.data) {
            return {
                status: false,
                data: false,
                message: time.message
            }
        }

        if(time.data === timesToSwitch.lazySpa.on){

            const result = await turnOn(true);
            if (!result.status || !result.data) {
                return {
                    status: false,
                    data: false,
                    message: result.message
                }
            }
            
        } else if(time.data === timesToSwitch.lazySpa.off){

            const result = await turnOn(false);
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

