"use client";

import { useEffect, useCallback } from "react";
import { ModalProps } from "./types";
import { ModalHeader } from "./Header";
import { ModalContent } from "./Content";
import { ModalFooter } from "./Footer";
import { allowScroll, preventScroll } from "@/utils/preventScroll";
import { createPortal } from "react-dom";

export default function Modal({ children, onClose, className }: ModalProps) {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // ESC 키 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  useEffect(() => {
    const prevScrollY = preventScroll();

    return () => {
      allowScroll(prevScrollY);
    };
  }, []);

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-black/50 transition-opacity overflow-hidden flex items-center justify-center"
      style={{ overscrollBehavior: "contain" }}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      {/* 모달 */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[600px] w-5/6 ${className}`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
}

// 서브 컴포넌트 연결
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
