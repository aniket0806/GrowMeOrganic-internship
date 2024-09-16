import React, { useState, useRef, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import ProductService from "./service/ProductService"; 
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 

function App() {
  const [page, setPage] = useState(1);
  const [rowsToSelect, setRowsToSelect] = useState(1); 
  const [selectedArtworksIds, setSelectedArtworksIds] = useState<Set<number>>(new Set()); 
  const [allArtworks, setAllArtworks] = useState<any[]>([]); 
  const overlayPanelRef = useRef<OverlayPanel>(null); 

  const { artworks, loading, error, totalRecords } = ProductService(page);

  useEffect(() => {

    setAllArtworks(prev => [...prev, ...artworks]);
  }, [artworks]);

  const handlePageChange = (event: any) => {
    setPage(event.page + 1); 
  };

  const onSelectAllClick = (event: any) => {
    overlayPanelRef.current?.toggle(event); 
  };

  const handleSelectRowsConfirm = () => {
    if (rowsToSelect <= totalRecords && rowsToSelect > 0) {
     
      const selectedIds = new Set<number>();

      for (let i = 0; i < rowsToSelect; i++) {
        if (i < allArtworks.length) {
          selectedIds.add(allArtworks[i].id);
        } else {
          break;
        }
      }
      setSelectedArtworksIds(selectedIds); 
    } else {
      alert(`Please enter a valid number between 1 and ${totalRecords}`);
    }

    overlayPanelRef.current?.hide(); // Close the OverlayPanel after selection
  };

  const isSelected = (id: number) => selectedArtworksIds.has(id);

  return (
    <div className="App">
      <h1>Data Table</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <DataTable
            value={artworks}
            paginator
            rows={10}
            totalRecords={totalRecords}
            lazy
            onPage={handlePageChange}
            first={(page - 1) * 10}
            dataKey="id"
            selectionMode="multiple"
            selection={artworks.filter(artwork => isSelected(artwork.id))} // Bind selected rows based on IDs
            onSelectionChange={(e) => {
              const selectedIds = new Set(e.value.map((artwork: any) => artwork.id));
              setSelectedArtworksIds(selectedIds);
            }}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
              header={
                <div onClick={onSelectAllClick}>
                  <input type="checkbox" />
                </div>
              }
            />
            <Column field="title" header="Title" />
            <Column field="place_of_origin" header="Place of Origin" />
            <Column field="artist_display" header="Artist" />
            <Column field="inscriptions" header="Inscriptions" />
            <Column field="date_start" header="Start Date" />
            <Column field="date_end" header="End Date" />
          </DataTable>

          <OverlayPanel ref={overlayPanelRef} className="overlaypanel">
            <h4>Select Number of Rows</h4>
            <InputNumber
              value={rowsToSelect}
              onValueChange={(e: any) => setRowsToSelect(e.value)}
              min={1}
              max={totalRecords}
              placeholder="Enter number of rows"
            />
            <div className="flex justify-content-between mt-3">
              <Button label="Select" icon="pi pi-check" onClick={handleSelectRowsConfirm} />
            </div>
          </OverlayPanel>
        </>
      )}
    </div>
  );
}

export default App;


