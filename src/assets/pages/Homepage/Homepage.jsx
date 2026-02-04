import {Link} from 'react-router-dom'
import { useState } from 'react'
import robot3 from '../../STEM_TOBBIE_THE_ROBOT_2_63def40e-9581-46ff-b86a-c56634134f4d.webp'
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