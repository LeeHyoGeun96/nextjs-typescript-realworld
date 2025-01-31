"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { ModalProps } from "./types";
import { ModalHeader } from "./Header";
import { ModalContent } from "./Content";
import { ModalFooter } from "./Footer";

export default function Modal({ children, onClose, className }: ModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  // ESC 키 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <div className={`absolute inset-0 z-50`} role="dialog" aria-modal="true">
      {/* 배경 */}
      <div
        className="absolute inset-0 w-full h-full bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* 모달 */}
      <div className={`absolute inset-0 flex items-center justify-center p-4 `}>
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[600px] w-5/6 ${className} `}
          onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// 서브 컴포넌트 연결
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
