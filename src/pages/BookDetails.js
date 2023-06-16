import React from 'react';
import { useLocation } from 'react-router-dom';
import RelatedBooks from '../components/RelatedBooks';
import Search from '../components/Search';

const BookDetails = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    const category = queryParams.get('category');
    const author = queryParams.get('author');
    const isbn = queryParams.get('isbn');
    const headingParam = queryParams.get('heading');
    const field = queryParams.get('field');
    const innerField = queryParams.get('innerField');
    const value = queryParams.get('value');

    const heading =
        headingParam !== null && headingParam !== 'null' && headingParam !== 'undefined'
            ? headingParam
            : 'All Books';

    return (
        <div>
            <Search />
            {isbn && isbn !== 'null' && isbn !== 'undefined' && <RelatedBooks field="isbn" value={isbn} heading={`Book of ISBN: ${isbn}`} noBook={`of ISBN: ${isbn}`} />}
            {title !== null && title !== 'null' && title !== 'undefined' && <RelatedBooks field="booktitle" value={title} heading={`Book of Title: ${title}`} noBook={`of Title: ${title}`} />}
            {author !== null && author !== 'null' && author !== 'undefined' && <RelatedBooks field="author" value={author} heading={`Books of Author: ${author}`} noBook={`of Author: ${author}`} />}
            {category !== null && category !== 'null' && category !== 'undefined' && <RelatedBooks field="category" value={category} heading={`Books of Category: ${category}`} noBook={`of Category: ${category}`} />}
            {value &&
                <RelatedBooks
                    heading={heading}
                    field={field !== null && field !== 'null' && field !== 'undefined' && field}
                    innerField={innerField !== null && innerField !== 'null' && innerField !== 'undefined' && innerField}
                    value={value !== null && value !== 'null' && value !== 'undefined' && value}
                />
            }
        </div>
    );
};

export default BookDetails;
