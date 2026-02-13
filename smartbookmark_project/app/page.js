"use client";
import Link from 'next/link';
import signup from "./signup/page";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Tplz login to access your bookmarks.<Link href="/signup">Login</Link></p>
      
    </div>
  );
}