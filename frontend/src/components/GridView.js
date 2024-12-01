import React from 'react';
import { Paginator } from 'primereact/paginator';

export default function GridView({
    data,
    totalRecords,
    first,
    setFirst,
    setCurrentPage,
    gridCardTemplate,
    noMatchMessage,
}) {
    return (
        <>
            {data.length > 0 ? (
                <div className="grid-view">
                    {data.map((item) => {
                        return gridCardTemplate(item);
                    })}
                </div>
            ) : (
                <div className='block h-full'>
                    <p>{noMatchMessage}</p>
                </div>
            )}
            <Paginator
                className="pagination w-full"
                style={{ bottom: 0 }}
                first={first}
                rows={24}
                totalRecords={totalRecords}
                onPageChange={(e) => {
                    setFirst(e.first);
                    setCurrentPage(e.page + 1);
                }}
            ></Paginator>
        </>
    );
}
