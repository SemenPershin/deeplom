import "../../css/stylesAdmin.css"
import "../../css/normalizeAdmin.css"

import { Head, Link } from '@inertiajs/react';

import { HallManagement } from "../components/HallManagement";
import { HallConfiguration } from "../components/HallConfiguration";
import { SessionManagement } from "../components/SessionManagement";
import { FilmConfiguration } from "../components/FilmConfiguration";
import { OpenSales } from "../components/OpenSales";
import { useEffect, useState } from "react";


export default function Admin() {

    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [hallsData, setHallsData] = useState([]);
    const [seatsData, setSeatsData] = useState([]);
    const [filmsData, setFilmsData] = useState([]);
    const [sessionsData, setSessionsData] = useState([]);
    

    async function getHallData() {
        try {
            const response = await fetch("/halls", { method: "GET" });

            const data = await response.json();

            setHallsData(data);

        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async function getSeatData() {
        try {
            const response = await fetch("/seats", { method: "GET" });

            const data = response.json();

            setSeatsData(await data);

        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async function getFilmData() {
        try {
            const response = await fetch("/film", { method: "GET" });

            const data = response.json();

            setFilmsData(await data);

        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async function getSessionData() {
        try {
            const response = await fetch("/session", { method: "GET" });

            const data = response.json();


            setSessionsData(await data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    useEffect(() => {
        getHallData();
        getSeatData();
        getFilmData();
        getSessionData();

        const metaElement = document.querySelector('meta[name="csrf-token"]');
        if (metaElement) {
            setCsrfToken(metaElement.getAttribute('content'));
        }

    }, [])

    return (
        <>
            <Head title="Идем в кино - Администраторская">
                <script src="../js/accordeon.js"></script>
            </Head>

            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
                <span className="page-header__subtitle">Администраторррская</span>
            </header>

            <main className="conf-steps">
                <HallManagement csrfToken={csrfToken} hallsData={hallsData} getHallData={getHallData} />

                <HallConfiguration csrfToken={csrfToken} hallsData={hallsData} seatsData={seatsData} getHallData={getHallData} getSeatData={getSeatData} />

                <FilmConfiguration csrfToken={csrfToken} filmsData={filmsData} hallsData={hallsData} getFilmData={getFilmData} getSessionData={getSessionData} />

                <SessionManagement csrfToken={csrfToken} filmsData={filmsData} hallsData={hallsData} seatsData={seatsData} sessionsData={sessionsData} getSessionData={getSessionData} />

                <OpenSales csrfToken={csrfToken} sessionsData={sessionsData} hallsData={hallsData} filmsData={filmsData} getSessionData={getSessionData}/>
            </main>


        </>
    );
}
