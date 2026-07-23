
import { createPortal } from 'react-dom'

type Props = {
    isOpen:boolean,
    title:string,
    children:React.ReactNode,
    onClose:()=>void
}

const Modal = ({isOpen,title,children,onClose}: Props) => {
    if(!isOpen){
        return null
    }
    const modalRoot  = document.getElementById("modal-root")!
    const modalContent = (
       <div className='fixed inset-0 w-screen h-screen bg-gray-500/50 flex items-center justify-center z-[100] font-mono p-4'>
        {/* Added 'flex flex-col' to the modal card container */}
        <div className='bg-white min-w-[33%] max-w-[66%] max-h-[90vh] p-5 rounded-lg flex flex-col shadow-xl'>
            
            {/* Header stays fixed at the top */}
            <div className='flex items-center justify-between pb-3 shrink-0'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                <button onClick={onClose} className="hover:text-red-500 font-bold px-2">X</button>
            </div>
            
            {/* Divider stays fixed */}
            <div className='h-0.5 w-full bg-gray-200 shrink-0'></div>
            
            <div className='flex-1 overflow-y-auto mt-4 pr-1 text-gray-700 w-full'>
                {children}
            </div>

        </div>
    </div>
    )
  return createPortal(modalContent,modalRoot)
}

export default Modal