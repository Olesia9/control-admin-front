import React, {useCallback, useEffect, useState} from 'react'
import './App.css';
import RecordingCreate from "./components/recording-create/recording-create";
import PatientTable from "./components/patient-table/patient-table";

const App = () => {
    const [dataArray, setDataArray] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            await fetch("http://localhost/control-admin/api/patient/read.php")
                .then(res => res.json())
                .then((result) => {
                    // Имитация задержки чтения данных (можно удалить для рабочего приложения)
                    setTimeout(() => {
                        setDataArray(result);
                        setLoading(false); // Изменение состояния загрузки после получения данных
                    }, 1000);
                })
        } catch (error) {
            console.error('Error fetching data:', error);
            //setLoading(false); // Обновляем состояние загрузки в случае ошибки
        }
    }, []);

    useEffect(() => {
        void fetchData(); // Ensure data is fetched correctly
    }, [fetchData]);

    return (
        <div>
            <div className="header">
                <div className="title">
                    <span>Система администрирования записи пациентов</span>
                </div>
            </div>
            <div className="container">
            <div className="flex-row">
                <div className="flex-large">
                    <RecordingCreate fetchDat={fetchData}/>
                </div>
                <div className="flex-large">
                    {loading ? ( // Показывать "Loading..." только при загрузке данных
                        <span className="loader"></span>
                    ) : (
                        <PatientTable data={dataArray.data} fetchData={fetchData}/>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}

export default App;
