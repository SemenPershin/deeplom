import { useState } from "react";


interface FilmProps {
    filmsData: Array<filmData>,
    hallsData: Array<hallData>,
    csrfToken: string | null,
    getFilmData: () => Promise<void>,
    getSessionData: () => Promise<void>
}

export function FilmConfiguration(props: FilmProps) {
    const [createForm, setCreateForm] = useState(false);
    const [editForm, setEditForm] = useState({ 'isActive': false, 'filmId': 0 });
    const [filmData, setFilmData] = useState({ 'name': '', 'time': 1, 'description': '', 'country': '' })

    async function postFilm(e: React.FormEvent<HTMLFormElement>, id: number | undefined = undefined) {
        if (e.target instanceof HTMLFormElement) {
            const formData = new FormData(e.target);
            console.log(formData.get('img'))
            try {
                const response = await fetch(id === undefined ? `/film` : `/film/${id}`, {
                    method: "POST",
                    headers: {
                        
                        'Accept': 'application/json',
                        
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: formData
                })

                if (response.ok) {
                    props.getFilmData();
                    setCreateForm(false);
                    setEditForm({ 'isActive': false, 'filmId': 0 });
                }

            } catch (error) {
                console.error('Ошибка при добавлении:', error);
            }
        } else {
            console.error("Объект события не является формой")
        }
    }

    async function deleteFilm(id: number) {

        try {
            const response = await fetch(`/film/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                },

            })

            if (response.ok) {
                props.getFilmData();
                setEditForm({ 'isActive': false, 'filmId': 0 })
            }

        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    }

    function onChangeFilmTime(e: React.ChangeEvent<HTMLInputElement>) {
        if (Number(e.target.value) < 1) {
            console.log(1)
            setFilmData((prevState) => { return { ...prevState, 'time': 1 } });
        } else {
            setFilmData((prevState) => { return { ...prevState, 'time': Number(e.target.value) } });
        }



    }

    function filmForm(id?: number, name?: string, time?: number, description?: string, country?: string) {
        return <>
            <p className="conf-step__paragraph"><strong>{createForm === true ? 'Добавление фильма' : 'Редактирование фильма'}</strong></p>
            <form className="login__form" onSubmit={(e) => { e.preventDefault(); id === undefined ? postFilm(e) : postFilm(e, id) }}>

                <input type="hidden" name="_token" defaultValue={props.csrfToken === null ? '' : props.csrfToken} />

                <label className="login__label">
                    Название фильма
                    <input className="login__input" name="name" required type='text' value={filmData.name} onChange={(e) => { setFilmData((prevState) => { return { ...prevState, 'name': e.target.value } }) }} />
                </label>

                <label className="login__label">
                    Длительность фильма, мин
                    <input className="login__input" name="time" required type='number' value={filmData.time} onChange={(e) => { onChangeFilmTime(e) }} />
                </label>

                <label className="login__label">
                    Краткое описание
                    <textarea className="login__input" name="description" required value={filmData.description} onChange={(e) => { setFilmData((prevState) => { return { ...prevState, 'description': e.target.value } }) }} />
                </label>

                <label className="login__label">
                    Страна производства
                    <input className="login__input" name="country" required type='text' value={filmData.country} onChange={(e) => { setFilmData((prevState) => { return { ...prevState, 'country': e.target.value } }) }} />
                </label>

                <label className="login__label">
                    Постер
                    <input className="login__input" name="img"  type='file'/>
                </label>

                <div className="text-center">
                    <input defaultValue="Добавить" type="submit" className="login__button" />
                    {id !== undefined ? <button className="login__button" onClick={(e) => { e.preventDefault(); deleteFilm(id) }}>Удалить</button> : <></>}
                </div>
                <br></br>

            </form>
        </>;
    }

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Конфигурация фильмов</h2>
            </header>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">
                    <button className="conf-step__button conf-step__button-accent" onClick={() => { setCreateForm(!createForm); setEditForm({ 'isActive': false, 'filmId': 0 }); setFilmData({ 'name': '', 'time': 1, 'description': '', 'country': '' }) }}>{createForm === false ? 'Добавить фильм' : 'Скрыть'}</button>
                </p>
                {createForm === true ? filmForm() : <></>}
                {editForm.isActive === true ? filmForm(editForm.filmId, filmData.name, filmData.time, filmData.description, filmData.country) : <></>}
                <div className="conf-step__movies">
                    {props.filmsData.map((element) => {
                        return (
                            <div key={element.id} className="conf-step__movie" onClick={() => { setEditForm({ 'isActive': true, 'filmId': element.id }); setCreateForm(false); setFilmData({ 'name': element.film_name, 'time': element.film_duration, 'description': element.short_description, 'country': element.country }) }}>
                                <img className="conf-step__movie-poster" alt="poster" src={element.url} />
                                <h3 className="conf-step__movie-title">{element.film_name}</h3>
                                <p className="conf-step__movie-duration">{element.film_duration} минут </p>
                            </div>
                        )
                    })}

                </div>
            </div>
        </section>
    )
}