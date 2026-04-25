import { Briefcase, ArrowRight, MapPin, Clock, DollarSign, Filter, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Careers = () => {
    const jobs = [
        {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Remote (Global)",
            type: "Full-Time",
            salary: "$120k - $160k",
            featured: true,
            desc: "Architect and scale our real-time WebSocket bidding engine. Must have extensive experience in Node.js, React, and Redis."
        },
        {
            title: "Automotive Valuation Specialist",
            department: "Operations",
            location: "Colombo, Sri Lanka (Hybrid)",
            type: "Full-Time",
            salary: "$80k - $110k",
            featured: false,
            desc: "Analyze and approve vehicle inspection reports, ensuring our platform maintains its premium-only standard for hybrid vehicles."
        },
        {
            title: "Escrow & Dispute Mediator",
            department: "Trust & Safety",
            location: "Remote (US/EU)",
            type: "Full-Time",
            salary: "$75k - $95k",
            featured: false,
            desc: "Handle critical Escrow releases, investigate buyer complaints, and ensure smooth fund transfers across our FDIC-insured banking partners."
        },
        {
            title: "Lead UI/UX Designer",
            department: "Design",
            location: "Remote (Global)",
            type: "Contract",
            salary: "$60 - $90 / hr",
            featured: false,
            desc: "Craft the next generation of our auction interface. Obsession with micro-animations and premium dark-mode aesthetics is required."
        },
        {
            title: "Blockchain Security Auditor",
            department: "Security",
            location: "Remote",
            type: "Full-Time",
            salary: "$140k - $180k",
            featured: true,
            desc: "Lead the future development of integrating smart-contract based Escrow to our traditional fiat model. High stakes, high reward."
        },
        {
            title: "Customer Success Manager",
            department: "Support",
            location: "London, UK",
            type: "Full-Time",
            salary: "£50k - £65k",
            featured: false,
            desc: "Be the face of AutoBid for high-net-worth buyers. Guide them through the KYC process and high-value vehicle acquisitions."
        }
    ];

    const departments = ["All Roles", "Engineering", "Operations", "Trust & Safety", "Design", "Security", "Support"];

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Hero Section */}
            <div className="bg-gray-900 py-32 relative overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] -translate-y-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-sm border border-orange-500/30">
                        <Briefcase className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
                        Build the Future of <br className="hidden md:block" /> <span className="text-orange-500">Auto Trading</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join a team of elite engineers, automotive enthusiasts, and security experts working to eliminate fraud from the billion-dollar used car market.
                    </p>
                </motion.div>
            </div>

            {/* Filter & Job List Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {/* Filters */}
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-gray-900 font-bold shrink-0">
                        <Filter className="w-5 h-5 text-orange-500" /> Filter by Team:
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        {departments.map((dep, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${index === 0
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {dep}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900">Open Positions <span className="text-gray-400 text-xl font-bold ml-2">({jobs.length})</span></h2>
                </div>

                {/* Job Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            key={index}
                            className={`bg-white rounded-3xl p-8 shadow-xl border relative group transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full ${job.featured ? 'border-orange-300 shadow-orange-500/10' : 'border-gray-100'
                                }`}
                        >
                            {job.featured && (
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 uppercase tracking-widest">
                                    <Zap className="w-3 h-3" /> Priority Role
                                </div>
                            )}

                            <div className="flex-grow">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-4 border border-blue-100">
                                    {job.department}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                                    {job.title}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Clock className="w-5 h-5 text-gray-400 shrink-0" /> {job.type}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <DollarSign className="w-5 h-5 text-gray-400 shrink-0" /> {job.salary}
                                    </div>
                                </div>

                                <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">
                                    {job.desc}
                                </p>
                            </div>

                            <button className="mt-8 w-full bg-gray-50 hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                                Apply Now <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Culture CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-orange-50 rounded-3xl p-10 border border-orange-100 text-center shadow-lg"
                >
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Don't see a perfect fit?</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
                        We are fundamentally changing how vehicles are bought and sold. If you believe you have a unique skillset that can help us grow, we want to hear from you anyway.
                    </p>
                    <button className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 inline-flex items-center gap-2">
                        Send General Application <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Careers;
