import React from 'react';
import { Link, useParams } from 'react-router-dom';
import RelatedBooks from '../components/RelatedBooks';
import CategoryButtons from '../components/CategoryButtons';
import BackandHeading from '../components/header/BackandHeading';

const BooksByCat = () => {
    const { heading, field, innerField, value } = useParams();

    return (
        <div className='mx-auto my-12 max-w-5xl'>
            <BackandHeading topHeading={heading} />
            <CategoryButtons />

            <RelatedBooks
                field={field}
                innerField={innerField}
                value={value}
            />
        </div>
    )
}

export default BooksByCat;
