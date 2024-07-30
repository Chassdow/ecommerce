import React from 'react';

function Bouton({ onClick, style, children }) {
    const combinedStyle = {...style };

    return (
        <button style={combinedStyle} onClick={onClick}>
            {children}
        </button>
    );
}

export default Bouton;