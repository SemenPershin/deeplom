import "../../css/stylesAdmin.css"
import "../../css/normalizeAdmin.css"

import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from "react";



export default function Login() {

    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        const metaElement = document.querySelector('meta[name="csrf-token"]');
        if (metaElement) {
            setCsrfToken(metaElement.getAttribute('content'));
        }
    }, []);

    return (
        <>
            <Head title="Идем в кино - Администраторская">

            </Head>

            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
                <span className="page-header__subtitle">Администраторррская</span>
            </header>
            <main>
                <section className="login">
                    <header className="login__header">
                        <h2 className="login__title">Авторизация</h2>
                    </header>
                    <div className="login__wrapper">
                        <form className="login__form" action="/login" method="POST" acceptCharset="utf-8">
                            <input type="hidden" name="_token" value={csrfToken === null ? '' : csrfToken} />
                            <label className="login__label" htmlFor="email">
                                E-mail
                                <input className="login__input" type="email" placeholder="example@domain.xyz" name="email" required />
                            </label>
                            <label className="login__label" htmlFor="pwd">
                                Пароль
                                <input className="login__input" type="password" placeholder="" name="password" required />
                            </label>
                            <div className="text-center">
                                <input value="Авторизоваться" type="submit" className="login__button" />
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
