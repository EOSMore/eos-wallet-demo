import React from 'react';
import ReactDocumentTitle from 'react-document-title';

export default ({ title, ...rest }) => (
    <ReactDocumentTitle title={`${title} - ${process.env.REACT_APP_NAME}`} {...rest} />
);