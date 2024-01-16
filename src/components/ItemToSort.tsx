import React, { forwardRef } from 'react';

const Item = forwardRef<HTMLDivElement, { id: string }>(({  ...props }, ref) => {
    return (
        <div {...props} ref={ref} className='text-xl'>{`${'->>'}`}</div>
    )
});

Item.displayName = 'Item';

export default Item;

