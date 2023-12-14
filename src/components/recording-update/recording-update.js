import React, {useState} from 'react'
import Modals from "../shared/modals/modals";

const RecordingUpdate = ({ handleClose, show, id, patientName, recordingDate, patientPhone, doctorName, visits, fetchData }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const [formData, setFormData] = useState({
        'id': id,
        'patient_name': patientName,
        'patient_phone': patientPhone,
        'recording_date': recordingDate,
        'doctor_name': doctorName,
        'visits': visits
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost/control-admin/api/patient/update.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                fetchData()
                // Дополнительная обработка ответа сервера, если необходимо
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
        handleClose()
    };

    const handleInputChange = event => {
        const {name, value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(event.target)
    };

    return (
        <div className={showHideClassName}>
            <Modals setShowModal={handleClose}
                    formContent={
                        <form onSubmit={handleSubmit}>
                            <label>Имя пациента</label>
                            <input type="text" name="patient_name" value={formData.patient_name} onChange={handleInputChange}/>
                            <label>Дата записи</label>
                            <input type="text" name="recording_date" value={formData.recording_date} onChange={handleInputChange}/>
                            <label>Телефон пациента</label>
                            <input type="text" name="patient_phone" value={formData.patient_phone} onChange={handleInputChange}/>
                            <label>Имя врача</label>
                            <input type="text" name="doctor_name" value={formData.doctor_name} onChange={handleInputChange}/>
                            <input type="text" hidden={true} name="visit_status" value={formData.visits} onChange={handleInputChange}/>
                            <input type="text" hidden={true} name="id" value={formData.id} onChange={handleInputChange}/>
                            <button type="submit" className="submit-btn">Обновить запись</button>
                        </form>
                    } />
        </div>
    );
}

export default RecordingUpdate