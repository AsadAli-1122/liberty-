import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const CategoryButtons = () => {
    const { t } = useTranslation();


    return (
        <div>
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <Link to='/book-details?heading=Philosopy&field=category&innerField=undefined&value=philosopy' className='w-full border-[1px] border-red-600 hover:bg-red-600 hover:text-white px-8 py-2 rounded-md font-bold text-center tracking-wider transition-all duration-200 capitalize' >{t('Philosopy')}</Link>
                <Link to='/book-details?heading=History&field=category&innerField=undefined&value=history' className='w-full border-[1px] border-red-600 hover:bg-red-600 hover:text-white px-8 py-2 rounded-md font-bold text-center tracking-wider transition-all duration-200 capitalize' >{t('History')}</Link>
                <Link to='/book-details?heading=Enterprenuership&field=category&innerField=undefined&value=enterprenuership' className='w-full border-[1px] border-red-600 hover:bg-red-600 hover:text-white px-8 py-2 rounded-md font-bold text-center tracking-wider transition-all duration-200 capitalize' >{t('Enterprenuership')}</Link>
                <Link to='/book-details?heading=World%20Politics&field=category&innerField=undefined&value=world-politics' className='w-full border-[1px] border-red-600 hover:bg-red-600 hover:text-white px-8 py-2 rounded-md font-bold text-center tracking-wider transition-all duration-200 capitalize' >{t('World-Politics')}</Link>
            </ul>
        </div>
    )
}

export default CategoryButtons
