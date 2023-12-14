import React, {useState, useMemo} from 'react'
import './patient-table.css';
import RecordingUpdate from "../recording-update/recording-update";

const PatientTable = ({data, fetchData}) => {
    const [showModal, setShowModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTrue, setShowTrue] = useState(true);
    const [showFalse, setShowFalse] = useState(true);

    const handleButtonClick = (id) => {
        setShowModal(id);
    };

    const handleCloseModal = () => {
        setShowModal(null);
    };

    const handleDeleteRow = (id) => {
        // Данные для отправки на сервер в формате JSON
        const requestData = {
            id: id,
        };

        // Ваш запрос на сервер для удаления строки с помощью метода DELETE
        fetch('http://localhost/control-admin/api/patient/delete.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // Преобразование в JSON и передача в теле запроса
        })
            .then(response => {
                // Обновить данные после удаления строки
                fetchData();
            })
            .catch(error => {
                // Обработка ошибки
                console.error('Ошибка удаления строки', error);
            });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTrueChange = () => {
        setShowTrue(!showTrue);
    };

    const handleFalseChange = () => {
        setShowFalse(!showFalse);
    };

    const filteredData = useMemo(
        () =>
            data.filter(
                (item) =>
                    ((showTrue && item.visit_status === 'true') || (showFalse && item.visit_status === 'false')) &&
                    item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [data, showTrue, showFalse, searchTerm]
    );

    const handleChangeVisit = (updatedData, id) => {
        const requestData = {
            id: id,
            visits: updatedData
        };
        fetch('http://localhost/control-admin/api/patient/visit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
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
    };

    const handleCheckChange = (id, value) => {
        handleChangeVisit(value, id);
    };

    return (
        <>
            <div className="container-filter">
                <input
                    className="search"
                    type="search"
                    placeholder="Введите ФИО..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <div className="filter">
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={showTrue}
                        onChange={handleTrueChange}
                    />
                    <label>Подтверждено</label>
                </div>

                <div className="filter">
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={showFalse}
                        onChange={handleFalseChange}
                    />
                    <label>Не подтверждено</label>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Имя пациента</th>
                    <th>Дата записи</th>
                    <th>Телефон пациента</th>
                    <th>Имя врача</th>
                    <th>Подтверждение</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {data && data.length > 0 ? (
                    filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.patient_name}</td>
                            <td>{item.recording_date}</td>
                            <td>{item.patient_phone}</td>
                            <td>{item.doctor_name}</td>
                            <td className="checkbox-approve">
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    defaultChecked={item.visit_status === 'true'}
                                    onChange={(e) => handleCheckChange(item.id, e.target.checked ? 1 : 0)}
                                />
                            </td>
                            <td>
                                <div>
                                    <button className="button muted-button btn-add"
                                            onClick={() => handleButtonClick(item.id)}>Редактировать
                                    </button>
                                    {showModal === item.id && (
                                        <RecordingUpdate
                                            fetchData={fetchData}
                                            id={item.id}
                                            patientName={item.patient_name}
                                            recordingDate={item.recording_date}
                                            patientPhone={item.patient_phone}
                                            doctorName={item.doctor_name}
                                            visits={item.visits}
                                            show={showModal}
                                            handleClose={handleCloseModal}
                                        />
                                    )}
                                    <button className="button muted-button btn-remove"
                                            onClick={() => handleDeleteRow(item.id)}>Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>No users</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}

export default PatientTable