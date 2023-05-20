import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from '../styles.module.css';

const modalRoot = document.querySelector('#modal-root');

function Modal({onClose, currentImageUrl, currentImageDescription}) {
  
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClickBackdrop = event => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  };

  return createPortal(
    <div className={css.Overlay} onClick={handleClickBackdrop}>
      <div className={css.Modal}>
        <img
          src={currentImageUrl}
          alt={currentImageDescription}
          loading="lazy"
        />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentImageUrl: PropTypes.string,
  currentImageDescription: PropTypes.string,
};

export default Modal;
