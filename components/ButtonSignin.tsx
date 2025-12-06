'use client';

import Link from 'next/link';

export default function ButtonSignin({ extraStyle = '', text = 'Sign In' }) {
  return (
    <Link
      href="/login"
      className={`inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white transition-all duration-200 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 ${extraStyle}`}
    >
      {text}
    </Link>
  );
}
