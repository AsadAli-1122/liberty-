import React from 'react'
import BackandHeading from '../components/header/BackandHeading'

const About = () => {
    return (
        <div>
            <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
                <BackandHeading topHeading={'About Us'} />
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='rounded-3xl h-80 overflow-auto p-4 space-y-2'>
                        <h1 className='font-bold tracking-wider text-3xl'>African Resinance Library</h1>
                        <p className='text-lg font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos! </p>
                    </div>
                    <div className='rounded-3xl h-80 overflow-hidden flex justify-center items-center'>
                        <img src="https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?cs=srgb&dl=pexels-ivo-rainha-1290141.jpg&fm=jpg" alt="library" className='w-full h-full' />
                    </div>
                    <div className='rounded-3xl h-80 overflow-auto p-4 space-y-4 border border-gray-400'>
                        <h1 className='font-bold tracking-wider text-2xl'>Vision</h1>
                        <p className='text-lg font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos! </p>
                    </div>
                    <div className='rounded-3xl h-80 overflow-auto p-4 space-y-4 border border-gray-400'>
                        <h1 className='font-bold tracking-wider text-2xl'>Mission</h1>
                        <p className='text-lg font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos! </p>
                    </div>
                </div>
                <p className='text-lg font-semibold py-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos!Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos!Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos! </p>
            </div>
        </div>
    )
}

export default About
