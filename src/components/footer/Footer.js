import React from 'react'
import LanguageSwitcher from '../LanguageSwitcher'

const Footer = () => {
  return (
    <div className='w-full bottom-0 bg-[#E10000] text-white text-center text-2xl px-20 py-2 flex items-center justify-center '>
      2021 Renaissance Library | <LanguageSwitcher />
    </div>
  )
}

export default Footer
