// src/components/Modal.tsx
import { Show, JSX } from "solid-js";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

export default function Modal(props: ModalProps) {
  return (
    <Show when={props.isOpen}>
      <div class="modal-overlay" onClick={props.onClose}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          <button class="modal-close" onClick={props.onClose}>×</button>
          {props.children}
        </div>
      </div>
    </Show>
  );
}