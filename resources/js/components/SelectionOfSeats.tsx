import { useEffect, useState } from "react";

interface placesData {
    value: number,
    name: string,
    className: string,
}

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
}


export function SelectionOfSeats(props: HallProps) {

    const [placesData, setPlacesData] = useState<placesData[][]>();
    const [selectSeats, setSelectSeats] = useState<number[]>([]);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        const metaElement = document.querySelector('meta[name="csrf-token"]');
        if (metaElement) {
            setCsrfToken(metaElement.getAttribute('content'));
        }

        setPlacesData(createPlacesArr(props.hallInfo[0].rows, props.hallInfo[0].places))

    }, [])

    useEffect(() => {

        setPlacesData(createPlacesArr(props.hallInfo[0].rows, props.hallInfo[0].places))

    }, [selectSeats])

    function createPlacesArr(rows: number, places: number) {
        const placesArr = new Array(rows * places)
            .fill(0)
            .map((place, index) => {
                if (props.seats) {
                    let seat = props.seats.find((seat) => { return seat.seat_number === index + 1 })

                    if (seat && seat.seat_type === 'default' && !selectSeats.includes(seat.seat_number)) {
                        return { 'value': index + 1, 'name': "default[]", 'className': 'buying-scheme__chair buying-scheme__chair_standart' }

                    } else if (seat && seat.seat_type === 'vip' && !selectSeats.includes(seat.seat_number)) {
                        return { 'value': index + 1, 'name': "vip[]", 'className': 'buying-scheme__chair buying-scheme__chair_vip' }

                    } else if (seat && (seat.seat_type === 'default' || seat.seat_type === 'vip' && selectSeats.includes(seat.seat_number))) {
                        return { 'value': index + 1, 'name': "selected[]", 'className': 'buying-scheme__chair buying-scheme__chair_selected' }

                    } else if (seat && seat.seat_type === 'taken' && !selectSeats.includes(seat.seat_number)) {
                        return { 'value': index + 1, 'name': "taken[]", 'className': 'buying-scheme__chair buying-scheme__chair_taken' }

                    } else {
                        return { 'value': index + 1, 'name': "disabled[]", 'className': 'buying-scheme__chair buying-scheme__chair_disabled' }
                    }

                } else {
                    return { 'value': index + 1, 'name': "disabled[]", 'className': 'buying-scheme__chair buying-scheme__chair_disabled' }
                }

            })

        const splitPlacesArr = [];

        for (let i = 0; i < props.hallInfo[0].rows; i++) {
            splitPlacesArr.push(placesArr.slice(props.hallInfo[0].places * i, props.hallInfo[0].places * (i + 1)))
        }

        return splitPlacesArr;
    }

    function convertMinutes(minets: number) {

        return String(Math.floor(minets / 60)).padStart(2, '0') + ':' + String(minets % 60).padStart(2, '0');

    }

    function toogle(place: placesData) {
        if (place.name === 'vip[]' || place.name === 'default[]' || place.name === 'selected[]') {
            setSelectSeats((prevState) => {
                let newState = [];
                if (prevState?.find(value => place.value === value)) {
                    newState = prevState.filter(num => num !== place.value)
                } else {
                    newState = [...prevState, place.value]
                }
                return newState
            })

        }
    }
    return (
        <>
            <input type="hidden" name="_token" defaultValue={csrfToken === null ? '' : csrfToken} />
            <input type="hidden" name="session_id" defaultValue={props.sessionInfo.session_id} />
            <input type="hidden" name="film_name" defaultValue={props.sessionInfo.film_name} />
            <input type="hidden" name="hall_name" defaultValue={props.sessionInfo.hall_name} />
            <input type="hidden" name="session_begin" defaultValue={convertMinutes(props.sessionInfo.session_begin)} />
            <section className="buying">
                <div className="buying__info">
                    <div className="buying__info-description">
                        <h2 className="buying__info-title">{props.sessionInfo.film_name}</h2>
                        <p className="buying__info-start">Начало сеанса: {convertMinutes(props.sessionInfo.session_begin)}</p>
                        <p className="buying__info-hall">{props.sessionInfo.hall_name}</p>
                    </div>
                    <div className="buying__info-hint">
                        <p>Тапните дважды,<br />чтобы увеличить</p>
                    </div>
                </div>
                <div className="buying-scheme">
                    <div className="buying-scheme__wrapper">

                        {
                            placesData?.map((row, indexR) => {
                                return (
                                    <div key={indexR} className="buying-scheme__row">
                                        {
                                            row.map((place, indexP) => {
                                                return (
                                                    <input key={indexP} readOnly autoComplete="off" value={place.value} name={place.name} className={place.className} style={{ cursor: 'pointer' }} onClick={() => { toogle(place) }} />
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })

                        }

                    </div>


                    <div className="buying-scheme__legend">
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span className="buying-scheme__legend-value">250</span>руб)</p>
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span className="buying-scheme__legend-value">350</span>руб)</p>
                        </div>
                        <div className="col">
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято</p>
                            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}