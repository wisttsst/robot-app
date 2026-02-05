import { useParams, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getRobotByName, addRobotToFirestore, updateRobotInFirestore } from '../../../firebase.js'
import './Secondpage.css'

function Secondpage () {
    const { robotName } = useParams()
    const location = useLocation()
    const [displayRobot, setDisplayRobot] = useState(null)
    const [fillPercentage, setFillPercentage] = useState(0)
    const [isNaming, setIsNaming] = useState(false)
    const [customName, setCustomName] = useState('')
    const [robotStatus, setRobotStatus] = useState('Broken') // 'Broken' or 'Fixed'
    const [firestoreId, setFirestoreId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get robot from location state first (if coming from Store)
        if (location.state?.robotImage) {
            const loadRobotData = async () => {
                try {
                    // Try to get existing robot data from Firestore
                    const existingRobot = await getRobotByName(robotName)
                    if (existingRobot) {
                        setDisplayRobot(existingRobot)
                        setRobotStatus(existingRobot.status || 'Broken')
                        setCustomName(existingRobot.customName || '')
                        setFirestoreId(existingRobot.id)
                    } else {
                        setDisplayRobot({
                            name: robotName,
                            image: location.state.robotImage
                        })
                    }
                } catch (error) {
                    console.error("Error loading robot data:", error)
                    // Fallback to localStorage
                    const storedData = localStorage.getItem(`robot_${robotName}`)
                    if (storedData) {
                        const parsed = JSON.parse(storedData)
                        setDisplayRobot(parsed)
                        setRobotStatus(parsed.status || 'Broken')
                        setCustomName(parsed.customName || '')
                    } else {
                        setDisplayRobot({
                            name: robotName,
                            image: location.state.robotImage
                        })
                    }
                } finally {
                    setLoading(false)
                }
            }
            loadRobotData()
        } else {
            // Otherwise, try to load from localStorage
            const savedRobot = localStorage.getItem('selectedRobot')
            if (savedRobot) {
                setDisplayRobot(JSON.parse(savedRobot))
            }
            setLoading(false)
        }
    }, [location, robotName])

    const handleFillButton = () => {
        if (fillPercentage < 100) {
            const newPercentage = Math.min(fillPercentage + 10, 100)
            setFillPercentage(newPercentage)
            if (newPercentage === 100) {
                setIsNaming(true)
            }
        }
    }

    const handleSaveName = async () => {
        if (customName.trim()) {
            const robotData = {
                name: displayRobot.name,
                image: displayRobot.image,
                customName: customName,
                status: 'Fixed'
            }
            
            try {
                // Save to Firestore
                if (firestoreId) {
                    // Update existing robot
                    await updateRobotInFirestore(firestoreId, robotData)
                } else {
                    // Add new robot to Firestore
                    const newId = await addRobotToFirestore(robotData)
                    setFirestoreId(newId)
                }
                
                // Also save to localStorage for backup
                localStorage.setItem(`robot_${displayRobot.name}`, JSON.stringify(robotData))
                
                setRobotStatus('Fixed')
                setIsNaming(false)
                // Update displayRobot to show custom name
                setDisplayRobot(robotData)
            } catch (error) {
                console.error("Error saving robot:", error)
                alert("Failed to save robot. Please try again.")
            }
        }
    }

    if (loading) {
        return <div className='secondpage-container'><h1>Loading...</h1></div>
    }

    return (
        <div className='secondpage-container'>
        <h1>Robot Details</h1>
        {displayRobot && (
            <>
                <h2>{customName && robotStatus === 'Fixed' ? customName : displayRobot.name}</h2>
                <p style={{textAlign: 'center', fontSize: '18px', color: robotStatus === 'Fixed' ? '#28a745' : '#dc3545'}}>
                    Status: {robotStatus}
                </p>
            </>
        )}
        
        <div className='robot-section'>
            {displayRobot && (
                <div className='robot-image-wrapper'>
                    <img src={displayRobot.image} alt={displayRobot.name} className='robot-display-image' />
                </div>
            )}
            
            <div className='robot-buttons'>
                {robotStatus === 'Broken' ? (
                    <div className='repair-section'>
                        <h3>Repair Robot</h3>
                        <div className='progress-bar-container'>
                            <div className='progress-bar' style={{width: `${fillPercentage}%`}}></div>
                        </div>
                        <p>{fillPercentage}%</p>
                        <button className='button-primary fix-button' onClick={handleFillButton} disabled={fillPercentage === 100}>
                            <svg className='fix-button-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'></path>
                            </svg>
                            <span>{fillPercentage === 100 ? 'Ready to Name' : 'Repair'}</span>
                        </button>

                        {isNaming && (
                            <div className='naming-section'>
                                <input 
                                    type='text' 
                                    placeholder='Enter robot name' 
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className='robot-name-input'
                                />
                                <button className='button-primary' onClick={handleSaveName}>
                                    Save Name
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='robot-info'>
                        <p>Robot Name: {customName}</p>
                        <p>Status: Fixed ✓</p>
                    </div>
                )}

                <Link to="/store">
                    <button className='button-primary'>Go to Store</button>
                </Link>
                <Link to="/">
                    <button className='button-secondary'>Go to Home</button>
                </Link>
            </div>
        </div>
        </div>
    )
}

export default Secondpage;