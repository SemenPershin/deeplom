import { useState } from "react";

interface PaymentProps {
     bookingInfo: {
        film_name: string,
        hall_name: string,
        session_begin: string,
        price: number,
        selectPlaces: Array<string>,
        session_id: number,
        
     },
     csrfToken: string | null,

}


export  function Payment(props: PaymentProps) {

    const [qrCode, setQrCode] = useState({isActive: false, url: ''})
    async function sendTicketData() {
        const data = JSON.stringify({session_id: props.bookingInfo.session_id, seatsArr: props.bookingInfo.selectPlaces})
         try {
                const response = await fetch(`/ticket`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': props.csrfToken === null ? "" : props.csrfToken
                    },
                    body: data
                })

                if (response.ok) {
                    const url = await response.text()
                    console.log(url)
                    setQrCode({isActive: true, url: url})
                }
            } catch (error) {
                console.error('Ошибка при переключении сеанса:', error);
            }
    }

    return <>
        <header className="page-header">
            <h1 className="page-header__title">Идём<span>в</span>кино</h1>
        </header>
        <main>
            <section className="ticket">

                <header className="tichet__check">
                    <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
                </header>

                <div className="ticket__info-wrapper">
                    <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{props.bookingInfo.film_name}</span></p>
                    <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">{props.bookingInfo.selectPlaces.join(', ')}</span></p>
                    <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{props.bookingInfo.hall_name}</span></p>
                    <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{props.bookingInfo.session_begin}</span></p>
                    <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{props.bookingInfo.price}</span> рублей</p>

                    {qrCode.isActive === false ? <button className="acceptin-button" onClick={()=>{sendTicketData()}}>Получить код бронирования</button> : <></>}

                    {qrCode.isActive === true ? <img className="ticket__info-qr" src={qrCode.url}/> : <></>}
                    
                    <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
                    <p className="ticket__hint">Приятного просмотра!</p>
                </div>
            </section>
        </main>
    </>


}