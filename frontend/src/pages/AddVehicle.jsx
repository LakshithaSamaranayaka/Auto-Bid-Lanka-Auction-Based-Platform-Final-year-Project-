import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Car, Camera, Info, DollarSign, AlertCircle, Bot, Sparkles,
    CheckCircle2, ChevronRight, ChevronLeft, Gavel, ShoppingBag,
    Layers, Clock, Fuel, Settings2, Gauge, FileText, Image, Plus,
    Trash2, Zap, Shield, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { refreshUserProfile } from '../features/authSlice';

/* ─── Step Definitions ─────────────────────────────────────── */
const STEPS = [
    { id: 1, label: 'Vehicle Info',   icon: Car },
    { id: 2, label: 'Specifications', icon: Settings2 },
    { id: 3, label: 'Photos',         icon: Camera },
    { id: 4, label: 'Pricing',        icon: DollarSign },
];

/* ─── Reusable Field Components ────────────────────────────── */
const FormField = ({ label, required, error, hint, children }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-widest">
            {label}
            {required && <span className="text-orange-500">*</span>}
        </label>
        {children}
        {hint && !error && <p className="text-[11px] text-gray-400 font-medium">{hint}</p>}
        {error && (
            <p className="text-[11px] text-red-500 font-bold uppercase tracking-wide flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
            </p>
        )}
    </div>
);

const inputCls = (err) =>
    `w-full px-4 py-3 border rounded-xl outline-none font-medium text-gray-900 transition-all
     placeholder:text-gray-300 bg-gray-50
     ${err
        ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30'
        : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white'}`;

const selectCls = (err) =>
    `w-full px-4 py-3 border rounded-xl outline-none font-medium text-gray-900 bg-gray-50 transition-all
     ${err
        ? 'border-red-300 ring-2 ring-red-100'
        : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white'}`;

/* ─── Access Denied / Gate ─────────────────────────────────── */
const Gate = ({ icon: Icon, color, title, desc, btnLabel, btnColor, onClick }) => (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
            <div className={`w-20 h-20 bg-${color}-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                <Icon className={`w-10 h-10 text-${color}-600`} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">{desc}</p>
            <button
                onClick={onClick}
                className={`px-8 py-3 bg-${btnColor}-600 hover:bg-${btnColor}-700 text-white rounded-xl font-bold transition-all shadow-lg`}
            >
                {btnLabel}
            </button>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════ */
const AddVehicle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    useEffect(() => {
        if (user) dispatch(refreshUserProfile());
    }, [dispatch]);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        make: '', model: '', year: '', vin: '',
        mileage: '', condition: 'excellent', hybridType: 'HEV',
        listingType: 'auction', directBuyPrice: '',
        startPrice: '', reservePrice: '', days: '7', durationUnit: 'days',
        transmission: 'Auto', fuelType: 'Hybrid', bodyType: 'Sedan',
        engineCC: '', description: '', history: '', accidentRecords: ''
    });
    const [images, setImages] = useState(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValuing, setIsValuing] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [errors, setErrors] = useState({});
    const [aiValuation, setAiValuation] = useState(null);

    /* ─── Handlers ─────────────────────────────────────────── */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
        }
    };
    const handleImageChange = (i, val) => {
        const next = [...images];
        next[i] = val;
        setImages(next);
        if (errors.images) setErrors(prev => { const n = { ...prev }; delete n.images; return n; });
    };
    const addImageSlot = () => { if (images.length < 6) setImages([...images, '']); };
    const removeImageSlot = (i) => {
        if (images.length <= 4) return;  // keep min 4 slots
        setImages(images.filter((_, idx) => idx !== i));
    };

    /* ─── Step Validation ──────────────────────────────────── */
    const validateStep = (step) => {
        const e = {};
        if (step === 1) {
            if (!formData.make.trim()) e.make = 'Make is required';
            if (!formData.model.trim()) e.model = 'Model is required';
            if (!formData.year) e.year = 'Year is required';
            if (!formData.vin.trim()) e.vin = 'VIN is required';
            else if (formData.vin.length < 11) e.vin = 'VIN must be at least 11 characters';
        }
        if (step === 2) {
            if (!formData.mileage) e.mileage = 'Mileage is required';
            if (!formData.engineCC) e.engineCC = 'Engine CC is required';
        }
        if (step === 3) {
            const valid = images.filter(u => u.trim() !== '');
            if (valid.length < 4) e.images = 'At least 4 vehicle photos are required';
        }
        if (step === 4) {
            if (formData.listingType !== 'auction' && (!formData.directBuyPrice || parseFloat(formData.directBuyPrice) <= 0))
                e.directBuyPrice = 'Direct buy price is required';
            if (formData.listingType !== 'direct_buy') {
                if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) e.startPrice = 'Starting price is required';
                if (!formData.reservePrice || parseFloat(formData.reservePrice) < parseFloat(formData.startPrice))
                    e.reservePrice = 'Reserve must be ≥ start price';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const goNext = () => { if (validateStep(currentStep)) setCurrentStep(s => Math.min(s + 1, 4)); };
    const goPrev = () => { setCurrentStep(s => Math.max(s - 1, 1)); };

    /* ─── AI Features ──────────────────────────────────────── */
    const handleAIValuation = async () => {
        if (!formData.make || !formData.model || !formData.year || !formData.mileage)
            return toast.error('Fill Make, Model, Year & Mileage first!');
        setIsValuing(true);
        try {
            const { data } = await api.post('/ai/valuation', {
                make: formData.make, model: formData.model, year: formData.year,
                mileage: formData.mileage, condition: formData.condition,
                fuelType: formData.fuelType, engineCC: formData.engineCC
            });
            if (data.success) {
                setAiValuation(data.valuation);
                toast.success(`AI Valuation: Rs. ${data.valuation.toLocaleString()}`, { icon: '🤖', duration: 5000 });
                if (!formData.directBuyPrice) setFormData(p => ({ ...p, directBuyPrice: data.valuation }));
                if (!formData.startPrice) setFormData(p => ({ ...p, startPrice: Math.round(data.valuation * 0.8) }));
                if (!formData.reservePrice) setFormData(p => ({ ...p, reservePrice: data.valuation }));
            }
        } catch { toast.error('AI service unavailable.'); }
        finally { setIsValuing(false); }
    };

    const handleAIDescription = async () => {
        if (!formData.make || !formData.model || !formData.year)
            return toast.error('Fill Make, Model & Year first!');
        setIsGeneratingDescription(true);
        try {
            const { data } = await api.post('/ai/description', {
                make: formData.make, model: formData.model, year: formData.year,
                transmission: formData.transmission, fuelType: formData.fuelType,
                engineCC: formData.engineCC, condition: formData.condition
            });
            if (data.success) {
                setFormData(p => ({ ...p, description: data.description }));
                toast.success('AI Description Generated!', { icon: '✨' });
            }
        } catch { toast.error('AI service unavailable.'); }
        finally { setIsGeneratingDescription(false); }
    };

    /* ─── Submit ───────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(4)) { toast.error('Please fix errors before submitting.'); return; }
        setIsSubmitting(true);
        try {
            const validImages = images.filter(u => u.trim() !== '');
            const payload = {
                make: formData.make, model: formData.model,
                year: parseInt(formData.year), vin: formData.vin,
                specs: {
                    mileage: parseInt(formData.mileage) || 0,
                    condition: formData.condition, hybridType: formData.hybridType,
                    transmission: formData.transmission, fuelType: formData.fuelType,
                    bodyType: formData.bodyType, engineCC: parseInt(formData.engineCC) || 0,
                    description: formData.description, history: formData.history,
                    accidentRecords: formData.accidentRecords
                },
                images: validImages,
                listingType: formData.listingType,
            };
            if (formData.listingType !== 'auction') payload.directBuyPrice = parseFloat(formData.directBuyPrice);
            if (formData.listingType !== 'direct_buy') {
                const startDate = new Date(), endDate = new Date();
                formData.durationUnit === 'days'
                    ? endDate.setDate(startDate.getDate() + parseInt(formData.days))
                    : endDate.setHours(startDate.getHours() + parseInt(formData.days));
                payload.auctionConfig = {
                    startPrice: parseFloat(formData.startPrice),
                    reservePrice: parseFloat(formData.reservePrice),
                    startTime: startDate.toISOString(),
                    endTime: endDate.toISOString()
                };
            }
            await api.post('/vehicles', payload);
            toast.success(t('addVehicle.successMsg'));
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || t('addVehicle.failMsg'));
        } finally { setIsSubmitting(false); }
    };

    /* ─── Access Guards ────────────────────────────────────── */
    if (user?.role !== 'seller' && user?.role !== 'admin')
        return <Gate icon={AlertCircle} color="red" btnColor="gray" title={t('addVehicle.accessDenied')} desc={t('addVehicle.accessDeniedDesc')} btnLabel={t('addVehicle.goToDashboard')} onClick={() => navigate('/dashboard')} />;
    if (user?.kycStatus !== 'approved')
        return <Gate icon={Shield} color="amber" btnColor="amber" title={t('addVehicle.verificationRequired')} desc={t('addVehicle.kycDesc')} btnLabel={t('addVehicle.completeKyc')} onClick={() => navigate('/dashboard')} />;
    if (user?.role === 'seller' && user?.bankStatus !== 'approved')
        return <Gate icon={AlertCircle} color="purple" btnColor="purple" title={t('addVehicle.bankRequired')} desc={t('addVehicle.bankDesc')} btnLabel={t('addVehicle.setupBank')} onClick={() => navigate('/dashboard')} />;

    /* ─── Step Progress ────────────────────────────────────── */
    const completedSteps = currentStep - 1;

    /* ══════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* ── Page Header ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container-fluid py-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm shadow-orange-500/30">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('addVehicle.title')}</h1>
                        </div>
                        <p className="text-gray-500 text-sm font-medium ml-12">{t('addVehicle.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-8">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* ── Step Indicator ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-0">
                            {STEPS.map((step, idx) => {
                                const Icon = step.icon;
                                const done = currentStep > step.id;
                                const active = currentStep === step.id;
                                return (
                                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                                                ${done ? 'bg-green-500 shadow-sm shadow-green-500/30' :
                                                  active ? 'bg-orange-500 shadow-sm shadow-orange-500/30' :
                                                  'bg-gray-100'}`}
                                            >
                                                {done
                                                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                                                    : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap hidden sm:block
                                                ${done ? 'text-green-600' : active ? 'text-orange-600' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {idx < STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500
                                                ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-100'}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-bold">Step {currentStep} of {STEPS.length}</p>
                            <div className="flex gap-1">
                                {STEPS.map(s => (
                                    <div key={s.id} className={`h-1 rounded-full transition-all duration-300
                                        ${currentStep > s.id ? 'w-6 bg-green-400' :
                                          currentStep === s.id ? 'w-6 bg-orange-500' : 'w-3 bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Form Card ── */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                            {/* Step Header */}
                            <div className={`px-6 py-5 border-b border-gray-50 
                                ${currentStep === 1 ? 'bg-gradient-to-r from-orange-50 to-amber-50' :
                                  currentStep === 2 ? 'bg-gradient-to-r from-blue-50 to-indigo-50' :
                                  currentStep === 3 ? 'bg-gradient-to-r from-purple-50 to-pink-50' :
                                  'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const icons = [Car, Settings2, Camera, DollarSign];
                                        const Icon = icons[currentStep - 1];
                                        const colors = ['text-orange-500', 'text-blue-500', 'text-purple-500', 'text-green-500'];
                                        return <Icon className={`w-5 h-5 ${colors[currentStep - 1]}`} />;
                                    })()}
                                    <div>
                                        <h2 className="text-base font-black text-gray-900">
                                            {['Vehicle Identity', 'Specifications & Details', 'Vehicle Photos', 'Pricing & Listing Type'][currentStep - 1]}
                                        </h2>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                                            {[
                                                'Basic information to identify your vehicle',
                                                'Technical specs and condition details',
                                                'Upload at least 4 clear photos',
                                                'Set your price and selling method'
                                            ][currentStep - 1]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">

                                {/* ══════ STEP 1: Vehicle Identity ══════ */}
                                {currentStep === 1 && (
                                    <div className="space-y-5 animate-fadein">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <FormField label={t('addVehicle.make')} required error={errors.make}>
                                                <input type="text" name="make" value={formData.make} onChange={handleChange}
                                                    className={inputCls(errors.make)} placeholder={t('addVehicle.makePlace') || 'e.g. Toyota'} />
                                            </FormField>
                                            <FormField label={t('addVehicle.model')} required error={errors.model}>
                                                <input type="text" name="model" value={formData.model} onChange={handleChange}
                                                    className={inputCls(errors.model)} placeholder={t('addVehicle.modelPlace') || 'e.g. Prius'} />
                                            </FormField>
                                            <FormField label={t('addVehicle.year')} required error={errors.year}>
                                                <input type="number" name="year" value={formData.year} onChange={handleChange}
                                                    min="2000" max="2027" className={inputCls(errors.year)} placeholder="2022" />
                                            </FormField>
                                            <FormField label={t('addVehicle.vin')} required error={errors.vin} hint="Minimum 11 characters — found on dashboard or door frame">
                                                <input type="text" name="vin" value={formData.vin} onChange={handleChange}
                                                    className={`${inputCls(errors.vin)} uppercase font-mono tracking-widest`}
                                                    placeholder={t('addVehicle.vinPlace') || 'ABC123DEF4567'} />
                                            </FormField>
                                        </div>

                                        {/* Preview strip */}
                                        {(formData.make || formData.model || formData.year) && (
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadein">
                                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <Car className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Preview</p>
                                                    <p className="font-black text-gray-900">
                                                        {[formData.year, formData.make, formData.model].filter(Boolean).join(' ')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ══════ STEP 2: Specifications ══════ */}
                                {currentStep === 2 && (
                                    <div className="space-y-5 animate-fadein">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <FormField label={t('addVehicle.odometer') || 'Mileage (km)'} required error={errors.mileage}>
                                                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange}
                                                    className={inputCls(errors.mileage)} placeholder="12500" />
                                            </FormField>
                                            <FormField label={t('addVehicle.engineCC') || 'Engine (CC)'} required error={errors.engineCC}>
                                                <input type="number" name="engineCC" value={formData.engineCC} onChange={handleChange}
                                                    className={inputCls(errors.engineCC)} placeholder="1500" />
                                            </FormField>
                                            <FormField label={t('addVehicle.condition') || 'Condition'}>
                                                <select name="condition" value={formData.condition} onChange={handleChange} className={selectCls(false)}>
                                                    <option value="new">{t('addVehicle.condNew')}</option>
                                                    <option value="excellent">{t('addVehicle.condExcellent')}</option>
                                                    <option value="good">{t('addVehicle.condGood')}</option>
                                                    <option value="fair">{t('addVehicle.condFair')}</option>
                                                </select>
                                            </FormField>
                                            <FormField label={t('addVehicle.transmission') || 'Transmission'}>
                                                <select name="transmission" value={formData.transmission} onChange={handleChange} className={selectCls(false)}>
                                                    <option value="Auto">Automatic</option>
                                                    <option value="Manual">Manual</option>
                                                </select>
                                            </FormField>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <FormField label={t('addVehicle.bodyType') || 'Body Type'}>
                                                <select name="bodyType" value={formData.bodyType} onChange={handleChange} className={selectCls(false)}>
                                                    {['Sedan','SUV','Hatchback','Coupe','Van','Pickup'].map(b => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                </select>
                                            </FormField>
                                            <FormField label={t('addVehicle.fuelType') || 'Fuel Type'}>
                                                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={selectCls(false)}>
                                                    {['Hybrid','Petrol','Diesel','Electric'].map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                            </FormField>
                                            <FormField label={t('addVehicle.hybridType') || 'Hybrid Type'}>
                                                <select name="hybridType" value={formData.hybridType} onChange={handleChange} className={selectCls(false)}>
                                                    <option value="MHEV">{t('addVehicle.mhev')}</option>
                                                    <option value="HEV">{t('addVehicle.hev')}</option>
                                                    <option value="PHEV">{t('addVehicle.phev')}</option>
                                                    <option value="None">None (Standard)</option>
                                                </select>
                                            </FormField>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField label={t('addVehicle.history') || 'Service History'}>
                                                <textarea name="history" value={formData.history} onChange={handleChange} rows={3}
                                                    className={`${inputCls(false)} resize-none`}
                                                    placeholder="Service records, major repairs, replaced parts..." />
                                            </FormField>
                                            <FormField label={t('addVehicle.accidents') || 'Accident Records'}>
                                                <textarea name="accidentRecords" value={formData.accidentRecords} onChange={handleChange} rows={3}
                                                    className={`${inputCls(false)} resize-none`}
                                                    placeholder="Past accidents or body damage? Leave blank if none." />
                                            </FormField>
                                        </div>

                                        {/* AI Description */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                                    {t('addVehicle.notes') || "Seller's Description"}
                                                </label>
                                                <button type="button" onClick={handleAIDescription} disabled={isGeneratingDescription}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border
                                                        ${isGeneratingDescription ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' :
                                                          'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}
                                                >
                                                    <Sparkles className={`w-3 h-3 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                                                    {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                                                </button>
                                            </div>
                                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                                                className={`${inputCls(false)} resize-none`}
                                                placeholder="Describe special features, interior condition, recent upgrades..." />
                                        </div>
                                    </div>
                                )}

                                {/* ══════ STEP 3: Photos ══════ */}
                                {currentStep === 3 && (
                                    <div className="space-y-5 animate-fadein">
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                            <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                                Provide <strong>direct image URLs</strong> (Imgur, Cloudinary, etc.). At least <strong>4 photos required</strong>.
                                                Include: front, rear, interior, dashboard.
                                            </p>
                                        </div>

                                        {errors.images && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                <p className="text-xs text-red-600 font-bold">{errors.images}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {images.map((url, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                                            Photo {idx + 1}
                                                            {idx < 4 && <span className="text-orange-500">*</span>}
                                                        </label>
                                                        {idx >= 4 && (
                                                            <button type="button" onClick={() => removeImageSlot(idx)}
                                                                className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <input type="url" value={url}
                                                        onChange={e => handleImageChange(idx, e.target.value)}
                                                        required={idx < 4}
                                                        placeholder="https://i.imgur.com/example.jpg"
                                                        className={`${inputCls(errors.images && idx < 4)} font-mono text-xs`}
                                                    />
                                                    {url ? (
                                                        <div className="h-28 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative group">
                                                            <img src={url} alt={`Preview ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+URL'; }} />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                                <CheckCircle2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-28 w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1">
                                                            <Image className="w-5 h-5 text-gray-300" />
                                                            <span className="text-[10px] text-gray-300 font-bold uppercase">No preview</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {images.length < 6 && (
                                            <button type="button" onClick={addImageSlot}
                                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-600 rounded-xl text-xs font-bold transition-all w-full justify-center">
                                                <Plus className="w-4 h-4" /> Add more photo slot (max 6)
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* ══════ STEP 4: Pricing ══════ */}
                                {currentStep === 4 && (
                                    <div className="space-y-5 animate-fadein">

                                        {/* AI Valuation Button & Result */}
                                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-purple-600" />
                                                <div>
                                                    <p className="text-xs font-black text-purple-700 uppercase tracking-widest">AI Price Suggestion</p>
                                                    {aiValuation
                                                        ? <p className="font-black text-purple-900">Rs. {aiValuation.toLocaleString()}</p>
                                                        : <p className="text-[11px] text-purple-500 font-medium">Get AI market valuation for your vehicle</p>}
                                                </div>
                                            </div>
                                            <button type="button" onClick={handleAIValuation} disabled={isValuing}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all border shrink-0
                                                    ${isValuing ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' :
                                                      'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-500/20'}`}
                                            >
                                                {isValuing ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Valuing...</> : <><Sparkles className="w-3.5 h-3.5" /> Get Valuation</>}
                                            </button>
                                        </div>

                                        {/* Listing Type */}
                                        <FormField label="Selling Method">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {[
                                                    { val: 'auction', icon: Gavel, label: 'Auction', desc: 'Timed bidding', color: 'orange' },
                                                    { val: 'direct_buy', icon: ShoppingBag, label: 'Direct Buy', desc: 'Fixed price', color: 'green' },
                                                    { val: 'both', icon: Layers, label: 'Both', desc: 'Bid or buy now', color: 'blue' },
                                                ].map(({ val, icon: Icon, label, desc, color }) => (
                                                    <button key={val} type="button" onClick={() => setFormData(p => ({ ...p, listingType: val }))}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all
                                                            ${formData.listingType === val
                                                                ? `border-${color}-400 bg-${color}-50 shadow-sm`
                                                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                                                    >
                                                        <Icon className={`w-5 h-5 mb-2 ${formData.listingType === val ? `text-${color}-600` : 'text-gray-400'}`} />
                                                        <p className={`font-black text-sm ${formData.listingType === val ? `text-${color}-700` : 'text-gray-700'}`}>{label}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </FormField>

                                        {/* Auction Fields */}
                                        {(formData.listingType === 'auction' || formData.listingType === 'both') && (
                                            <div className="space-y-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                                <p className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Gavel className="w-3.5 h-3.5" /> Auction Configuration
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FormField label={t('addVehicle.startPrice')} required error={errors.startPrice}>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rs.</span>
                                                            <input type="number" name="startPrice" value={formData.startPrice} onChange={handleChange}
                                                                className={`${inputCls(errors.startPrice)} pl-10`} placeholder="1,500,000" />
                                                        </div>
                                                    </FormField>
                                                    <FormField label={t('addVehicle.reservePrice')} required error={errors.reservePrice} hint={t('addVehicle.reserveDesc')}>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rs.</span>
                                                            <input type="number" name="reservePrice" value={formData.reservePrice} onChange={handleChange}
                                                                className={`${inputCls(errors.reservePrice)} pl-10`} placeholder="2,000,000" />
                                                        </div>
                                                    </FormField>
                                                </div>
                                                {/* Duration */}
                                                <FormField label={t('addVehicle.auctionDuration') || 'Auction Duration'}>
                                                    <div className="flex gap-2">
                                                        <div className="flex p-1 bg-white border border-gray-200 rounded-xl gap-1 shrink-0">
                                                            {['days','hours'].map(unit => (
                                                                <button key={unit} type="button"
                                                                    onClick={() => setFormData(p => ({ ...p, durationUnit: unit, days: unit === 'days' ? '7' : '3' }))}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all
                                                                        ${formData.durationUnit === unit ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                                >
                                                                    {unit}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <select name="days" value={formData.days} onChange={handleChange} className={`${selectCls(false)} flex-1`}>
                                                            {formData.durationUnit === 'days'
                                                                ? [1,3,5,7,14].map(d => <option key={d} value={String(d)}>{d} {t(`addVehicle.days${d}`) || (d === 1 ? 'Day' : 'Days')}</option>)
                                                                : [1,2,3,6,12,24].map(h => <option key={h} value={String(h)}>{h} Hour{h > 1 ? 's' : ''}</option>)}
                                                        </select>
                                                    </div>
                                                </FormField>
                                            </div>
                                        )}

                                        {/* Direct Buy Fields */}
                                        {(formData.listingType === 'direct_buy' || formData.listingType === 'both') && (
                                            <div className="space-y-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                                                <p className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                                                    <ShoppingBag className="w-3.5 h-3.5" /> Direct Buy Price
                                                </p>
                                                <FormField label="Buy It Now Price" required error={errors.directBuyPrice}>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rs.</span>
                                                        <input type="number" name="directBuyPrice" value={formData.directBuyPrice} onChange={handleChange}
                                                            className={`${inputCls(errors.directBuyPrice)} pl-10 font-black text-green-900`}
                                                            placeholder="2,500,000" />
                                                    </div>
                                                </FormField>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>

                            {/* ── Navigation Footer ── */}
                            <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-4">
                                <button type="button" onClick={goPrev} disabled={currentStep === 1}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>

                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    {Object.keys(errors).length > 0 && (
                                        <span className="text-red-500 font-bold flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                {currentStep < 4 ? (
                                    <button type="button" onClick={goNext}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-sm shadow-orange-500/20 text-sm">
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={isSubmitting}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 text-sm">
                                        {isSubmitting
                                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('addVehicle.processingBtn')}</>
                                            : <><CheckCircle2 className="w-4 h-4" /> {t('addVehicle.submitBtn')}</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* ── Help Strip ── */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Your listing will be <strong className="text-gray-700">reviewed by our admin team</strong> before going live. Make sure all information is accurate under Sri Lanka's AML regulations.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddVehicle;
