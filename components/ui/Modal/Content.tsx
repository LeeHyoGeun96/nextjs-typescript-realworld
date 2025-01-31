import { ModalContentProps } from "./types";

export function ModalContent({ children, className = "" }: ModalContentProps) {
  return (
    <div
      className={`
       overflow-y-auto 
      ${className}
    `}
    >
      {children}
    </div>
  );
}
