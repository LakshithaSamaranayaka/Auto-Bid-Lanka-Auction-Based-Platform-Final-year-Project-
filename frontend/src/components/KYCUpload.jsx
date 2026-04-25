import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    FileUp, ShieldCheck, AlertCircle, CheckCircle2, X, Clock,
    FileText, Image, Shield, CreditCard, Car, FileCheck2
} from 'lucide-react';

const DOC_TYPES = [
    { id: 'nic', icon: CreditCard, label: 'National ID (NIC)', desc: 'Sri Lanka NIC – front & back' },
    { id: 'passport', icon: FileText, label: 'Passport', desc: 'Bio-data page clearly visible' },
    { id: 'license', icon: Car, label: "Driver's License", desc: 'Valid license – front & back' },
];

const KYCUpload = () => {
    const { user } = useSelector((state) => state.auth);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (files.length + acceptedFiles.length > 3) {
            toast.error('Maximum 3 documents allowed.');
            return;
        }
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

    const handleUpload = async () => {
        if (!selectedDocType) { toast.error('Please select a document type first.'); return; }
        if (files.length === 0) { toast.error('Please attach at least one document.'); return; }

        const formData = new FormData();
        files.forEach(f => formData.append('documents', f));
        formData.append('docType', selectedDocType);

        setIsUploading(true);
        try {
            const res = await api.post('/auth/kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message || 'Documents submitted for review!');
            setFiles([]);
            const updatedUser = { ...user, kycStatus: 'pending' };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // ─── Approved State ───────────────────────────────────────────
    if (user?.kycStatus === 'approved') {
        return (
            <div className="bg-white rounded-3xl border border-green-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Identity Verified</h3>
                    <p className="text-green-100 text-sm font-medium">Full access to bidding &amp; listing</p>
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <p className="text-sm text-green-800 font-medium">
                            Your KYC documents have been <strong>approved</strong>. You are fully verified on AutoBid Lanka.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Pending State ───────────────────────────────────────────
    if (user?.kycStatus === 'pending') {
        return (
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <Clock className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Under Review</h3>
                    <p className="text-amber-100 text-sm font-medium">Your documents are being verified</p>
                </div>
                <div className="p-5">
                    {/* Timeline */}
                    <div className="space-y-3">
                        {[
                            { label: 'Documents Received', done: true },
                            { label: 'Admin Review in Progress', done: false, active: true },
                            { label: 'Verification Complete', done: false },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${step.done ? 'bg-green-100 text-green-600' : step.active ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                                    {step.done ? '✓' : i + 1}
                                </div>
                                <span className={`text-sm font-semibold ${step.done ? 'text-green-700' : step.active ? 'text-amber-700' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 font-medium border-t border-gray-100 pt-4">
                        ⏱ Usually takes <strong>1–2 business days</strong>. You'll be notified upon approval.
                    </p>
                </div>
            </div>
        );
    }

    // ─── Upload Form ─────────────────────────────────────────────
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #f97316 0%, transparent 55%)' }} />
                <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                        <ShieldCheck className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white leading-tight">Identity Verification (KYC)</h3>
                        <p className="text-gray-400 text-xs font-medium">Required to bid &amp; list vehicles</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Step 1 – Doc Type */}
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Step 1 — Choose Document Type</p>
                    <div className="space-y-2">
                        {DOC_TYPES.map(({ id, icon: Icon, label, desc }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedDocType(id)}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${selectedDocType === id
                                    ? 'border-orange-400 bg-orange-50 shadow-sm'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'}`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedDocType === id ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold leading-tight ${selectedDocType === id ? 'text-orange-700' : 'text-gray-800'}`}>{label}</p>
                                    <p className={`text-[10px] font-medium ${selectedDocType === id ? 'text-orange-500' : 'text-gray-400'}`}>{desc}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedDocType === id ? 'border-orange-500 bg-orange-500' : 'border-gray-200'}`}>
                                    {selectedDocType === id && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2 – Drop Zone */}
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Step 2 — Upload Documents</p>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragActive
                            ? 'border-orange-400 bg-orange-50 scale-[1.01]'
                            : 'border-gray-200 hover:border-orange-300 bg-gray-50 hover:bg-orange-50/30'}`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all ${isDragActive ? 'bg-orange-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
                            <FileUp className={`w-6 h-6 ${isDragActive ? 'text-orange-500' : 'text-gray-400'}`} />
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">
                            {isDragActive ? '📂 Drop files here...' : 'Drag & drop or click to browse'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">JPG, PNG or PDF · Max 5MB · Up to 3 files</p>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-200">
                        {files.map((file, i) => {
                            const ext = file.name.split('.').pop().toUpperCase();
                            const isImg = ['JPG', 'JPEG', 'PNG'].includes(ext);
                            return (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-orange-100 transition-all">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${isImg ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                        {isImg ? <Image className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                                        <p className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); removeFile(i); }}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info Banner */}
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                        Documents are encrypted &amp; stored solely for identity verification under <strong>AML compliance</strong>. Never shared with third parties.
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0 || !selectedDocType}
                    className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                    {isUploading
                        ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                        : <><Shield className="w-4 h-4" /> Submit for Verification</>}
                </button>
            </div>
        </div>
    );
};

export default KYCUpload;
