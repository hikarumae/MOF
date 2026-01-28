// src/components/modals/WarningModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const WarningModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // マウント時に表示
  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景のオーバーレイ */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* モーダル本体 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-amber-500 p-4 flex items-center justify-center text-white">
          <AlertTriangle className="w-12 h-12 animate-pulse" />
        </div>
        
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            デモ利用に関する重要なお願い
          </h3>
          <div className="text-sm text-slate-600 space-y-4 text-left leading-relaxed">
            <p className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-900 font-medium">
              本アプリは社外・社内への展示を目的としたデモ環境です。
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>アップロードしたファイルは他の利用者も閲覧できます。</li>
              <li><strong className="text-red-600">実在の個人情報、機密情報、顧客データ</strong>は絶対にアップロードしないでください。</li>
              <li>デモ終了後はデータが削除される場合があります。</li>
            </ul>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-8 w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition-all shadow-lg"
          >
            理解しました
          </button>
        </div>
      </div>
    </div>
  );
};