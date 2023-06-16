import React from 'react';
import RelatedBooks from '../components/RelatedBooks';
import Search from '../components/Search'
import CategoryButtons from '../components/CategoryButtons';

const Home = () => {

  return (
    <>
      <div className='w-full space-y-10 py-24' style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/library.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', }}>
        <h1 className='text-center font-semibold text-3xl text-white'>African Renaissance Library</h1>
        <Search />
      </div>
      <div className='container mx-auto px-2 py-10 max-w-5xl'>
        <CategoryButtons />
        <RelatedBooks heading="All Books" slice={4} />
        <RelatedBooks field="type" innerField="value" value="recomended" heading="Recomended" slice={4} />
        <RelatedBooks field="type" innerField="value" value="favorite" heading="Most Favorite" slice={4} />
      </div>
    </>
  )
}

export default Home;

