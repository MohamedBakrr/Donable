import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export default function Modal({ title, description, children, open, onOpenChange, wide = false }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className={`dialog-content${wide ? ' dialog-wide' : ''}`}>
                    <div className="dialog-heading">
                        <div>
                            <Dialog.Title className="dialog-title">{title}</Dialog.Title>
                            {description && <Dialog.Description className="dialog-description">{description}</Dialog.Description>}
                        </div>
                        <Dialog.Close className="icon-button" aria-label="Close dialog"><X size={18} /></Dialog.Close>
                    </div>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
