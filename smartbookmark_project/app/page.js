"use client";
import Link from 'next/link';
import Header from '@/components/header';
import InputBox from '@/components/inputbox';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        
        {/* Header Card */}
        <Header />

        {/* Add Bookmark Card */}
        <InputBox />

      </div>
    </main>
  );
}