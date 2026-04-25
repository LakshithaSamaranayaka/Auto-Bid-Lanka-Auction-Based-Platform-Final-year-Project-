import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Car, DollarSign, AlertCircle, CheckCircle2,
    Sparkles, Bell, Shield, ChevronRight, Fuel,
    Settings2, LayoutGrid, Zap, CarFront
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

/* ─── Reusable ─────────────────────────────────────────────── */
const inputCls = (err) =>
    `w-full px-4 py-3 border rounded-xl outline-none font-medium text-gray-900 transition-all bg-gray-50
     placeholder:text-gray-300
     ${err
        ? 'border-red-300 ring-2 ring-red-100 bg-red-50/30'
        : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white'}`;

const selectCls =
    `w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium text-gray-900 bg-gray-50
     focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all`;

const FieldLabel = ({ children, required }) => (
    <label className="flex items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
        {children}{required && <span className="text-orange-500">*</span>}
    </label>
);

const FieldError = ({ msg }) => msg ? (
    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" />{msg}
    </p>
) : null;

/* ─── Option Card (visual selector) ───────────────────────── */
const OptionCard = ({ label, sublabel, icon: Icon, active, onClick, color = 'orange' }) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer
            ${active
                ? `border-${color}-400 bg-${color}-50 shadow-sm`
                : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'}`}
    >
        <Icon className={`w-5 h-5 ${active ? `text-${color}-500` : 'text-gray-400'}`} />
        <span className={`text-xs font-black ${active ? `text-${color}-700` : 'text-gray-600'}`}>{label}</span>
        {sublabel && <span className={`text-[10px] font-medium ${active ? `text-${color}-400` : 'text-gray-400'}`}>{sublabel}</span>}
        {active && (
            <div className={`absolute top-2 right-2 w-4 h-4 bg-${color}-500 rounded-full flex items-center justify-center`}>
                <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
        )}
    </button>
);

/* ══════════════════════════════════════════════════════════════ */
const RequestVehicle = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        condition: 'excellent',
        hybridType: 'HEV',
        transmission: 'Auto',
        fuelType: 'Hybrid',
        bodyType: 'Sedan',
        maxPrice: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.make.trim()) newErrors.make = 'Make is required';
        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.year) newErrors.year = 'Year is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                make: formData.make,
                model: formData.model,
                year: parseInt(formData.year),
                specs: {
                    condition: formData.condition,
                    hybridType: formData.hybridType,
                    transmission: formData.transmission,
                    fuelType: formData.fuelType,
                    bodyType: formData.bodyType,
                },
                maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined
            };

            await api.post('/vehicle-requests', payload);
            setSubmitted(true);
            toast.success('Request submitted! We\'ll notify you when a match is found.', { duration: 5000 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Success State ── */
    if (submitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Request Submitted!</h2>
                    <p className="text-gray-500 font-medium mb-2 leading-relaxed text-sm">
                        We're actively scanning new listings for your{' '}
                        <span className="text-gray-900 font-black">{formData.year} {formData.make} {formData.model}</span>.
                    </p>
                    <p className="text-gray-400 text-xs font-medium mb-8">
                        You'll be notified automatically when a match is found.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-md text-sm"
                        >
                            View Dashboard
                        </button>
                        <button
                            onClick={() => { setSubmitted(false); setFormData({ make:'',model:'',year:'',condition:'excellent',hybridType:'HEV',transmission:'Auto',fuelType:'Hybrid',bodyType:'Sedan',maxPrice:'' }); }}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-sm"
                        >
                            New Request
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Vehicle preview label ── */
    const preview = [formData.year, formData.make, formData.model].filter(Boolean).join(' ');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* ── Page Header ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container-fluid py-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-sm shadow-orange-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Request a Vehicle</h1>
                        </div>
                        <p className="text-gray-500 text-sm font-medium ml-12">
                            Tell us what you're looking for — we'll match you automatically.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-8">
                <div className="max-w-2xl mx-auto space-y-5">

                    {/* ── How it works strip ── */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Car, label: 'Describe your car', color: 'bg-orange-100 text-orange-600' },
                            { icon: Sparkles, label: 'We match it', color: 'bg-purple-100 text-purple-600' },
                            { icon: Bell, label: 'Get notified', color: 'bg-green-100 text-green-600' },
                        ].map(({ icon: Icon, label, color }) => (
                            <div key={label} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Main Form Card ── */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Section: Vehicle Identity */}
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50">
                            <div className="flex items-center gap-2">
                                <Car className="w-4 h-4 text-orange-500" />
                                <p className="text-xs font-black text-orange-700 uppercase tracking-widest">Vehicle Identity</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <FieldLabel required>Make</FieldLabel>
                                    <input
                                        type="text" name="make" value={formData.make}
                                        onChange={handleChange}
                                        className={inputCls(errors.make)}
                                        placeholder={t('addVehicle.makePlace') || 'e.g. Toyota'}
                                    />
                                    <FieldError msg={errors.make} />
                                </div>
                                <div>
                                    <FieldLabel required>Model</FieldLabel>
                                    <input
                                        type="text" name="model" value={formData.model}
                                        onChange={handleChange}
                                        className={inputCls(errors.model)}
                                        placeholder={t('addVehicle.modelPlace') || 'e.g. Prius'}
                                    />
                                    <FieldError msg={errors.model} />
                                </div>
                                <div>
                                    <FieldLabel required>Year</FieldLabel>
                                    <input
                                        type="number" name="year" value={formData.year}
                                        onChange={handleChange} min="2000" max="2027"
                                        className={inputCls(errors.year)}
                                        placeholder="2022"
                                    />
                                    <FieldError msg={errors.year} />
                                </div>
                            </div>

                            {/* Live Preview */}
                            {preview && (
                                <div className="flex items-center gap-3 p-3.5 bg-orange-50 rounded-xl border border-orange-100 animate-fadein">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                        <CarFront className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest">You're requesting</p>
                                        <p className="text-sm font-black text-orange-800">{preview}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section: Body Type (visual cards) */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100/50">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-blue-500" />
                                <p className="text-xs font-black text-blue-700 uppercase tracking-widest">Body Type</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {[
                                    { val: 'Sedan',    icon: Car,        sub: 'Saloon' },
                                    { val: 'SUV',      icon: Car,        sub: '4WD / RV' },
                                    { val: 'Hatchback',icon: Car,        sub: 'Compact' },
                                    { val: 'Coupe',    icon: Car,        sub: '2-door' },
                                    { val: 'Van',      icon: Car,        sub: 'MPV' },
                                    { val: 'Pickup',   icon: Car,        sub: 'Truck' },
                                ].map(({ val, icon, sub }) => (
                                    <OptionCard
                                        key={val}
                                        label={val}
                                        sublabel={sub}
                                        icon={icon}
                                        active={formData.bodyType === val}
                                        onClick={() => setFormData(p => ({ ...p, bodyType: val }))}
                                        color="blue"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Section: Specifications */}
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-y border-purple-100/50">
                            <div className="flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-purple-500" />
                                <p className="text-xs font-black text-purple-700 uppercase tracking-widest">Specifications</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Condition */}
                            <div>
                                <FieldLabel>Condition</FieldLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { val: 'new',       label: 'Brand New',  emoji: '✨' },
                                        { val: 'excellent', label: 'Excellent',   emoji: '⭐' },
                                        { val: 'good',      label: 'Good',        emoji: '👍' },
                                        { val: 'fair',      label: 'Fair',        emoji: '🔧' },
                                    ].map(({ val, label, emoji }) => (
                                        <button
                                            key={val} type="button"
                                            onClick={() => setFormData(p => ({ ...p, condition: val }))}
                                            className={`py-3 px-3 rounded-xl border-2 text-xs font-black transition-all text-center
                                                ${formData.condition === val
                                                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}`}
                                        >
                                            <div className="text-lg mb-1">{emoji}</div>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <FieldLabel>Fuel Type</FieldLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { val: 'Hybrid',   label: 'Hybrid',   icon: Zap },
                                        { val: 'Petrol',   label: 'Petrol',   icon: Fuel },
                                        { val: 'Diesel',   label: 'Diesel',   icon: Fuel },
                                        { val: 'Electric', label: 'Electric', icon: Zap },
                                    ].map(({ val, label, icon: Icon }) => (
                                        <OptionCard
                                            key={val} label={label} icon={Icon}
                                            active={formData.fuelType === val}
                                            onClick={() => setFormData(p => ({ ...p, fuelType: val }))}
                                            color="green"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Transmission + Hybrid Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Transmission</FieldLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { val: 'Auto',   label: 'Automatic' },
                                            { val: 'Manual', label: 'Manual' },
                                        ].map(({ val, label }) => (
                                            <button
                                                key={val} type="button"
                                                onClick={() => setFormData(p => ({ ...p, transmission: val }))}
                                                className={`py-3 rounded-xl border-2 text-xs font-black transition-all
                                                    ${formData.transmission === val
                                                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                                                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <FieldLabel>Hybrid Type</FieldLabel>
                                    <select
                                        name="hybridType" value={formData.hybridType}
                                        onChange={handleChange} className={selectCls}
                                    >
                                        <option value="MHEV">MHEV — Mild Hybrid</option>
                                        <option value="HEV">HEV — Full Hybrid</option>
                                        <option value="PHEV">PHEV — Plug-in Hybrid</option>
                                        <option value="None">None — Standard</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Budget */}
                        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-100/50">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <p className="text-xs font-black text-green-700 uppercase tracking-widest">Maximum Budget <span className="font-medium normal-case text-green-500">(optional)</span></p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm pointer-events-none">Rs.</span>
                                <input
                                    type="number" name="maxPrice" value={formData.maxPrice}
                                    onChange={handleChange}
                                    className={`${inputCls(false)} pl-12`}
                                    placeholder="8,500,000"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium mt-2">
                                Leave blank to match any price. We'll only show you vehicles within this budget.
                            </p>
                        </div>

                        {/* ── Footer / Submit ── */}
                        <div className="px-6 py-5 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Shield className="w-4 h-4 text-gray-300 shrink-0" />
                                Your request is private and only used for auto-matching.
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 text-sm shrink-0"
                            >
                                {isSubmitting
                                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                                    : <><Sparkles className="w-4 h-4" /> Submit Matching Request</>}
                            </button>
                        </div>
                    </form>

                    {/* ── Info Card ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">How Matching Works</p>
                        <div className="space-y-3">
                            {[
                                { step: '01', text: 'Your request is saved securely in our system.' },
                                { step: '02', text: 'When a seller lists a vehicle matching your criteria, you\'re auto-matched.' },
                                { step: '03', text: 'A purchase transaction is created and you\'re notified instantly.' },
                            ].map(({ step, text }) => (
                                <div key={step} className="flex items-start gap-3">
                                    <span className="text-[10px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md shrink-0 mt-0.5">{step}</span>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RequestVehicle;
