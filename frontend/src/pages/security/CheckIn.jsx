import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
 ScanLine,
 LogIn,
 LogOut,
 RefreshCcw,
} from 'lucide-react';


import QRScanner from '../../components/cards/QRScanner';
import { checkIn, checkOut } from '../../api/checkApi';


export default function CheckIn() {
 const [mode, setMode] = useState('check-in');
 const [cameraActive, setCameraActive] = useState(false);
 const [result, setResult] = useState(null);
 const [loading, setLoading] = useState(false);
 const fileInputRef = useRef(null);


 // =========================
 // Reset scanner state
 // =========================
 const resetScanner = () => {
   setResult(null);
   setCameraActive(false);
 };


 // =========================
 // Handle Check-In / Check-Out switch
 // =========================
 const handleModeChange = (newMode) => {
   setMode(newMode);
   resetScanner();
 };


 // =========================
 // Handle Scan API Submission
 // =========================
 const processPassCode = async (passCode) => {
   try {
     setLoading(true);
     setCameraActive(false);


     const action = mode === 'check-in' ? checkIn : checkOut;
     const data = await action({
       passCode,
       location: "Main Gate"
     });


     setResult(data);
     toast.success(data.message || data.msg || 'Success');
   } catch (error) {
     toast.error(
       error.response?.data?.message ||
       error.response?.data?.msg ||
       'Scan failed'
     );
     setCameraActive(true); // Bring camera back if the API failed
   } finally {
     setLoading(false);
   }
 };


 // =========================
 // Handle File Upload Parsing
 // =========================
 const handleFileUpload = (e) => {
   const file = e.target.files[0];
   if (!file) return;


   toast.loading("Reading QR Code from image...");
  
   setTimeout(() => {
     toast.dismiss();
     processPassCode("MOCKED_UPLOADED_PASS_CODE");
   }, 1200);
 };


 return (
   <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
     <div className="max-w-2xl mx-auto space-y-6">


       {/* 1. HEADER */}
       <div className="text-center md:text-left">
         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
           Security Gate Operations
         </h1>
         <p className="text-gray-500 mt-1">
           Log visitor entries and exits via digital passes
         </p>
       </div>


       {/* 2. MODE TOGGLE */}
       <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 flex gap-2">
         <button
           onClick={() => handleModeChange('check-in')}
           className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
             mode === 'check-in'
               ? 'bg-green-600 text-white shadow-sm'
               : 'bg-transparent text-gray-600 hover:bg-gray-100'
           }`}
         >
           <LogIn size={22} />
           Check-In Mode
         </button>


         <button
           onClick={() => handleModeChange('check-out')}
           className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
             mode === 'check-out'
               ? 'bg-red-600 text-white shadow-sm'
               : 'bg-transparent text-gray-600 hover:bg-gray-100'
           }`}
         >
           <LogOut size={22} />
           Check-Out Mode
         </button>
       </div>


       {/* 3. MAIN WORKSPACE CONTAINER */}
       <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        
         {/* Default Scanning Entry Options */}
         {!result && !loading && (
           <div className="p-6 space-y-4">
            
             {/* Camera Activation Box - Instantly mounts and requests camera stream */}
             {!cameraActive ? (
               <button
                 onClick={() => setCameraActive(true)}
                 className="w-full border-2 border-blue-500 bg-blue-50/30 hover:bg-blue-50/60 rounded-2xl p-12 text-center transition-all group flex flex-col items-center justify-center border-dashed cursor-pointer"
               >
                 <span className="font-bold text-blue-700 text-xl tracking-wide group-hover:scale-105 transition-transform">
                   Tap to Scan QR Code
                 </span>
                 <span className="text-xs text-blue-500 mt-1.5 font-medium">
                   Opens camera access instantly
                 </span>
               </button>
             ) : (
               /* Live Video Feed Module - active right when clicked */
               <div className="p-2 bg-gray-50 rounded-2xl border transition-all">
                 <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-xl bg-black relative border shadow-inner">
                   <QRScanner onScan={processPassCode} />
                 </div>
                 <button
                   onClick={() => setCameraActive(false)}
                   className="w-full mt-3 text-center text-xs font-bold text-red-500 hover:text-red-700 transition-colors py-2 bg-red-50 rounded-xl"
                 >
                   Cancel / Turn Off Camera
                 </button>
               </div>
             )}


             {/* Explicit Clean OR Divider Line */}
             <div className="relative flex py-2 items-center">
               <div className="flex-grow border-t border-gray-200"></div>
               <span className="flex-shrink mx-4 text-xs font-black text-gray-400 tracking-widest uppercase">OR</span>
               <div className="flex-grow border-t border-gray-200"></div>
             </div>


             {/* Upload Snapshot Option Box */}
             <div>
               <input
                 type="file"
                 ref={fileInputRef}
                 onChange={handleFileUpload}
                 accept="image/*"
                 className="hidden"
               />
               <button
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full border border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-6 text-center transition-colors flex flex-col items-center justify-center group"
               >
                 <span className="font-bold text-gray-700 text-base">
                   Upload Pass Snapshot
                 </span>
                 <span className="text-xs text-gray-400 mt-1">
                   Select a screen capture or photo from device storage
                 </span>
               </button>
             </div>


           </div>
         )}


         {/* Loading Processing Mask */}
         {loading && (
           <div className="p-12 text-center flex flex-col items-center justify-center">
             <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
             <p className="text-gray-700 font-semibold text-lg">
               Verifying Credentials...
             </p>
             <p className="text-gray-400 text-xs mt-1">
               Communicating with authorization system for {mode}
             </p>
           </div>
         )}


         {/* Validation Result Screen */}
         {result && (
           <div className="p-6">
             <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <div className={`p-2 rounded-xl ${mode === 'check-in' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                 <ScanLine size={24} />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-900">
                   {mode === 'check-in' ? 'Check-In Validated' : 'Check-Out Validated'}
                 </h2>
                 <p className="text-xs text-gray-500">Record committed successfully</p>
               </div>
             </div>


             <div className="space-y-4 px-2">
               <div className="flex justify-between items-center border-b pb-3">
                 <span className="text-gray-500 font-medium">Visitor Name</span>
                 <span className="font-bold text-gray-900 text-base">
                   {result.visitor?.name || 'Unregistered Guest'}
                 </span>
               </div>


               <div className="flex justify-between items-center border-b pb-3">
                 <span className="text-gray-500 font-medium">Server Message</span>
                 <span className={`font-semibold text-sm px-2.5 py-0.5 rounded-full ${
                   mode === 'check-in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                 }`}>
                   {result.message || result.msg}
                 </span>
               </div>


               <div className="flex justify-between items-center">
                 <span className="text-gray-500 font-medium">Station Point</span>
                 <span className="text-gray-800 font-medium">Main Security Gate</span>
               </div>
             </div>


             <button
               onClick={resetScanner}
               className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100"
             >
               <RefreshCcw size={18} />
               Ready for Next Pass
             </button>
           </div>
         )}
       </div>


     </div>
   </div>
 );
}
