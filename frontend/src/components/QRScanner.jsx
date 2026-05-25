import { useEffect } from 'react';

import { Html5QrcodeScanner } from 'html5-qrcode';


export default function QRScanner({ onScan }) {

    useEffect(() => {

        // create scanner
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: 250
            },
            false
        );


        // start scanner
        scanner.render(

            // success callback
            async (decodedText) => {

                // stop camera
                await scanner.clear();

                // send qr value to parent
                onScan(decodedText);
            },


            // error callback
            () => {

                // ignore scan errors
            }
        );


        // cleanup when component removed
        return () => {

            scanner.clear().catch(() => {});
        };

    }, []);


    return (

        <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-100">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Scan QR Code
            </h2>

            <div
                id="qr-reader"
                className="w-full max-w-sm mx-auto"
            />

        </div>
    );
}