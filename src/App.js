import React, {useState, useEffect, useRef} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Sidebar } from 'primereact/sidebar';

const App = () => {

  const [movie, setMovie] = useState([])
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const dt = useRef(null);
  const directors = [
    {name:"John Carney"},
    {name:"Patty Jenkins"},
    {name:"Travis Fine"},
    {name:"Amy Poehler"},
    {name:"David Ayer"},
    {name:"Zack Snyder"},
    {name:"Pete Docter"},
    {name:"Ryan Coogler"},
    {name:"Luc Besson"},
  ]
  const statuses = ['general', 'CA-PG', '14 accompaniment']
  const [visibleRight, setVisibleRight] = useState(false);

  useEffect(() => {
      fetch('https://skyit-coding-challenge.herokuapp.com/movies')
        .then(response => response.json())
        .then(data => setMovie(data));
  }, [])

  const viewingAgeTemplate = (rowData) => {
    const ageClassName = classNames({
      'general': rowData.certification === 'General',
      'CA-PG': rowData.certification === 'CA-PG',
      'accompaniment': rowData.certification === '14 Accompaniment'
    })

    return (
      <div className={ageClassName}>
          {rowData.certification}
      </div>
  );
  }
  const ratingConversion = (rowData) => {
    const newRating = (rowData.rating / 5) * 100 + ".00%";
    return (
      <div>{newRating}</div>
    );
  }

  const onDirectorChange = (event) => {
    console.log(event.value);
    setSelectedDirector(event.value);
    dt.current.filter(event.value, 'director', 'in');
  }

  const onStatusChange = (event) => {
    console.log(event.value);
    setSelectedStatus(event.value);
    dt.current.filter(event.value, 'certification', 'equals');
  }

  const directorItemTemplate = (option) => {
    return(
      <span>{option.name}</span>
    )
  }

  const statusItemTemplate = (option) => {
    return(
      <span className={option}>{option}</span>
    )
  }

  const directorFilter = <MultiSelect value={selectedDirector} options={directors} itemTemplate={directorItemTemplate} onChange={onDirectorChange} optionLabel="name" optionValue="name" placeholder="All" />;
  const statusFilter = <Dropdown value={selectedStatus} options={statuses} itemTemplate={statusItemTemplate} onChange={onStatusChange} placeholder="Select a Status" showClear />;

  const sidebarOnChange = (event) => {
  if (selectedMovie !== event.value) {
        setSelectedMovie(event.value);
        setVisibleRight(true);
      }
  } 

  const onHideHelper = () => {
    setVisibleRight(false);
    setSelectedMovie([]);
  }

  const customIcons = (
    <span className="movieDetails">Movie Details</span>
  );

  const ratingFilter = (rowData) => {
    return (rowData.rating / 5 * 100 + ".00%");
  }

  return (
    <div>
      <h1 className="title">Favourite Movie List</h1>

      <div id="datatable">
        <DataTable ref={dt} value={movie} paginator rows={10}
          selection={selectedMovie} onSelectionChange={sidebarOnChange}>
          <Column selectionMode="single" headerStyle={{width: '3em'}}/>
          <Column field="title" header="Title" filter filterPlaceholder="Search by title" filterMatchMode="contains"></Column>
          <Column field="releaseDate" header="Year" filter filterPlaceholder="Search by year"></Column>
          <Column field="length" header="Running Time" filter filterPlaceholder="Search by time"></Column>
          <Column field="director" header="Director" filter filterElement={directorFilter}></Column>
          <Column field="certification" header="Certification" body={viewingAgeTemplate} filter filterElement={statusFilter}></Column>
          <Column field="rating" header="Rating" body={ratingConversion} filter filterPlaceholder="Search by rating" filterField={ratingFilter}></Column>
        </DataTable>

        <Sidebar className="p-sidebar-md" visible={visibleRight} position="right" onHide={onHideHelper} icons={customIcons}>
          <div className="popupContainer">  
            <h1>{selectedMovie.title}</h1>
            <h3>Directed by {selectedMovie.director}</h3>
            <h2>Cast: {selectedMovie.cast && selectedMovie.cast.map(item => {
              return <span id="cast"> {item} </span>
            })}
            </h2>
            <h2>Genre: {selectedMovie.genre && selectedMovie.genre.map(item => {
              return <span id="genre"> {item} </span>
            })}
            </h2>
            <h2>Plot: <span id="plot">{selectedMovie.plot}</span></h2>
          </div>
          <div className="footer">All movie data are from Wikipedia and IMDb.</div>
        </Sidebar>
      </div>
    </div>
  );
}

export default App;