import { useEffect, useState } from "react"

interface HallManagementProps {
    hallsData: Array<hallData>
    csrfToken: string | null,
    getHallData: () => Promise<void>,

}

export function HallManagement(props: HallManagementProps) {

    const [createForm, setCreateForm] = useState(false);

    async function addHall(e: React.FormEvent<HTMLFormElement>) {
        if (e.target instanceof HTMLFormElement) {
            const formData = new FormData(e.target);

            try {
                const response = await fetch(`/halls`, {
                    method: "POST",
                    headers: {
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: formData
                })

                if (response.ok) {
                    props.getHallData();
                }
            } catch (error) {
                console.error('Ошибка при добавлении:', error);
            }
        } else {
            console.error("Объект события не является формой")
        }
    }

    async function deleteHall(id: number) {
        try {
            const response = await fetch(`/halls/${id}`, {
                method: "DELETE",
                headers: {
                    'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                }
            })

            if (response.ok) {
                props.getHallData();
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    }

    const form = <>
        <form className="login__form" onSubmit={(e) => { e.preventDefault(); addHall(e); setCreateForm(false) }}>

            <input type="hidden" name="_token" defaultValue={props.csrfToken === null ? '' : props.csrfToken} />

            <label className="login__label">
                Название зала
                <input className="login__input" placeholder="" name="name" required />
            </label>

            <div className="text-center">
                <input defaultValue="Добавить" type="submit" className="login__button" />
            </div>

        </form>
    </>;

    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Управление залами</h2>
            </header>
            <div className="conf-step__wrapper">
                <p className="conf-step__paragraph">Доступные залы:</p>
                <ul className="conf-step__list">

                    {props.hallsData.map((element) => {
                        return (
                            <li key={element.id}>{element.name}
                                <button className="conf-step__button conf-step__button-trash" onClick={() => { deleteHall(element.id) }}></button>
                            </li>
                        )
                    })}

                </ul>
                {createForm === true ? form : <></>}
                <button className="conf-step__button conf-step__button-accent" onClick={() => { setCreateForm(!createForm) }}>{createForm === false ? "Создать зал" : "Отмена"}</button>

            </div>
        </section>
    )
}