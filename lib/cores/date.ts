// Imports

import { DefaultReturnObject } from '../../types';

// Exports

export async function getTimeFromDate(date: Date): Promise<DefaultReturnObject<string>> {
    try{

        const hours = date.getHours();
        const minutes = date.getMinutes();

        return {
            status: true,
            data: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
            message: 'Time retrieved successfully'
        }

    } catch (error) {
        return {
            status: false,
            data: '',
            message: (error as Error).message
        }
    }
}

