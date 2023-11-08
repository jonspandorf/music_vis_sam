import { Button, Modal } from 'react-bootstrap'

const PopupDialog = ({ showPopup, closePopup, popupTitle, popupBody, continueProcess, btnText }) => {

    return (
        <Modal show={showPopup} onHide={closePopup}>
            <Modal.Header closeButton>
                <Modal.Title>{popupTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{popupBody}</Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={continueProcess}>
                    {btnText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PopupDialog