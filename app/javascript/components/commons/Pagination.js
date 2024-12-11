import React from "react";

export default Pagination = (props) => {
  const {
    numPages,
    setNumPages,
    pages, 
    setPages,
    page,
    setPage,
    offset
  } = props;

  return (
    <nav className="pagination" role="navigation">
      {(() => {
        if (page > 1) {
          return (
            <React.Fragment>
              <span className="first" key={`pagination-first`}>
                <a
                  className="clickable"
                  href="#"
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  First
                </a>
              </span>
              {(() => {
                if (pages.length > 0 && page - offset >= offset) {
                  return (
                    <span key="prev-gap" className="page gap">
                      ...
                    </span>
                  )
                }
              })()}
              <span className="prev" key={`pagination-prev`}>
                <a
                  className="clickable"
                  href="#"
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  Prev
                </a>
              </span>
            </React.Fragment>
          )
        }
      })()}

      {pages.map((p) => {
        return (
          <span key={`page-${p}`} className={`page ${p == page ? 'current' : ''}`}>
            {(() => {
              if (p == page) {
                return p;
              } else {
                return (
                  <a 
                    href="#"
                    onClick={() => {
                      setPage(p);
                    }}
                  >
                    {p}
                  </a>
                )
              }
            })()}
          </span>
        )
      })}
      

      {(() => {
        if (page >= 1 && page != numPages) {
          return (
            <span className="next">
              <a
                className="clickable"
                href="#"
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Next
              </a>
            </span>
          )
        }
      })()}

      {(() => {
        if (pages.length > 0 && page != pages[pages.length - 1]) {
          return (
            <span className="page gap">
              ...
            </span>
          )
        }
      })()}

      {(() => {
        if (page != numPages) {
          return (
            <span className="last">
              <a
                className="clickable"
                href="#"
                onClick={() => {
                  setPage(numPages);
                }}
              >
                Last
              </a>
            </span>
          )
        }
      })()}
    </nav>
  )
}
