import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { SelectionOfSeats } from "../components/SelectionOfSeats";
import { Payment } from "../components/Payment";

interface HallProps {
    sessionInfo: sessionInfo,
    seats: Array<seatData>,
    hallInfo: Array<{
        rows: number,
        places: number
    }>
}

interface sessionInfo {
    hall_name: string,
    session_begin: number,
    film_name: string,
    session_id: number,
    price_vip: number,
    price_default: number
}


export default function Hall(props: HallProps) {

    const [tooglePages, setTooglePages] = useState(false);
    const [bookingInfo, setBookingInfo] = useState({ film_name: props.sessionInfo.film_name, hall_name: props.sessionInfo.hall_name, session_begin: '', price: 0, selectPlaces: [''], session_id: props.sessionInfo.session_id });
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    console.log(props)
    useEffect(() => {
        const metaElement = document.querySelector('meta[name="csrf-token"]');
        if (metaElement) {
            setCsrfToken(metaElement.getAttribute('content'));
        }

    }, [])

    function collectInfo(e: React.FormEvent<HTMLFormElement>) {
       
        if (e.target instanceof HTMLFormElement && (new FormData(e.target).getAll('selected[]').length !== 0)) {
            const formData = new FormData(e.target);
            let fullPrice = 0;
            let selectedPlaces:string[] = []
            formData.getAll('selected[]').forEach((place) => {

                selectedPlaces.push(String(place))
            });

            selectedPlaces.forEach((place) => {
                const type = props.seats.find(seat => seat.seat_number === Number(place))?.seat_type
                if (type === 'vip') {
                    fullPrice = fullPrice + props.sessionInfo.price_vip
                }
                if (type === 'default') {
                    fullPrice = fullPrice + props.sessionInfo.price_default
                }
            })
            setBookingInfo((prevState) => { return { ...prevState, session_begin: String(formData.get('session_begin')), selectPlaces: selectedPlaces, price: fullPrice } })
            setTooglePages(true)
        }
        
    }

   

    return (
        <>
            <Head title={"Идём в кино - " + (tooglePages === false ? "Выбор мест" : 'Бронирование')}></Head>
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
            </header>

            <main>
                <form onSubmit={(e) => { e.preventDefault(); collectInfo(e) }}>
                    {tooglePages === false ? <SelectionOfSeats sessionInfo={props.sessionInfo} seats={props.seats} hallInfo={props.hallInfo} /> : <Payment csrfToken={csrfToken} bookingInfo={bookingInfo}/>}

                    {tooglePages === false ? <button className="acceptin-button" >Забронировать</button> : <></>}
                </form>
            </main>
        </>
    )
}