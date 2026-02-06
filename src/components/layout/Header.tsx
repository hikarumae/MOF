'use client';

import React from 'react';
import { Sparkles, Bell, User } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header = ({ onLogoClick }: HeaderProps) => {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* ロゴ部分 */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          リブたす
        </span>
        <span className="text-x5 tracking-tight text-slate-800">
        司書(Librarian)が忙しいあなたを助けます
        </span>
      </div>

      {/* 右側 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Auth UI */}
        {status === "loading" ? (
          <div className="text-sm text-slate-500">loading...</div>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-700 max-w-[240px] truncate">
              {session.user.email}
            </div>
            <button
              className="px-3 py-1.5 rounded-md border border-slate-300 text-sm hover:bg-slate-50"
              onClick={() => signOut()}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <button
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            onClick={() => signIn("google")}
          >
            ログイン
          </button>
        )}

        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};
