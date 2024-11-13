import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import {Menu, Settings, ChevronLeft, ChevronRight} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import Map from 'react-map-gl/dist/esm/components/map';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState('Race and Ethnicity');
  const [time, setTime] = useState(2024);
  const [mapData, setMapData] = useState(null)

  // dump our observable mapping function in here
  useEffect(() => {
    async function fetchData() {
      // use static URL for now, test with dropdown menu later
      try {
        const response = await fetch('https://api.census.gov/data/2019/pep/charagegroups?get=NAME,POP&RACE=1&for=state:*');
        const json = await response.json();
        const rows = json.slice(1).map(row => ({
          state: row[3].padStart(2, '0'),
          NAME: row[0],
          POP: row[1],
          RACE: row[2]
        }));

        function unpack(rows, key) {
          return rows.map(row => row[key]);
        }

        // US Census represents states with codes instead of abbreviations (01, 02 instead of AK, AS), so we need to map each code to its state first
        const codeToState = {
          "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
          "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
          "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
          "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
          "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
          "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
          "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
          "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
          "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
          "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
          "56": "WY"
        }

        console.log("Locations:", unpack(rows, 'state').map(code => codeToState[code.padStart(2, '0')]));
        console.log("Population (z):", unpack(rows, 'POP').map(Number));

        var plotData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: unpack(rows, 'state').map(code => codeToState[code.padStart(2, '0')]),
            z: unpack(rows, 'POP').map(Number),
            text: unpack(rows, 'NAME'),
            autocolorscale: true
            // locations: ['CA', 'TX', 'NY'], // Example states
            // z: [10000000, 20000000, 15000000], // Example population values
            // text: ['California', 'Texas', 'New York'],
            // autocolorscale: true
        }];

        var layout = {
            title: '2019 US Population by Selected Ethnicity',
            geo: {
              scope: 'usa',
              countrycolor: 'rgb(255, 255, 255)',
              showland: true,
              landcolor: 'rgb(217, 217, 217)',
              showlakes: true,
              lakecolor: 'rgb(255, 255, 255)',
              subunitcolor: 'rgb(255, 255, 255)',
              // lonaxis: {}, 
              // lataxis: {}
            },
            margin: {
              t: 30,
              l: 0,
              r: 0,
              b: 0
            },
            autosize: true
          };
        
        setMapData({data: plotData, layout})

        // const mapDiv = DOM.element('div');
        // Plotly.newPlot(mapDiv, plotData, layout, {showLink: false});
        // return mapDiv;
      } catch(err) {
        console.error("Error fetching data:", err)
      }
    }
    fetchData();
  }, [selectedDataset, time]); // rerun when dataset changes

  return(
    <div className='app-overseer-container'>
      {/* header */}
      <header className='app-header'>
        <div className='header-left'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='header-menu-button'>
              <Menu size={24} className='menu-icon'></Menu>
          </button>
          <h1 className='header-title'>MapLapse</h1>
        </div>
        <button 
          className='header-settings-button'
        ><Settings size={24} className='settings-icon'></Settings>
        </button>
      </header>

      {/* body */}
      <div className='app-body'>
        <aside className={`sidebar-container ${!sidebarOpen ? 'closed' : ''}`}>
          <div className='sidebar-content'>
            <h2 className='sidebar-title'>Available Datasets</h2>
            <div className='dataset-selector'>
              <label className='dataset-selector-option'>
                <input
                  type="radio"
                  name="dataset"
                  value="Race and Ethnicity"
                  checked={selectedDataset === 'Race and Ethnicity'}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className='dataset-selector'
                />Race and Ethnicity
              </label>
              <label className='dataset-selector-option'>
                <input
                  type="radio"
                  name="dataset"
                  value="Language Proficiency"
                  checked={selectedDataset === 'Language Proficiency'}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className='dataset-selector'
                />Language Proficiency
              </label>
            </div>
          </div>
        </aside>

        {/* map */}
        <main className='map-view-container'>
          <div className='map-view-content'>
            {/* INSERT MAPBOX MAP HERE LATER */}  
            {/* <Map
              {...viewState}
              onmove={e => setviewState(e.viewState)}
              style={{
                width: '100%',
                height: '100%'
              }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              // REPLACE THIS WITH AN .ENV TOKEN IF I EVER WANT TO HOST THIS ONLINE
              mapboxAccessToken='pk.eyJ1IjoiZ3RlcmVmIiwiYSI6ImNsdmU0Zmk3dzA1d3cycHA2b2R2MnZlengifQ.-P6AWaRKH710if95HmVTEA'
            > 
            
            </Map>   */}
            {/* using plotly instead of mapbox for now */}
            {mapData && (
              <Plot
                data={mapData.data}
                layout={mapData.layout}
                style={{
                  width: '100%',
                  height: '100%'
                }}
                useResizeHandler={true}
                config={{responsive: true}}
              ></Plot>
            )}
          </div>

          { /* sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='sidebar-toggle-button'
          >
            {sidebarOpen ? <ChevronLeft size={24} className='chevron-left-toggle'></ChevronLeft> :
                             <ChevronRight size={24} className='chevron-right-toggle'></ChevronRight>}
                  
          </button>
        </main>
      </div>
      
      {/* TIME SLIDER */}
      <div className='time-slider-container'>
        <div className='time-slider-content'>
          <label
            htmlFor='timeSlider'
            className='time-slider-label'>
          Year: {time}
          </label>
          <input
            id="timeSlider"
            type='range'
            min='2000'
            max='2024'
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
            className='time-slider-input'
          ></input>
        </div>
      </div>
    </div>
  )
}

export default App
