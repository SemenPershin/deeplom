import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface WeeklyCalendarProps {
    csrfToken: string | null;
    setUserWelcomeData: Dispatch<SetStateAction<userWelcomeData[] | undefined>>
}

interface dateObj {
    fullDate: string;
    day: number,
    dayOfWeek: string,
    today: boolean,
    isChosen: boolean,
    isWeekend: boolean
}

type createDateArr = () => Array<dateObj>

export function WeeklyCalendar(props: WeeklyCalendarProps) {

    const [daysOfWeek, setDaysOfWeek] = useState<Array<dateObj>>();

    useEffect(() => {
        setDaysOfWeek(createDateArr());
    }, [])

    function createDateArr<createDateArr>() {

        const daysArr = [];
        const nameOfDays = [
            'Вс',
            'Пн',
            'Вт',
            'Ср',
            'Чт',
            'Пт',
            'Сб',
        ];

        for (let i = 0; i < 7; i++) {
            const day = new Date(new Date().setDate(new Date().getDate() + i)).getDate();
            const dayOfWeek = nameOfDays[new Date(new Date().setDate(new Date().getDate() + i)).getDay()];

            const dd = String(day).padStart(2, '0');
            const mm = String(new Date(new Date().setDate(new Date().getDate() + i)).getMonth() + 1).padStart(2, '0');
            const yyyy = String(new Date(new Date().setDate(new Date().getDate() + i)).getFullYear());

            const fullDate = `${yyyy}-${mm}-${dd}`

            daysArr.push({ fullDate: fullDate, day: day, dayOfWeek: dayOfWeek, today: i === 0 ? true : false, isChosen: i === 0 ? true : false, isWeekend: (dayOfWeek === nameOfDays[0] || dayOfWeek === nameOfDays[6]) ? true : false })

        }

        getDataFilm(daysArr[0].fullDate)

        return daysArr

    }

    async function getDataFilm(date: string) {
        try {
            const response = await fetch(`/welcome/${date}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                },
            })

            if (response.ok) {
                setDaysOfWeek((prevState) => {
                    const newState = prevState?.map((day) => {
                        if (day.fullDate === date) {
                            return { ...day, isChosen: true }
                        } else {
                            return { ...day, isChosen: false }
                        }
                    })

                    return newState
                })

                props.setUserWelcomeData(await response.json())
            }
        } catch (error) {
            console.error('Ошибка при получении данных сеансов:', error);
        }
    }

    return (
        <nav className="page-nav">

            {daysOfWeek?.map((day, index) => {
                return (
                    <a key={index} className={`page-nav__day ${day.today ? 'page-nav__day_today' : ''} ${day.isWeekend ? 'page-nav__day_weekend' : ''} ${day.isChosen ? 'page-nav__day_chosen' : ''}`} onClick={() => {getDataFilm(day.fullDate)}}>
                        <span className="page-nav__day-week">{day.dayOfWeek}</span><span className="page-nav__day-number">{day.day}</span>
                    </a>
                )
            })}

        </nav>
    )
}