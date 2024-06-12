import React, { useState, useEffect } from 'react';
import styles from "./Final.module.css";
import myImage_1 from './im_2.png';
import myImage_2 from './im_3.png';
import myImage_3 from './im_4.png';
import myImage_4 from './im_5.png';
import myImage_5 from './im_6.png';
import myImage_6 from './im_7.png';
import myImage_7 from './im_8.png';
import myImage_8 from './im_9.png';
import myImage_9 from './im_10.png';
import myImage_10 from './im_11.png';

function Final({ responseData }) {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [myImage, setMyImage] = useState(myImage_1);

    useEffect(() => {
        if (responseData.length < 20) {
            setMyImage(myImage_1);
        } else if (responseData.length < 40) {
            setMyImage(myImage_2);
        } else if (responseData.length < 60) {
            setMyImage(myImage_3);
        } else if (responseData.length < 80) {
            setMyImage(myImage_4);
        } else if (responseData.length < 100) {
            setMyImage(myImage_5);
        } else if (responseData.length < 120) {
            setMyImage(myImage_6);
        } else if (responseData.length < 140) {
            setMyImage(myImage_7);
        } else if (responseData.length < 160) {
            setMyImage(myImage_8);
        } else if (responseData.length < 180) {
            setMyImage(myImage_9);
        } else {
            setMyImage(myImage_10);
        }
    }, [responseData]);

    const handleMathResultClick = () => {
        setIsImageViewerOpen(!isImageViewerOpen);
    };

    return (
        <div className={styles.container}>
            {isImageViewerOpen && (
                <img className={styles.imaged} src={myImage} alt="Image" />
            )}
            <button onClick={handleMathResultClick} className={styles.mathResultButton}>Math Result</button>
        </div>
    );
}

export default Final;
