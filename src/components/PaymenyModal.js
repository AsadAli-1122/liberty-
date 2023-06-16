//client/src/components/PaymentModal.js

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Payment from './Payment';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid gray',
    borderRadius: '15px',
    boxShadow: 24,
    display: 'flex',
};


export default function PaymentModal({ amountInUSD, isAmountValid, booksData , onPaymentSuccess }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <button onClick={handleOpen} className='px-12 py-2 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-xl w-fit disabled:bg-[#b46d6d]'  disabled={isAmountValid}>Continue</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <div className='flex justify-between items-center pt-3 pb-2 px-4 space-x-12'>
                            <h1 className='text-xl font-bold tracking-wider'>Make Payment</h1>
                            <i className="fa-solid fa-circle-xmark text-xl text-gray-400 hover:text-gray-500 cursor-pointer" onClick={handleClose}></i>
                        </div>
                        <hr className='border-t border-black w-full' />
                        <div className='pb-3 pt-2'>
                            <h1 className='text-lg font-bold tracking-wider px-4'>Pay : {amountInUSD} USD </h1>
                            <Payment amountInUSD={amountInUSD} booksData={booksData} onPaymentSuccess={onPaymentSuccess} />
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
