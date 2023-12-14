import React from 'react'
import './modals.css'

const Modals = ({setShowModal, formContent}) => {
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="modal-container">
            <button type="button" className="modal-close" onClick={handleCloseModal}></button>
            {formContent}
        </div>
    )
}

export default Modals