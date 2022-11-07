import React, { useRef, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Title from '../text/title';
import Card from './card';
import {
  FocusScope,
  useDialog,
  useButton,
  useModal,
  useOverlay,
  usePreventScroll,
  AriaButtonProps,
  AriaOverlayProps,
  AriaDialogProps,
} from 'react-aria';

function CloseButton(props: AriaButtonProps<'button'>) {
  const ref = useRef();
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      className="inline-flex flex-shrink-0 items-center text-gray-500 hover:bg-gray-200 hover:text-gray-600 border-gray-200 rounded-lg pl-1.5 pr-1.5 pt-1.5 pb-1.5"
      ref={ref}
    >
      <XMarkIcon className="h-5 w-5" />
    </button>
  );
}

interface ModalDataProps extends AriaDialogProps, AriaOverlayProps {
  title?: string;
  children: ReactNode;
}

export default function ModalData(props: ModalDataProps) {
  const { title, children, onClose } = props;
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef();
  const { overlayProps, underlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      className="fixed inset-0 flex flex-col bg-gray-50 z-10"
      {...underlayProps}
    >
      <div className="px-6 pb-6 pt-8 sm:px-10 sm:pb-5 w-full max-w-7xl mx-auto sm:px-8">
        <FocusScope contain restoreFocus autoFocus>
          <div {...overlayProps} {...dialogProps} {...modalProps} ref={ref}>
            <Card className="p-6">
              <div className="flex justify-between">
                <Title {...titleProps}>{title}</Title>
                <CloseButton onPress={onClose} />
              </div>
              <div>{children}</div>
            </Card>
          </div>
        </FocusScope>
      </div>
    </div>
  );
}
