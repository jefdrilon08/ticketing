import 
  React, { 
  useState, 
  useEffect, 
  useMemo, 
  useRef
} from "react";
import Modal from 'react-bootstrap/Modal';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from 'react-leaflet';
import axios from "axios";

export default function AdministrationCentersShow(props) {
  const [token]                             = useState(props.token);
  const [data, setData]                     = useState(props.data);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [draggable, setIsDraggable]         = useState(true);

  const markerRef = useRef(null);

  const mapEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          let temp  = {...data};
          let pos   = marker.getLatLng();

          console.log(pos);

          temp.lat  = pos.lat;
          temp.lon  = pos.lng;

          console.log(`lat: ${temp.lat} lon: ${temp.lon}`);
          setData(temp);
        }
      },
    }),
    [],
  )

  return (
    <>
      <Modal 
        show={isMapModalOpen}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>
            Setup Center Coordinates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapContainer
            center={[data.lat, data.lon]}
            zoom={13}
            scrollWheelZoom={true}
            style={{
              height: "500px"
            }}
            eventHandlers={mapEventHandlers}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
              position={{ lat: data.lat,  lon: data.lon }}
              draggable={draggable}
              ref={markerRef}
              eventHandlers={mapEventHandlers}
            >
            </Marker>
          </MapContainer>
          <hr/>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="form-group">
                <label>
                  Lat
                </label>
                <input
                  disabled={isLoading}
                  className="form-control"
                  type="number"
                  value={data.lat}
                  onChange={(event) => {
                    let temp = {...data};
                    temp.lat = event.target.value;
                    setData(temp);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 col-xs-12">
              <div className="form-group">
                <label>
                  Lon
                </label>
                <input
                  disabled={isLoading}
                  className="form-control"
                  type="number"
                  value={data.lon}
                  onChange={(event) => {
                    let temp = {...data};
                    temp.lon = event.target.value;
                    setData(temp);
                  }}
                />
              </div>
            </div>
          </div>
          <hr/>
        </Modal.Body>
        <Modal.Footer>
          <button
            disabled={isLoading}
            className="btn btn-primary"
            onClick={() => {
              setIsLoading(true);
              setIsDraggable(false);

              axios.post(
                "/api/centers/update_coordinates",
                {
                  id: data.id,
                  lat: data.lat,
                  lon: data.lon
                },
                {
                  headers: {
                    "X-KOINS-HQ-TOKEN": token
                  }
                }
              ).then((res) => {
                setIsLoading(false);
                setIsDraggable(true);
              }).catch((error) => {
                console.log(error);
                alert("Error in updating coordinates!");
                setIsLoading(false);
                setIsDraggable(true);
              });
            }}
          >
            <i className="bi bi-check me-2"/>
            Save
          </button>
          <button
            disabled={isLoading}
            className="btn btn-secondary"
            onClick={() => {
              setIsMapModalOpen(false);
            }}
          >
            <i className="bi bi-x me-2"/>
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-md-6 col-xs-12">
          <h2>
            {data.name}
          </h2>
        </div>
        <div className="col-md-6 col-xs-12 text-end">
          <button
            className="btn btn-success"
            onClick={() => {
              window.location.href=`/administration/centers/${data.id}/edit`;
            }}
          >
            <i className="bi bi-pencil me-2"/>
            Edit
          </button>
          <button
            className="btn btn-secondary ms-4"
            onClick={() => {
              setIsMapModalOpen(true);
            }}
          >
            <i className="bi bi-map me-2"/>
            Map
          </button>
        </div>
      </div>
      <hr/>
      <table className="table table-bordered table-sm">
        <tbody>
          <tr>
            <th>
              Branch
            </th>
            <th>
              <a href={`/administration/branches/${data.branch_id}`}>
                {data.branch}
              </a>
            </th>
          </tr>
          <tr>
            <th>
              Meeting Day
            </th>
            <td>
              {data.meeting_day_display}
            </td>
          </tr>
          <tr>
            <th>
              Socio-economic Officer 
            </th>
            <td>
              {data.user}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
