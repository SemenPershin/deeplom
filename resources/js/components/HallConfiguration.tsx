import { use, useEffect, useState } from "react"


interface HallManagementProps {
    hallsData: Array<hallData>,
    seatsData: Array<seatData>,
    csrfToken: string | null,
    getHallData: () => Promise<void>,
    getSeatData: () => Promise<void>,
}

interface placesData {
    value: number,
    name: string,
    className: string,
}

export function HallConfiguration(props: HallManagementProps) {

    const [rowsAndPlaces, setRowsAndPlaces] = useState({ "rows": 0, "places": 0, "hall_id": 0 });
    const [placesData, setPlacesData] = useState<placesData[][]>();
    const [isUsedEffect, setUsedEffect] = useState({ 'forHallsData': false, 'forPlacesData': false });

    useEffect(() => {
        if (props.hallsData[0] && !isUsedEffect.forHallsData) {
            setRowsAndPlaces({ "rows": props.hallsData[0].rows, "places": props.hallsData[0].places, "hall_id": props.hallsData[0].id })

            setUsedEffect({ 'forHallsData': true, 'forPlacesData': isUsedEffect.forPlacesData })
        }

        if (props.seatsData[0] && !isUsedEffect.forPlacesData) {
            setPlacesData(createPlacesArr(rowsAndPlaces.rows, rowsAndPlaces.places))
            setUsedEffect({ 'forHallsData': isUsedEffect.forHallsData, 'forPlacesData': true })
        }

    }, [props.hallsData, props.seatsData])

    useEffect(() => {

        setPlacesData(createPlacesArr(rowsAndPlaces.rows, rowsAndPlaces.places))

    }, [rowsAndPlaces])

    async function sendSeatData(e: React.FormEvent<HTMLFormElement>) {
        if (e.target instanceof HTMLFormElement) {
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch(`/seats`, {
                    method: "POST",
                    headers: {
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: formData
                })

                if (response.ok) {
                    props.getHallData();
                    props.getSeatData();
                }
            } catch (error) {
                console.error('Ошибка при добавлении:', error);
            }
        } else {
            console.error("Объект события не является формой")
        }

    }

    function createPlacesArr(rows: number, places: number) {
        const placesArr = new Array(rows * places)
            .fill(0)
            .map((place, index) => {
                if (props.seatsData) {
                    let seat = props.seatsData.find((seat) => { return seat.seat_number === index + 1 && seat.hall_id === rowsAndPlaces.hall_id })

                    if (seat && seat.seat_type === 'default') {
                        return { 'value': index + 1, 'name': "default[]", 'className': 'conf-step__chair conf-step__chair_standart' }

                    } else if (seat && seat.seat_type === 'vip') {
                        return { 'value': index + 1, 'name': "vip[]", 'className': 'conf-step__chair conf-step__chair_vip' }

                    } else {
                        return { 'value': index + 1, 'name': "disabled[]", 'className': 'conf-step__chair conf-step__chair_disabled' }
                    }


                } else {
                    return { 'value': index + 1, 'name': "disabled[]", 'className': 'conf-step__chair conf-step__chair_disabled' }
                }

            })

        const splitPlacesArr = [];

        for (let i = 0; i < rowsAndPlaces.rows; i++) {
            splitPlacesArr.push(placesArr.slice(rowsAndPlaces.places * i, rowsAndPlaces.places * (i + 1)))
        }

        return splitPlacesArr;
    }

    function changeClasses(row: number, place: number) {
        setPlacesData((prevState) => {
            const newState = prevState?.map((newRow, indexR) => {
                if (row === indexR) {
                    return newRow.map((newPlace, indexP) => {
                        if (place === indexP) {

                            if (newPlace.name === 'default[]') {
                                return { value: newPlace.value, name: 'vip[]', className: 'conf-step__chair conf-step__chair_vip' }
                            } else if (newPlace.name === 'vip[]') {
                                return { value: newPlace.value, name: 'disabled[]', className: 'conf-step__chair conf-step__chair_disabled' }
                            } else {
                                return { value: newPlace.value, name: 'default[]', className: 'conf-step__chair conf-step__chair_standart' }
                            }

                        } else {
                            return newPlace
                        }
                    })
                } else {
                    return newRow
                }
            });
            return newState;
        })
    }

    function onChangeRow (e: React.ChangeEvent<HTMLInputElement>) {
        const reg = /^[0-9]/;
        if (reg.test(e.target.value)) {
            
            setRowsAndPlaces({ "rows": Number(e.target.value), 'places': rowsAndPlaces.places, 'hall_id': rowsAndPlaces.hall_id });
        }
    }

     function onChangePlace (e: React.ChangeEvent<HTMLInputElement>) {
        const reg = /^[0-9]/;
        if (reg.test(e.target.value)) {
            setRowsAndPlaces({ "rows": rowsAndPlaces.rows, 'places': Number(e.target.value), 'hall_id': rowsAndPlaces.hall_id }) 
        }
    }

    function undo (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        const currentHallData = props.hallsData.find((hall) => {return hall.id === rowsAndPlaces.hall_id });
        
        if (currentHallData) {
            
            setRowsAndPlaces((prevState) => {return {...prevState, rows: currentHallData.rows, places: currentHallData.places}})
        }
        
    }
    return (
        <section className="conf-step">
            <header className="conf-step__header conf-step__header_opened">
                <h2 className="conf-step__title">Конфигурация залов</h2>
            </header>

            <div className="conf-step__wrapper">
                <form onSubmit={(e) => { e.preventDefault(); sendSeatData(e) }}>
                    <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
                    <ul className="conf-step__selectors-box">

                        {props.hallsData.map((element) => {
                            return (
                                <li key={element.id}>
                                    <input type="radio" checked={element.id === rowsAndPlaces.hall_id} className="conf-step__radio" name="hall_id" defaultValue={element.id} onChange={() => { setRowsAndPlaces({ "rows": element.rows, "places": element.places, 'hall_id': element.id }) }} />
                                    <span className="conf-step__selector">{element.name}</span>
                                </li>
                            )
                        })}

                    </ul>

                    <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                    <div className="conf-step__legend">
                        <label className="conf-step__label">Рядов, шт<input type="number" name="rows" min={1} max={20} className="conf-step__input" value={rowsAndPlaces.rows} onChange={(e) => { onChangeRow(e)}} /></label>
                        <span className="multiplier">x</span>
                        <label className="conf-step__label">Мест, шт<input type="number" name="places" min={1} max={20} className="conf-step__input" value={rowsAndPlaces.places} onChange={(e) => {onChangePlace(e) }} /></label>
                    </div>

                    <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                    <div className="conf-step__legend">
                        <span className="conf-step__chair conf-step__chair_standart" /> — обычные кресла
                        <span className="conf-step__chair conf-step__chair_vip" /> — VIP кресла
                        <span className="conf-step__chair conf-step__chair_disabled" /> — заблокированные (нет кресла)
                        <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                    </div>

                    <div className="conf-step__hall">
                        <div className="conf-step__hall-wrapper">
                            {
                                
                                placesData?.map((row, indexR) => {
                                    return (
                                        <div key={indexR} className="conf-step__row">
                                            {
                                                row.map((place, indexP) => {
                                                    return (
                                                        <input key={indexP} readOnly autoComplete="off" value={place.value} name={place.name} className={place.className} onClick={() => { changeClasses(indexR, indexP) }} />
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })

                            }

                        </div>
                    </div>

                    <fieldset className="conf-step__buttons text-center">
                        <button className="conf-step__button conf-step__button-regular" onClick={(e)=> {undo(e)}}>Отмена</button>
                        <input type="submit" defaultValue="Сохранить" className="conf-step__button conf-step__button-accent" />
                    </fieldset>
                </form>
            </div>
        </section>
    )
}