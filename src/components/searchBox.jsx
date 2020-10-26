import React from 'react'


const SearchBox = ({ value, onChange}) => {
    return (  
        <input
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Seach..."
        value={value}
        onChange={e => onchange(e.currentTarget.value)}/>
    );
}
 
export default SearchBox;