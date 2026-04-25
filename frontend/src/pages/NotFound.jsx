import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full text-center">

                {/* 404 Visual Elements */}
                <div className="relative mb-8">
                    <h1 className="text-[12rem] font-black text-gray-100 tracking-tighter leading-none select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center flex-col shadow-2xl bg-white/40 backdrop-blur-md rounded-[3rem] p-12 -mt-10 mx-auto max-w-lg border border-white/50">
                        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border border-orange-200 rotate-12 transition-transform hover:rotate-0 duration-300">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Page Lost in Transit</h2>
                        <p className="text-gray-500 font-medium text-lg max-w-sm mx-auto">
                            The vehicle or page you are looking for has been moved, removed, or never existed in our manifest.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 relative z-10">
                    <Link to="/" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1">
                        <Home className="w-5 h-5" /> Return Home
                    </Link>
                    <Link to="/auctions" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/20 hover:-translate-y-1">
                        <Search className="w-5 h-5" /> Browse Auctions
                    </Link>
                </div>

                <p className="mt-12 text-sm text-gray-400 font-medium tracking-wide">Error Code: ERR_NOT_FOUND (404)</p>

            </div>
        </div>
    );
};

export default NotFound;
