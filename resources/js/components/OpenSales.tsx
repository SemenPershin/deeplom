import { useEffect, useState } from "react";

interface salesProps {
    sessionsData: Array<sessionData>,
    hallsData: Array<hallData>,
    filmsData: Array<filmData>,
    csrfToken: string | null,
    getSessionData: () => Promise<void>
}

export function OpenSales(props: salesProps) {

    const [hallId, setHallId] = useState(0);
    const [sessionsData, setSessionsData] = useState<sessionState[]>([]);

    useEffect(() => {
        if (props.sessionsData[0] !== undefined) {
            setSessionsData([])
            props.sessionsData.forEach((session) => {
                setSessionsData((prevState) => { return [...prevState, { 'id': session.id, 'is_active': session.is_active, 'is_selected': false, 'type_of_action': '' }] })

            })


        }

    }, [props.sessionsData])

    function makeDateArr(sessionsData: Array<sessionData>) {

        const dateArr: string[] = [];
        sessionsData.forEach((session) => {
            if (session.hall_id === hallId && session.date) {
                dateArr.push(session.date)
            }

        })

        const uniqueDateArr = [...new Set(dateArr)];

        return uniqueDateArr;
    }

    function convertMinutes(minets: number) {

        return String(Math.floor(minets / 60)).padStart(2, '0') + ':' + String(minets % 60).padStart(2, '0');

    }

    function setStyle(object: sessionData) {

        const session = sessionsData.find(session => session.id === object.id)

        const styleObj = { backgroundColor: '', border: '' };

        if (session?.is_active) {
            styleObj.backgroundColor = 'rgb(144, 224, 112)';

        } else {
            styleObj.backgroundColor = 'rgb(146, 146, 146)'

        }

        if (session?.is_selected) {
            styleObj.border = '2px solid rgb(212, 75, 21)'
        } else {
            styleObj.border = '0px solid rgb(212, 75, 21)'
        }
        return styleObj
    }

    function getSelected(object: sessionData) {
        setSessionsData((prevState) => {
            const newState = prevState.map((element) => {

                if (element.id === object.id) {
                    const returnElement = { ...element, 'is_selected': !element.is_selected };

                    return returnElement

                }
                return element
            })


            return newState
        })
    }

    async function toogleSales(action: string) {

        const dataArr: number[] = [];
        sessionsData.forEach((session) => {

            if (session.is_selected) {
                dataArr.push(session.id)
            }

        })

        if (dataArr.length !== 0) {
            const dataForSend = JSON.stringify({ 'ids': dataArr })
            try {
                const response = await fetch(`/session/${action}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: dataForSend
                })

                if (response.ok) {
                    props.getSessionData()
                }
            } catch (error) {
                console.error('Ошибка при переключении сеанса:', error);
            }
        }
    }

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Открыть продажи</h2>
            </header>

            <div className="conf-step__wrapper text-center">

                <p className="conf-step__paragraph">Выберите зал:</p>
                <ul className="conf-step__selectors-box">
                    {props.hallsData.map((hall) => {
                        return (
                            <li key={hall.id}>
                                <input type="radio" required className="conf-step__radio" name="hall_id" value={hall.id} onClick={() => { setHallId(hall.id) }} />
                                <span className="conf-step__selector">{hall.name}</span>
                            </li>
                        )
                    })}
                </ul>

                <p className="conf-step__paragraph">Список сеансов:</p>
                {
                    makeDateArr(props.sessionsData).map((date, index) => {
                        return (
                            <div key={index} className="conf-step__selectors-box">
                                <p className="conf-step__paragraph"><strong>{date}</strong></p>

                                <div className="conf-step__movies">

                                    {
                                        props.sessionsData.map((session) => {
                                            if (session.date === date && session.hall_id === hallId) {
                                                return (
                                                    <div key={session.id} className="conf-step__movie" style={setStyle(session)} onClick={() => { getSelected(session) }}>
                                                        <img className="conf-step__movie-poster" alt="poster" src="i/poster.png" />
                                                        <h3 className="conf-step__movie-title">{props.filmsData.find(film => film.id === session.film_id)?.film_name}</h3>
                                                        <p className="conf-step__movie-duration">Начало показа: {convertMinutes(session.session_begin)}</p>
                                                    </div>
                                                )

                                            }

                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }

                <ul className="conf-step__selectors-box">

                </ul>
                <p className="conf-step__paragraph">Всё готово, теперь можно:</p>
                <button className="conf-step__button conf-step__button-accent" onClick={(e) => { toogleSales('activate') }}>Открыть продажу билетов</button>
                <button className="conf-step__button conf-step__button-accent" onClick={(e) => { toogleSales('deactivate') }}>Закрыть продажу билетов</button>
            </div>
        </section>
    )
}