import toast from 'react-hot-toast';

export const showConfirmation = (onConfirm, message = "¿Estás seguro de que deseas realizar esta acción?") => {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {message}
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                  onConfirm();
                }}
                className="bg-fucsia text-white px-4 py-2 rounded-md hover:bg-fucsia/90 transition-colors"
              >
                Sí
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
      }
    );
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#dcfce7',
      color: '#16a34a',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#fee2e2',
      color: '#dc2626',
    },
  });
};