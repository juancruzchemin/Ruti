import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import "../components/styles/RoutineStyles/AllRoutinePage.css"

const AllRoutines = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Función para obtener las rutinas
        const fetchRoutines = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/routines', { // Asegúrate de que esta URL sea correcta
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRoutines(response.data); // Guardamos los datos en el estado
                setLoading(false); // Cambiamos el estado de carga
            } catch (error) {
                console.error("Error fetching routines:", error);
                setError(error);
                setLoading(false); // Cambiamos el estado de carga
            }
        };

        fetchRoutines(); // Llamada a la función
    }, []);

    const handleDoubleClick = (routine) => {
        setEditingRoutine(routine._id);
        setFormData({
            name: routine.name,
            startDate: routine.startDate.split('T')[0], // Asegúrate de que la fecha esté en el formato correcto
            endDate: routine.endDate.split('T')[0] // Asegúrate de que la fecha esté en el formato correcto
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async (routineId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/routines/${routineId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRoutines(routines.map(rt => rt._id === routineId ? response.data : rt));
            setEditingRoutine(null);
        } catch (error) {
            console.error("Error updating routine:", error);
        }
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.startDate || !formData.endDate) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log("Creating routine with data:", formData); // Agregar mensaje de consola para depuración
            const response = await axios.post('http://localhost:3000/routine', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Routine created:", response.data); // Agregar mensaje de consola para depuración
            setRoutines([...routines, response.data.routine]); // Agrega la nueva rutina al estado
            setIsCreating(false);
            setFormData({
                name: '',
                startDate: '',
                endDate: ''
            });
        } catch (error) {
            console.error("Error creating routine:", error.response ? error.response.data : error.message);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({
            name: '',
            startDate: '',
            endDate: ''
        });
    };

    const handleDelete = async (routineId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/routines/${routineId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRoutines(routines.filter(rt => rt._id !== routineId));
        } catch (error) {
            console.error("Error deleting routine:", error);
        }
    };

    const handleEdit = (routine) => {
        setEditingRoutine(routine._id);
        setFormData({
            name: routine.name,
            startDate: routine.startDate.split('T')[0], // Asegúrate de que la fecha esté en el formato correcto
            endDate: routine.endDate.split('T')[0] // Asegúrate de que la fecha esté en el formato correcto
        });
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error: {error.message}</p>;

    return (
        <div className="all-routines-container my-4">
            <div className="all-routines-header">
                <h2 className="all-routines-title">All Routines</h2>
                <button className='btn btn-primary all-routines-add-button' onClick={() => setIsCreating(true)}>Add new routine</button>
            </div>
            {isCreating && (
                <div className="all-routines-create-form">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Routine Name"
                        className="all-routines-input"
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        placeholder="Start Date"
                        className="all-routines-input"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        placeholder="End Date"
                        className="all-routines-input"
                    />
                    <div className="all-routines-create-buttons">
                        <button onClick={handleCreate} className="all-routines-save-button">Create</button>
                        <button onClick={handleCancel} className="all-routines-cancel-button">Cancel</button>
                    </div>
                </div>
            )}
            <ul className="all-routines-list">
                {routines.map(routine => (
                    <li key={routine._id} className="all-routines-item">
                        {editingRoutine === routine._id ? (
                            <div className="all-routines-edit-form">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="all-routines-input"
                                />
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="all-routines-input"
                                />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="all-routines-input"
                                />
                                <button onClick={() => handleSave(routine._id)} className="all-routines-save-button">Save</button>
                            </div>
                        ) : (
                            <div className="all-routines-info">
                                <h3 className="all-routines-name">{routine.name}</h3>
                                <p className="all-routines-dates">Start Date: {new Date(routine.startDate).toLocaleDateString()}</p>
                                <p className="all-routines-dates">End Date: {new Date(routine.endDate).toLocaleDateString()}</p>
                                <Dropdown className="all-routines-menu">
                                    <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
                                        ⋮
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleEdit(routine)}>Edit</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDelete(routine._id)}>Delete</Dropdown.Item>
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

export default AllRoutines;
