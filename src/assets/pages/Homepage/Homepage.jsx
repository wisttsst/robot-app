import {Link} from 'react-router-dom'
import { useState } from 'react'
import robot3 from '../../interactive-toy-cyborg-robot-dog-260nw-2482131865.webp'
import './Homepage.css'

function Homepage () {
    const [selectedRobot, setSelectedRobot] = useState({
        name: 'Robot 3',
        image: robot3
    })

    return (
        <div className='homepage-container'>
        <h1>Home</h1>
       <Link to={`/robot/${selectedRobot?.name}`} state={{ robotImage: selectedRobot?.image }}>
        <button className='button'>Go to second Page</button>
        </Link>

        <Link to="/store">
        <button className='button'>Go to store</button>
        </Link>
        

       

        

        </div>
    )
}

export default Homepage;