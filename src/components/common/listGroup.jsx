import React from 'react';

const ListGroup =  props => {

    const {items, textPropety, valueProperty} = props 
    return ( 
        <ul className="list-group">
            {items.map(item => <li key={item[valueProperty]} className="list-group-item">
                {item[textPropety]}
            </li> )}
            
        </ul>
    );
}
 
export default ListGroup;