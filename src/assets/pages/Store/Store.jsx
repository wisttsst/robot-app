import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import robot1 from '../../interactive-toy-cyborg-robot-dog-260nw-2482131865.webp'
import robot2 from '../../pngtree-3d-render-of-blue-robot-character-png-image_1508576.jpg'
import robot3 from '../../STEM_TOBBIE_THE_ROBOT_2_63def40e-9581-46ff-b86a-c56634134f4d.webp'
import robot4 from '../../graident-ai-robot-vectorart_78370-4114.avif'
import { getAllRobots, deleteAllRobotsFromFirestore } from '../../../firebase'
import './Store.css'

function Store () {
    const [selectedRobot, setSelectedRobot] = useState(null)
    const [robotsData, setRobotsData] = useState({})
    const [loading, setLoading] = useState(true)

    const robots = [
        { name: 'Robot 1', image: robot1 },
        { name: 'Robot 2', image: robot2 },
        { name: 'Robot 3', image: robot3 },
        { name: 'Robot 4', image: robot4 }
    ]

    useEffect(() => {
        // Load robot data from Firestore
        const loadRobotsFromFirestore = async () => {
            try {
                const firestoreRobots = await getAllRobots()
                const data = {}
                firestoreRobots.forEach(robot => {
                    data[robot.name] = {
                        id: robot.id,
                        ...robot
                    }
                })
                setRobotsData(data)
            } catch (error) {
                console.error("Failed to load robots from Firestore:", error)
                // Fallback to localStorage if Firestore fails
                const data = {}
                robots.forEach(robot => {
                    const storedData = localStorage.getItem(`robot_${robot.name}`)
                    if (storedData) {
                        data[robot.name] = JSON.parse(storedData)
                    }
                })
                setRobotsData(data)
            } finally {
                setLoading(false)
            }
        }
        loadRobotsFromFirestore()
    }, [])

    const handleRobotSelect = (robot) => {
        setSelectedRobot(robot)
        localStorage.setItem('selectedRobot', JSON.stringify(robot))
    }

    const getRobotDisplayName = (robotName) => {
        if (robotsData[robotName] && robotsData[robotName].customName) {
            return robotsData[robotName].customName
        }
        return robotName
    }

    const getRobotStatus = (robotName) => {
        if (robotsData[robotName]) {
            return robotsData[robotName].status || 'Broken'
        }
        return 'Broken'
    }

    const handleResetAllRobots = async () => {
        // Confirm before resetting
        if (window.confirm('Are you sure you want to reset all robots? This cannot be undone!')) {
            try {
                // Delete all robots from Firestore
                await deleteAllRobotsFromFirestore()
                
                // Clear all robot data from localStorage
                robots.forEach(robot => {
                    localStorage.removeItem(`robot_${robot.name}`)
                })
                // Clear selected robot
                localStorage.removeItem('selectedRobot')
                // Reset state
                setRobotsData({})
                setSelectedRobot(null)
                alert('All robots have been reset!')
            } catch (error) {
                console.error("Error resetting robots:", error)
                alert('Failed to reset robots. Please try again.')
            }
        }
    }

    return (
        <div className='store-container'>
            <h1>Store</h1>
            <h2>Select a Robot:</h2>
            <div className='robots-grid'>
                {robots.map((robot) => (
                    <button 
                        key={robot.name}
                        className={selectedRobot?.name === robot.name ? 'button-selected' : 'button-robot'}
                        onClick={() => handleRobotSelect(robot)}
                    >
                        <img src={robot.image} alt={robot.name} style={{ width: '150px', height: '150px' }} />
                        <p>{robot.name}</p>
                    </button>
                ))}
            </div>

            {selectedRobot && (
                <div className='selected-robot-section'>
                    <div className='robot-preview'>
                        <img src={selectedRobot.image} alt={selectedRobot.name} style={{ width: '300px', height: '300px' }} />
                    </div>
                    <div className='robot-actions'>
                        <h3>You Selected: {getRobotDisplayName(selectedRobot.name)}</h3>
                        <p style={{fontSize: '16px', color: getRobotStatus(selectedRobot.name) === 'Fixed' ? '#28a745' : '#dc3545'}}>
                            Status: {getRobotStatus(selectedRobot.name)}
                        </p>
                        <Link to={`/robot/${selectedRobot.name}`} state={{ robotImage: selectedRobot.image }}>
                            <button className='button'>Go to Second Page</button>
                        </Link>
                    </div>
                </div>
            )}

            <div className='footer-buttons'>
                <Link to="/">
                    <button className='button'>Go to Home</button>
                </Link>
                <button className='button-reset' onClick={handleResetAllRobots}>
                    Reset All Robots
                </button>
            </div>
        </div>
    )
}

export default Store;