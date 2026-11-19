import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = 'lg',
    closeable = true,
    onClose = () => {},
    panelStyle = {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthMap = {
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '40rem',
        '2xl': '48rem',
        '3xl': '54rem',
        '4xl': '58rem',
        '5xl': '66rem',
    };

    const resolvedMaxWidth = maxWidthMap[maxWidth] || maxWidth || '32rem';

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="dayal-modal"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="dayal-modal-backdrop" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className="dayal-modal-panel"
                        style={{
                            maxWidth: resolvedMaxWidth,
                            width: '100%',
                            ...panelStyle,
                        }}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
