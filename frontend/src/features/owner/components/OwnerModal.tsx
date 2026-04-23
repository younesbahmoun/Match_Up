import type { ReactNode } from "react";

type OwnerModalProps = {
  children: ReactNode;
  onClose: () => void;
  maxWidthClassName?: string;
};

export default function OwnerModal({
  children,
  onClose,
  maxWidthClassName = "max-w-3xl",
}: OwnerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
