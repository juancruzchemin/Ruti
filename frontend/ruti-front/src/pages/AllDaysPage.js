import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Collapse, Button } from 'react-bootstrap';
import "../components/styles/DayStyles/AllDayPage.css"

const AllDays = () => {
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingDay, setEditingDay] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
    });
    const [isCreating, setIsCreating] = useState(false);
    const [open, setOpen] = useState({});

    useEffect(() => {
        // Función para obtener los días
        const fetchDays = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/days', { // Asegúrate de que esta URL sea correcta
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDays(response.data); // Guardamos los datos en el estado
                setLoading(false); // Cambiamos el estado de carga
            } catch (error) {
                console.error("Error fetching days:", error);
                setError(error);
                setLoading(false); // Cambiamos el estado de carga
            }
        };

        fetchDays(); // Llamada a la función
    }, []);

    const handleDoubleClick = (day) => {
        setEditingDay(day._id);
        setFormData({
            name: day.name,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async (dayId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/days/${dayId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDays(days.map(d => d._id === dayId ? response.data : d));
            setEditingDay(null);
        } catch (error) {
            console.error("Error updating day:", error);
        }
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.date) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log("Creating day with data:", formData); // Agregar mensaje de consola para depuración
            const response = await axios.post('http://localhost:3000/days', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Day created:", response.data); // Agregar mensaje de consola para depuración
            setDays([...days, response.data.day]); // Agrega el nuevo día al estado
            setIsCreating(false);
            setFormData({
                name: '',
            });
        } catch (error) {
            console.error("Error creating day:", error.response ? error.response.data : error.message);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({
            name: '',
        });
    };

    const handleDelete = async (dayId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/days/${dayId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDays(days.filter(d => d._id !== dayId));
        } catch (error) {
            console.error("Error deleting day:", error);
        }
    };

    const handleEdit = (day) => {
        setEditingDay(day._id);
        setFormData({
            name: day.name,
        });
    };

    const toggleOpen = (dayId) => {
        setOpen(prevOpen => ({ ...prevOpen, [dayId]: !prevOpen[dayId] }));
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error: {error.message}</p>;

    return (
        <div className="all-days-container my-4">
            <div className="all-days-header">
                <h2 className="all-days-title">All Days</h2>
                <button className='btn btn-primary all-days-add-button' onClick={() => setIsCreating(true)}>Add new day</button>
            </div>
            {isCreating && (
                <div className="all-days-create-form">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Day Name"
                        className="all-days-input"
                    />
                    <div className="all-days-create-buttons">
                        <button onClick={handleCreate} className="all-days-save-button">Create</button>
                        <button onClick={handleCancel} className="all-days-cancel-button">Cancel</button>
                    </div>
                </div>
            )}
            <ul className="all-days-list">
                {days.map(day => (
                    <li key={day._id} className="all-days-item">
                        {editingDay === day._id ? (
                            <div className="all-days-edit-form">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="all-days-input"
                                />                                
                                <button onClick={() => handleSave(day._id)} className="all-days-save-button">Save</button>
                            </div>
                        ) : (
                            <div className="all-days-info">
                                <h3 className="all-days-name">{day.name}</h3>                                
                                <Button
                                    onClick={() => toggleOpen(day._id)}
                                    aria-controls={`collapse-${day._id}`}
                                    aria-expanded={open[day._id]}
                                    className="all-days-details-button"
                                >
                                    Details
                                </Button>
                                <Collapse in={open[day._id]}>
                                    <div id={`collapse-${day._id}`}>
                                        <h4>Exercises:</h4>
                                        <ul className="all-days-exercises-list">
                                            {day.exercises.map(exercise => (
                                                <li key={exercise._id} className="all-days-exercise-item">
                                                    <p>{exercise.name} {exercise.repetition}x{exercise.serie} {exercise.weight}Kg</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Collapse>
                                <Dropdown className="all-days-menu">
                                    <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
                                        ⋮
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleEdit(day)}>Edit</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDelete(day._id)}>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllDays;
