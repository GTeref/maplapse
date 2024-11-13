import React, { useState } from 'react'
import {Menu, Settings, ChevronLeft, ChevronRight} from 'lucide-react'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(true);
  const [time, setTime] = useState(0);

  return(
    <div className='app-overseer-container'>
      {/* header */}
      <header className='app-header'>
        <div className='header-left'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='header-menu-button'>
              <Menu className='menu-icon'></Menu>
          </button>
          <h1 className='header-title'>MapLapse</h1>
        </div>
        <button 
          className='header-settings-button'
        ><Settings className='settings-icon'></Settings>
        </button>
      </header>

      {/* body */}
      <div className={`sidebar-container ${!sidebarOpen ? 'closed' : ''}`}>
        <aside className='sidebar-container'>
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
          </div>

          { /* sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='sidebar-toggle-button'
          >
            {sidebarOpen ? <ChevronLeft className='chevron-left-toggle'></ChevronLeft> :
                             <ChevronRight className='chevron-right-toggle'></ChevronRight>}
                  
          </button>
        </main>
      </div>
      
      {/* TIME SLIDER */}
      <div className='time-slider-container'>
        <div className='time-slider-content'>
          <label
            htmlFor='timeSlider'
            className='time-slider-label'>
          Time Control: {time}
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
