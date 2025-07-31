import { useEffect, useState } from "react";

interface salesProps {
    sessionsData: Array<sessionData>,
    hallsData: Array<hallData>,
    filmsData: Array<filmData>,
    csrfToken: string | null,
    getSessionData: () => Promise<void>
}

interface TypeSelected {
    type: 'none' | 'toActive' | 'toDeactive' | 'both'
}

export function OpenSales(props: salesProps) {

    const [hallId, setHallId] = useState(0);
    const [typeSelected, setTypeSelected] = useState<TypeSelected>({ type: "none" })
    const [sessionsData, setSessionsData] = useState<sessionState[]>([]);

    useEffect(() => {
        if (props.sessionsData[0] !== undefined) {
            setSessionsData([])
            props.sessionsData.forEach((session) => {
                setSessionsData((prevState) => { return [...prevState, { 'id': session.id, 'is_active': session.is_active, 'is_selected': false, 'type_of_action': '' }] })

            })


        }

    }, [props.sessionsData])

    useEffect(() => {
        const stateArr = { isOpen: false, isClose: false }
        sessionsData.some((session) => {
            console.log(session.is_selected)
            if (session.is_active && session.is_selected) {

                stateArr.isClose = true
                return true
            }
        })

        sessionsData.some((session) => {
            if (!session.is_active && session.is_selected) {
                stateArr.isOpen = true
                return true
            }
        })

        setTypeSelected(() => {
            if (stateArr.isClose === true && stateArr.isOpen === false) {
                return { type: 'toDeactive' }
            }
            if (stateArr.isClose === false && stateArr.isOpen === true) {
                return { type: 'toActive' }
            }
            if (stateArr.isClose === true && stateArr.isOpen === true) {
                return { type: 'both' }
            }
            return { type: 'none' }
        })
    }, [sessionsData])

      useEffect(() => {
        if (props.hallsData[0]) {
            setHallId(props.hallsData[0].id)
        }
        
    }, [props.hallsData[0]])

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

    async function toogleSales() {

        const activSession: number[] = [];
        const deactivSession: number[] = [];
        sessionsData.forEach((session) => {

            if (session.is_selected && session.is_active) {
                activSession.push(session.id)
            }
            if (session.is_selected && !session.is_active) {
                deactivSession.push(session.id)
            }


        })

        if (deactivSession.length !== 0) {
            const dataForSend = JSON.stringify({ 'ids': deactivSession })
            try {
                const response = await fetch(`/session/activate`, {
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

        if (activSession.length !== 0) {
            const dataForSend = JSON.stringify({ 'ids': activSession })
            try {
                const response = await fetch(`/session/deactivate`, {
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

    function buttonValue () {
        switch (typeSelected.type) {
            case 'none': return "Выберите сеанс для действия"
            case 'toActive': return 'Открыть продажи'
            case 'toDeactive': return 'Закрыть продажи'
            case 'both': return 'Открыть/Закрыть продажи'
        }
    }
   
    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Открыть продажи</h2>
            </header>

            <div className="conf-step__wrapper">

                <p className="conf-step__paragraph">Выберите зал:</p>
                <ul className="conf-step__selectors-box">
                    {props.hallsData.map((hall, index) => {
                        return (
                            <li key={hall.id}>
                                <input type="radio" required className="conf-step__radio" defaultChecked={index === 0} name="hall_id" value={hall.id} onClick={() => { setHallId(hall.id) }} />
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
                                                        <img className="conf-step__movie-poster" alt="poster" src={props.filmsData.find(film => film.id === session.film_id)?.url} />
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
                <button className="conf-step__button conf-step__button-accent" disabled={typeSelected.type === 'none'} onClick={(e) => { toogleSales() }}>{buttonValue()}</button>
            </div>
        </section>
    )
}