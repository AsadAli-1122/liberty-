import React from 'react'
import { Link } from 'react-router-dom'

const BackandHeading = ({topHeading}) => {
  return (
    <div className='max-w-5xl mx-auto'>
      <div className='w-full flex justify-between items-center mb-6'>
        <div>
          <Link to={-1 || '/'}>
            <i className="fa-solid fa-arrow-left text-3xl cursor-pointer"></i>
          </Link>
        </div>
        <div>
          <h1 className='text-3xl font-bold'>{topHeading}</h1>
        </div>
      </div>
    </div>
  )
}

export default BackandHeading
