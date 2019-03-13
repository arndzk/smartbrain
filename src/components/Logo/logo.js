import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt 0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 200, width: 200 }} >
                <div className="Tilt-inner pa5"><img style={{paddingTop: '5'}} alt='logo' src={brain}/></div>
            </Tilt>
        </div>
    );
}

export default Logo;