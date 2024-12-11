import React from 'react';
import {
  Modal
} from "react-bootstrap";
import { deleteUser } from '../../../services/UsersService';

export default ModalDelete = (props) => {
  const {
    id,
    isOpen,
    isLoading,
    setIsOpen,
    setIsLoading
  } = props;

  return (
    <Modal
      show={isOpen}
    >
      <Modal.Header>
        <Modal.Title>
          Delete Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete this user?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-danger"
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);

            deleteUser(id).then(() => {
              window.location.href='/administration/users';
            }).catch((payload) => {
              console.log(payload.response);
              alert("Error in deleting user!");
            })
          }}
        >
          Confirm
        </button>
        <button
          disabled={isLoading}
          className="btn btn-light"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
