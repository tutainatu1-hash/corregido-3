import React from 'react';

interface MediaLightboxProps {
    src: string;
    onClose: () => void;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({ src, onClose }) => {
    const isVideo = src.startsWith('data:video');

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-4xl hover:text-slate-300 transition-colors z-10"
                aria-label="Cerrar vista previa"
            >
                &times;
            </button>
            <div className="max-w-4xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                {isVideo ? (
                    <video 
                        src={src} 
                        className="w-full h-full object-contain"
                        controls 
                        autoPlay
                        playsInline
                    />
                ) : (
                    <img 
                        src={src} 
                        alt="Vista previa a tamaño completo" 
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
        </div>
    );
};

export default MediaLightbox;
