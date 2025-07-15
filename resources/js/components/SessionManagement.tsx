import { useEffect, useState } from "react";


interface SessionProps {
    hallsData: Array<hallData>,
    seatsData: Array<seatData>,
    filmsData: Array<filmData>,
    sessionsData: Array<sessionData>,
    csrfToken: string | null,
    getSessionData: () => Promise<void>,
}

export function SessionManagement(props: SessionProps) {
    
    const [createForm, setCreateForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentSession, setCurrentSession] = useState({ 'hall_id': 0, 'date': '', 'time': '', 'film_id': 0, 'price_default': 0, 'price_vip': 0, 'session_id': 0 });

    async function postSession(e: React.FormEvent<HTMLFormElement>, id?: number) {
        if (e.target instanceof HTMLFormElement) {
            const formData = new FormData(e.target);

            const beginTime = String(formData.get('time')).split(':');
            const beginTimeHours = parseInt(beginTime[0], 10);
            const beginTimeMinutes = parseInt(beginTime[1], 10);

            const filmDuration = props.filmsData?.find(film => film.id === Number(formData.get('film_id')))?.film_duration;

            const sessionBegin = beginTimeMinutes + beginTimeHours * 60;
            const sessionEnd = sessionBegin + (filmDuration === undefined ? 0 : filmDuration);

            formData.append('session_begin', String(sessionBegin));
            formData.append('session_end', String(sessionEnd));

            formData.delete('time');

            try {
                const response = await fetch(id === undefined ? `/session` : `/session/${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                })

                if (response.ok) {
                    props.getSessionData();
                    setCreateForm(false);
                }
            } catch (error) {
                console.error('Ошибка при добавлении:', error);
            }
        } else {
            console.error("Объект события не является формой")
        }

    }

    async function deleteSession(id?: number) {

        try {
            const response = await fetch(`/session/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                },

            })

            if (response.ok) {
                props.getSessionData();
                setCreateForm(false);
            }
        } catch (error) {
            console.error('Ошибка при удалени:', error);
        }
    }

    function sessionForm() {
        return <>
            <p className="conf-step__paragraph"><strong>{isEdit === false ? 'Добавление сеанса' : 'Редактирование сеанса'}</strong></p>
            <p className="conf-step__paragraph">Установите время начала сеанса:</p>
            <input className="login__input" name="time" required type='time' value={currentSession.time} onChange={(e) => { setCurrentSession((prevState) => { return { ...prevState, 'time': e.target.value } }) }} />


            <p className="conf-step__paragraph">Выберите фильм:</p>
            <select className="login__input" name="film_id" required value={currentSession.film_id} onChange={(e) => { setCurrentSession((prevState) => { return { ...prevState, 'film_id': Number(e.target.value) } }) }}>
                <option value={0}>-----</option>
                {props.filmsData.map((element) => {
                    return (
                        <option key={element.id} value={element.id}>{element.film_name}</option>
                    )
                })}
            </select>

            <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
            <div className="conf-step__legend">

                <label className="conf-step__label">Цена, рублей
                    <input type="number" required className="conf-step__input" name="price_default" placeholder="0" value={currentSession.price_default} onChange={(e) => { setCurrentSession((prevState) => { return { ...prevState, 'price_default': Number(e.target.value) } }) }} />
                </label>

                за <span className="conf-step__chair conf-step__chair_standart"></span> обычные кресла
            </div>

            <div className="conf-step__legend">

                <label className="conf-step__label">Цена, рублей
                    <input type="number" required className="conf-step__input" name="price_vip" placeholder="0" value={currentSession.price_vip} onChange={(e) => { setCurrentSession((prevState) => { return { ...prevState, 'price_vip': Number(e.target.value) } }) }} />
                </label>

                за <span className="conf-step__chair conf-step__chair_vip"></span> VIP кресла
            </div>

            <fieldset className="conf-step__buttons text-center">
                {isEdit === true ? <button className="login__button" onClick={(e) => { e.preventDefault(); deleteSession(currentSession.session_id) }}>Удалить</button> : <></>}
                <input type="submit" defaultValue="Сохранить" className="conf-step__button conf-step__button-accent" />
            </fieldset>
        </>
    }

    function convertMinutes(minets: number) {
        return String(Math.floor(minets / 60)).padStart(2, '0') + ':' + String(minets % 60).padStart(2, '0');

    }

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Управление сеансами</h2>
            </header>
            <form onSubmit={(e) => { e.preventDefault(); isEdit === false ? postSession(e) : postSession(e, currentSession.session_id) }}>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">Выберите зал:</p>
                    <ul className="conf-step__selectors-box">
                        {props.hallsData.map((element) => {
                            return (
                                <li key={element.id}>
                                    <input type="radio" required className="conf-step__radio" name="hall_id" value={element.id} onClick={() => { setCurrentSession((prevState) => { return { ...prevState, 'hall_id': element.id } }) }} />
                                    <span className="conf-step__selector">{element.name}</span>
                                </li>
                            )
                        })}
                    </ul>

                    <p className="conf-step__paragraph">Выберите дату</p>
                    <input className="login__input" name="date" required type='date' value={currentSession.date} onChange={(e) => { setCurrentSession((prevState) => { return { ...prevState, 'date': e.target.value } }) }} />

                    <p className="conf-step__paragraph">
                        <button className="conf-step__button conf-step__button-accent" onClick={(e) => { e.preventDefault(); setIsEdit(false); setCreateForm(!createForm); setCurrentSession((prevState) => { return { ...prevState, 'time': '', 'film_id': 0, 'price_default': 0, 'price_vip': 0 } }) }}>{createForm === false ? 'Добавить' : 'Скрыть'}</button>
                    </p>

                    {createForm === false ? <></> : sessionForm()}

                    <div className="conf-step__seances">
                        <div className="conf-step__seances-hall">
                            { ((currentSession.hall_id === 0) || (currentSession.date === '')) ?  <p className="conf-step__paragraph"><strong>Выберите ЗАЛ и ДАТУ для просмотра сетки сеансов</strong></p> : <></>}
                            <h3 className="conf-step__seances-title">{props.hallsData.find(hall => hall.id === currentSession.hall_id)?.name} - {currentSession.date}</h3>
                            <div className="conf-step__seances-timeline">

                                {props.sessionsData.map((session) => {
                                    if (session.hall_id === currentSession.hall_id && session.date === currentSession.date) {
                                        const sessionStart = String(Math.floor(session.session_begin / 60)).padStart(2, '0') + ':' + String(session.session_begin % 60).padStart(2, '0');
                                        const sessionLength = 720 / 1440 * (session.session_end - session.session_begin);
                                        const sessionBegin = 720 / 1440 * session.session_begin;
                                        const filmName = props.filmsData.find((film) => { return film.id === session.film_id })

                                        return (
                                            <div key={session.id} className="conf-step__seances-movie" style={{ width: `${sessionLength}px`, backgroundColor: "rgb(133, 255, 137)", left: `${sessionBegin}px` }} onClick={() => { setCreateForm(true); setIsEdit(true); setCurrentSession((prevState) => { return { ...prevState, 'time': convertMinutes(session.session_begin), 'film_id': session.film_id, 'price_default': session.price_default, 'price_vip': session.price_vip, 'session_id': session.id } }) }}>
                                                <p className="conf-step__seances-movie-title">{filmName?.film_name}</p>
                                                <p className="conf-step__seances-movie-start" >{sessionStart}</p>
                                                
                                            </div>
                                            
                                        )
                                    }

                                })}

                                
                            </div>
                        </div>
                    </div>

                </div>
            </form>



        </section>
    )
}