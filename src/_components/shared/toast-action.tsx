import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type AutoConfirmOptions = {
    onConfirm: () => void;
    /** @defaultvalue 5000 */
    delay?: number;
    /** @defaultvalue "Auto-confirming in 5 seconds" */
    subText?: string | null;
    actionButtonLabel?: string;
    canDismiss?: boolean;
    /** @defaultvalue "Cancel" */
    dismissButtonLabel?: string;
};

const toastAction = (confirmationText: string, options: AutoConfirmOptions) => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    const {
        onConfirm,
        delay = 5000,
        subText,
    } = options;

    const cleanup = () => {
        clearTimeout(timeoutId);
        toast.dismiss(toastId);
    };

    const toastId = toast(
        () => (
            <div>
                <div>
                    <p className='font-medium'>{confirmationText}</p>
                    {subText && (
                        <p className='mt-1 text-xs italic'>{subText}</p>
                    )}
                </div>
                <div className={cn('flex gap-4 w-full', options.canDismiss ? 'justify-between' : 'justify-end')}>
                    <button
                        className={'bg-black text-white text-xs px-2 py-1 rounded-sm shadow-sm'}
                        onClick={() => {
                            cleanup();
                            onConfirm();
                        }}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                    >
                        {options.actionButtonLabel ?? 'Confirm'}
                    </button>
                    {options.canDismiss && (
                        <button
                            onClick={() => {
                                cleanup();
                            }}
                        >
                            {options.dismissButtonLabel ?? 'Cancel'}
                        </button>
                    )}
                </div>
            </div>
        ),
        {
            duration: Infinity,
        }
    );

    timeoutId = setTimeout(() => {
        onConfirm();
        toast.dismiss(toastId);
    }, delay);

    return { toastId, cleanup };
};
export default toastAction;