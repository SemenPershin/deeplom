import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;

    interface userWelcomeData {
        filmData: {
            film_duration: number,
            film_name: string,
            country: string,
            short_description: string,
        },
        
        sessionData: Array<sessionData>
    }
    
    interface sessionData {
        hallName: string,
        sessionsTime: Array<{
            id: number,
            session_begin: number
        }>
    }

    interface sessionData {
        id: number,
        hall_id: number,
        film_id: number,
        price_default: number,
        price_vip: number,
        session_begin: number,
        session_end: number,
        date: string,
        is_active: boolean
    }

    interface hallData {
        id: number,
        name: string,
        rows: number,
        places: number
    }

    interface filmData {
        film_name: string,
        film_duration: number,
        id: number,
        short_description: string,
        country: string,
    }

    interface sessionState {
        id: number,
        is_active: boolean,
        is_selected: boolean,
    }

    interface seatData {
        id: number,
        hall_id: number,
        seat_number: number,
        seat_type: string,
    }
}
