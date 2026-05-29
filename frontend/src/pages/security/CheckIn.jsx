import { useState } from 'react';

import toast from 'react-hot-toast';

import {
  ScanLine,
  LogIn,
  LogOut,
  RefreshCcw
} from 'lucide-react';

import QRScanner from '../../components/QRScanner';

import {
  checkIn,
  checkOut
} from '../../api/checkApi';


export default function CheckIn() {

  // =========================
  // states
  // =========================
  const [mode, setMode] =
      useState('check-in');

  const [result, setResult] =
      useState(null);

  const [scanning, setScanning] =
      useState(true);


  // =========================
  // handle qr scan
  // =========================
  const handleScan = async (passCode) => {

      try {

          // stop scanner
          setScanning(false);


          // choose api
          const action =
              mode === 'check-in'
                  ? checkIn
                  : checkOut;


          // api call
          const data = await action({
              passCode,
              location: 'Main Gate'
          });


          // save response
          setResult(data);


          // success message
          toast.success(data.message);

      } catch (error) {

          toast.error(
              error.response?.data?.message ||
              'Scan failed'
          );

          // reopen scanner
          setScanning(true);
      }
  };


  // =========================
  // scan next visitor
  // =========================
  const resetScanner = () => {

      setResult(null);

      setScanning(true);
  };


  return (

      <div className="min-h-screen bg-gray-100 p-6">

          <div className="max-w-3xl mx-auto space-y-6">

              {/* heading */}
              <div>

                  <h1 className="text-3xl font-bold text-gray-800">
                      Security Gate Scanner
                  </h1>

                  <p className="text-gray-500 mt-2">
                      Scan visitor QR pass
                  </p>

              </div>


              {/* mode toggle */}
              <div className="bg-white rounded-3xl p-3 shadow-md border border-gray-100 flex gap-3">

                  {/* check in */}
                  <button
                      onClick={() =>
                          setMode('check-in')
                      }
                      className={`flex-1 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2
                          
                          ${
                              mode === 'check-in'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }
                      `}
                  >

                      <LogIn size={20} />

                      Check-In

                  </button>


                  {/* check out */}
                  <button
                      onClick={() =>
                          setMode('check-out')
                      }
                      className={`flex-1 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2

                          ${
                              mode === 'check-out'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }
                      `}
                  >

                      <LogOut size={20} />

                      Check-Out

                  </button>

              </div>


              {/* scanner */}
              {
                  scanning && (

                      <QRScanner
                          onScan={handleScan}
                      />
                  )
              }


              {/* result */}
              {
                  result && (

                      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

                          <div className="flex items-center gap-3 mb-6">

                              <ScanLine
                                  size={28}
                                  className="text-green-600"
                              />

                              <h2 className="text-2xl font-bold text-gray-800">
                                  Scan Successful
                              </h2>

                          </div>


                          {/* visitor info */}
                          <div className="space-y-4">

                              <div className="flex justify-between border-b pb-3">

                                  <span className="text-gray-500">
                                      Visitor
                                  </span>

                                  <span className="font-semibold text-gray-800">
                                      {result.visitor?.name}
                                  </span>

                              </div>


                              <div className="flex justify-between border-b pb-3">

                                  <span className="text-gray-500">
                                      Status
                                  </span>

                                  <span className="font-semibold text-green-600">
                                      {result.message}
                                  </span>

                              </div>


                              <div className="flex justify-between">

                                  <span className="text-gray-500">
                                      Gate
                                  </span>

                                  <span className="font-medium text-gray-800">
                                      Main Gate
                                  </span>

                              </div>

                          </div>


                          {/* next scan */}
                          <button
                              onClick={resetScanner}
                              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                          >

                              <RefreshCcw size={20} />

                              Scan Next Visitor

                          </button>

                      </div>
                  )
              }

          </div>

      </div>
  );
}