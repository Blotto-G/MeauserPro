function Pagination({activePage, itemsCountPerPage, totalItemsCount, onChange}) {
    const pageCount = Math.ceil(totalItemsCount / itemsCountPerPage);

    const handlePrevClick = () => {
        if (activePage > 1) {
            onChange(activePage - 1);
        }
    };

    const handleNextClick = () => {
        if (activePage < pageCount) {
            onChange(activePage + 1);
        }
    };

    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onChange(i)}
                className={`page-item ${i === activePage ? 'active' : ''}`}
                disabled={i === activePage}
            >
                {i}
            </button>
        )
    }

    return (
        <div className={"pagination"}>
            <button onClick={handlePrevClick} disabled={activePage === 1}
                    className={`prev-next`}>
                {"<"}
            </button>
            {pages}
            <button onClick={handleNextClick} disabled={activePage === pageCount}
                    className={`prev-next`}>
                {">"}
            </button>
        </div>
    )
}

export default Pagination;