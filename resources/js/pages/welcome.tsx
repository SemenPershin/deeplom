
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {

    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [userWelcomeData, setUserWelcomeData] = useState<userWelcomeData[]>();

    useEffect(() => {
        const metaElement = document.querySelector('meta[name="csrf-token"]');
        if (metaElement) {
            setCsrfToken(metaElement.getAttribute('content'));
        }

    }, [])

    function convertMinutes(minets: number) {

        return String(Math.floor(minets / 60)).padStart(2, '0') + ':' + String(minets % 60).padStart(2, '0');

    }

    async function openSessionPage(id: number) {
        try {
            const response = await fetch(`/payment/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    
                    'X-CSRF-TOKEN': csrfToken === null ? "" : csrfToken,

                },

            })

        } catch (error) {
            console.error('Ошибка при добавлении:', error);
        }
    }

    return (
        <>
            <Head title='Идем в кино - Главная' />
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
            </header>

            <WeeklyCalendar csrfToken={csrfToken} setUserWelcomeData={setUserWelcomeData} />

            <main>

                {
                    userWelcomeData?.map((data, index) => {
                        return (
                            <section key={index} className="movie">
                                <div className="movie__info">
                                    <div className="movie__poster">
                                        <img className="movie__poster-image" alt="Звёздные войны постер" src="i/poster1.jpg" />
                                    </div>
                                    <div className="movie__description">
                                        <h2 className="movie__title">{data.filmData.film_name}</h2>
                                        <p className="movie__synopsis">{data.filmData.short_description}</p>
                                        <p className="movie__data">
                                            <span className="movie__data-duration">{data.filmData.film_duration} минута, </span>
                                            <span className="movie__data-origin">{data.filmData.country}</span>
                                        </p>
                                    </div>
                                </div>

                                {data.sessionData.map((session, index) => {
                                    return (
                                        <div key={index} className="movie-seances__hall">
                                            <h3 className="movie-seances__hall-title">{session.hallName}</h3>
                                            <ul className="movie-seances__list">
                                                {session.sessionsTime.map((time) => {
                                                    return (
                                                        <li key={time.id} className="movie-seances__time-block"><Link href={`/hall/${time.id}`} className="movie-seances__time">{convertMinutes(time.session_begin)}</Link></li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )
                                })}

                            </section>
                        )
                    })
                }
            </main>
        </>
    );
}
