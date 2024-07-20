'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <a href="#" className="text-white text-xl font-bold">Mystery Message</a>
      <div>
        {session ? (
          <>
            <span className="text-white mr-4">Welcome, {user.username || user.email}</span>
            <Button onClick={() => signOut()} className="bg-red-500 text-white">Logout</Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-green-500 text-white">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
