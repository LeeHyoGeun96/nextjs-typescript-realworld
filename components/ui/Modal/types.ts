export interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  showClose?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  position?: "center" | "bottom";
  className?: string;
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
  onClose: () => void;
}

export interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}
