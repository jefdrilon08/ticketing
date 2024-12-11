import React, { useState, useEffect } from "react";

export default function MembersProfileAttachmentFiles(props) {
  return (
    <>
      <a 
        href={`/members/${props.memberId}/attachment_files/new`}
        className="btn btn-primary btn-sm"
      >
        New Attachment
      </a>
      <hr/>
      {(() => {
        if(props.records.length > 0) {
          return (
            <>
              {props.records.map((o) => {
                return (
                  <div key={`attachment-${o.id}`}>
                    <table className="table table-bordered table-sm table-hover">
                      <thead>
                        <tr>
                          <th>
                            {o.file_name}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">
                            {(() => {
                              if(o.is_image) {
                                return (
                                  <img src={`${o.link}`} width="1100" height="1000"/>
                                )
                              } else {
                                <p>
                                  No image found.
                                </p>
                              }
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr/>
                      <a href={`${o.link}`} className='btn btn-success btn-sm'>
                        Download File
                      </a>
                      <a href={`/members/${props.memberId}/attachment_files/${o.id}/edit`} className="btn btn-warning btn-sm">
                        Edit
                      </a>
                      <a href={`/members/${props.memberId}/attachment_files/${o.id}`} className="btn btn-danger btn-sm" data-confirm="Are you sure?" data-method="delete">
                        Delete
                      </a>
                    <hr/>
                  </div>
                )
              })}
            </>
          )
        } else {
          return (
            <p>
              No attachments found.
            </p>
          )
        }
      })()}
    </>
  )
}
