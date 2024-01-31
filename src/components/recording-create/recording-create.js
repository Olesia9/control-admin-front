import React, {useState} from 'react'
import "./recording-create.css"
import Modals from "../shared/modals/modals";

const RecordingCreate = ({fetchDat}) => {
    const [showModal, setShowModal] = useState(null);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const showHideClassNam = showModal ? "modal display-block" : "modal display-none";

    const [formCreateData, setFormCreateData] = useState({});

    const createDataSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost/control-admin/api/patient/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formCreateData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                fetchDat()
                // Дополнительная обработка ответа сервера, если необходимо
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
        handleCloseModal()
    };

    const inputChange = event => {
        const {name, value} = event.target;
        setFormCreateData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <button type="button" className="btn-add" onClick={handleButtonClick}>Добавить пациента</button>
            <div className={showHideClassNam}>
                <Modals setShowModal={setShowModal}
                        formContent={
                            <form onSubmit={createDataSubmit}>
                                <label>Имя пациента</label>
                                <input type="text" name="patient_name" onChange={inputChange}/>
                                <label>Дата записи</label>
                                <input type="text" name="recording_date" onChange={inputChange}/>
                                <label>Телефон пациента</label>
                                <input type="text" name="patient_phone" onChange={inputChange}/>
                                <label>Имя врача</label>
                                <input type="text" name="doctor_name" onChange={inputChange}/>
                                <button type="submit" className="submit-btn">Добавить запись</button>
                            </form>
                        } />
            </div>
        </div>
    )
}

export default RecordingCreate