import React, {
  useState
} from 'react';
import { hasFormError } from '../../helpers/AppHelper';
import { forgotPassword } from '../../services/UsersService';
import { Modal } from 'react-bootstrap';

export default ModalForgotPassword = (props) => {
  const [email, setEmail]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors]       = useState({});
  const [isSuccess, setIsSuccess]  = useState(false);

  const {
    isOpen,
    setIsOpen
  } = props;

  return (
    <Modal
      show={isOpen}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Forgot Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="form-label">
          Enter Email:
        </label>
        <input
          value={email}
          disabled={isLoading}
          className={`form-control ${hasFormError(errors, 'email') ? 'is-invalid' : ''}`}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="invalid-feedback">
          {hasFormError(errors, 'email') ? errors.email.join(', ') : ''}
        </div>
        {(() => {
          if (isSuccess) {
            return (
              <p>
                Forgot password instructions sent.
              </p>
            )
          }
        })()}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary"
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            setErrors({});
            setIsSuccess(false);

            forgotPassword({ email })
              .then((payload) => {
                setEmail("");
                setIsLoading(false);
                setIsSuccess(true);
              }).catch((payload) => {
                console.log(payload.response);
                setErrors(payload.response.data);
                setIsLoading(false);
              })
          }}
        >
          Submit
        </button>
        <button
          className="btn btn-light"
          disabled={isLoading}
          onClick={() => {
            setIsLoading(false);
            setIsOpen(false);
          }}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
