import React, { useState } from 'react'
import { Calculate } from './Calculate'

export default function Form() {
    return (
        <div className='form_view'>
            <input placeholder='Radius' type='range' id="radius" value={5} min={1} max={20} onChange={() => Calculate()} />
            <input placeholder='FOV Angle' type='range' id="fov" value={45} min={1} max={100} onChange={() => Calculate()} />
            <input placeholder='Latitude' type='text' id="lat" />
            <input placeholder='Longitude' type='text' id="long" />
            <button className='btn' onClick={() => Calculate()}>
                Submit
            </button>
        </div>
    )
}

//FOV ANGLE VALUE SHOULD BE PERCENT
//TURN IT INTO A SLIDER
//MAX VALUE 50?