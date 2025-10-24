import React from 'react';

const Modal = React.memo(({ 
  show, 
  title, 
  children, 
  onClose, 
  size = 'lg',
  showFooter = true,
  footerContent
}) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog ${sizeClasses[size]}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {showFooter && (
            <div className="modal-footer">
              {footerContent || (
                <>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
