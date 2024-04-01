import React, { useEffect, useState } from 'react';
import '../styles/Chatbot.css';
import imagen from '../img/dogbot.png';
import userImg from '../img/user.png';

const ChatbotPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [valInput, setValInput] = useState("");
    const [chat, setChat] = useState("");

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const changeMessage = (event) => {
        setValInput(event.target.value)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };


    const sendMessage = async () => {
        if (valInput) {
            let conv = `<div class="d-flex mt-2 w-100 justify-content-end"> <img style="height:20px;" src="${userImg}"/> <p class='text-end pes'>${valInput}</p></div>`;
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/chatbot/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mensaje: valInput, token })
            });

            const data = await response.json();
            console.log(data);


            if (response.status === 200) {
                data.forEach(element => {
                    conv += `<div class="d-flex mt-2"><img style="height:20px;" src="${imagen}"/> <p class="text-start pes2"> ${element} </p></div>`
                });
            } else {
                alert("Ocurrio un error en el chat");
            }
            // conv += `<div class="d-flex mt-2"><img style="height:20px;" src="${imagen}"/> <p class="text-start pes"> <div></div> ${"element"} </p></div>`
            setChat(conv)
            setValInput("")
        }
    }

    useEffect(() => {
        const michat = document.getElementById("michat");
        if (michat && chat) {
            michat.innerHTML += chat;
        }
        setChat("")
    }, [chat]);

    return (
        <>
            <div className="chatbot-popup">
                {isOpen && (
                    <div className="popup-content">
                        <div style={{ height: "500px", width: "400px" }}>
                            <div id='michat' style={{ height: "460px", width: "400px", overflowY: "auto" }}>
                                <div className='d-flex'><img style={{ height: "20px" }} src={imagen} alt='bot' /> <p className='text-start'> Bienvenido al chatbot de faunadex </p></div>
                            </div>
                            <div className='stretch-input'>
                                <input onKeyPress={handleKeyPress} value={valInput} type="text" className="myInput" onChange={changeMessage} /><button className='btncolor' onClick={sendMessage}><i className="bi bi-send"></i></button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='w-100 d-flex justify-content-end'>
                    <button className="botonOpen" onClick={togglePopup}>
                        <img style={{ height: "90px" }} src={imagen} alt='bot' />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatbotPopup;