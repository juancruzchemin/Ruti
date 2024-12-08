import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import "../components/styles/ExerciseStyles/AllExercisePage.css"

const AllExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        repetition: '',
        serie: '',
        weight: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Función para obtener los ejercicios
        const fetchExercises = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/exercises', { // Asegúrate de que esta URL sea correcta
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setExercises(response.data); // Guardamos los datos en el estado
                setLoading(false); // Cambiamos el estado de carga
            } catch (error) {
                console.error("Error fetching exercises:", error);
                setError(error);
                setLoading(false); // Cambiamos el estado de carga
            }
        };

        fetchExercises(); // Llamada a la función
    }, []);

    const handleDoubleClick = (exercise) => {
        setEditingExercise(exercise._id);
        setFormData({
            name: exercise.name,
            repetition: exercise.repetition,
            serie: exercise.serie,
            weight: exercise.weight
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async (exerciseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/exercises/${exerciseId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExercises(exercises.map(ex => ex._id === exerciseId ? response.data : ex));
            setEditingExercise(null);
        } catch (error) {
            console.error("Error updating exercise:", error);
        }
    };

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/exercise', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExercises([...exercises, response.data]); // Agrega el nuevo ejercicio al estado
            setIsCreating(false);
            setFormData({
                name: '',
                repetition: '',
                serie: '',
                weight: ''
            });
        } catch (error) {
            console.error("Error creating exercise:", error);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({
            name: '',
            repetition: '',
            serie: '',
            weight: ''
        });
    };

    const handleDelete = async (exerciseId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/exercises/${exerciseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setExercises(exercises.filter(ex => ex._id !== exerciseId));
        } catch (error) {
            console.error("Error deleting exercise:", error);
        }
    };

    const handleEdit = (exercise) => {
        setEditingExercise(exercise._id);
        setFormData({
            name: exercise.name,
            repetition: exercise.repetition,
            serie: exercise.serie,
            weight: exercise.weight
        });
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error: {error.message}</p>;

    return (
        <div className="all-exercises-container my-4">
            <div className="all-exercises-header">
                <h2 className="all-exercises-title">All Exercises</h2>
                <button className='btn btn-primary all-exercises-add-button' onClick={() => setIsCreating(true)}>New exercise</button>
            </div>
            {isCreating && (
                <div className="all-exercises-create-form">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Exercise Name"
                        className="all-exercises-input"
                    />
                    <input
                        type="number"
                        name="repetition"
                        value={formData.repetition}
                        onChange={handleChange}
                        placeholder="Repetitions"
                        className="all-exercises-input"
                    />
                    <input
                        type="number"
                        name="serie"
                        value={formData.serie}
                        onChange={handleChange}
                        placeholder="Series"
                        className="all-exercises-input"
                    />
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight"
                        className="all-exercises-input"
                    />
                    <div className="all-exercises-create-buttons">
                        <button onClick={handleCreate} className="all-exercises-save-button">Create</button>
                        <button onClick={handleCancel} className="all-exercises-cancel-button">Cancel</button>
                    </div>
                </div>
            )}
            <ul className="all-exercises-list">
                {exercises.map(exercise => (
                    <li key={exercise._id} className="all-exercises-item">
                        {editingExercise === exercise._id ? (
                            <div className="all-exercises-edit-form">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="all-exercises-input"
                                />
                                <input
                                    type="number"
                                    name="repetition"
                                    value={formData.repetition}
                                    onChange={handleChange}
                                    className="all-exercises-input"
                                />
                                <input
                                    type="number"
                                    name="serie"
                                    value={formData.serie}
                                    onChange={handleChange}
                                    className="all-exercises-input"
                                />
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="all-exercises-input"
                                />
                                <button onClick={() => handleSave(exercise._id)} className="all-exercises-save-button">Save</button>
                            </div>
                        ) : (
                            <div className="all-exercises-info">
                                <h3 className="all-exercises-name">{exercise.name}</h3>
                                <p className="all-exercises-repetition">Repetitions: {exercise.repetition}</p>
                                <p className="all-exercises-serie">Series: {exercise.serie}</p>
                                <p className="all-exercises-weight">Weight: {exercise.weight}</p>
                                <Dropdown className="all-exercises-menu">
                                    <Dropdown.Toggle variant="icon" id="dropdown-basic" className="custom-dropdown-toggle">
                                        ⋮
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleEdit(exercise)}>Edit</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDelete(exercise._id)}>Delete</Dropdown.Item>
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

export default AllExercises;
