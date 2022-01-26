import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import LocationRepository from "../../repositories/LocationRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import { useHistory } from "react-router";

export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const [locations, setLocations] = useState([])
    const [locationId, setLocationId] = useState([])
    const history = useHistory()

    useEffect(() => {
        LocationRepository.getAll()
            .then((x) => {
            setLocations(x)})
    }, [])

    useEffect(() => {
        EmployeeRepository.getAll()
            .then((x) => {
                setEmployees(x)
            })
    }, [])
    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const emp = employees.find(e => e.id === eId)
            const animal = {
                name: animalName,
                breed: breed,
                // employeeId: eId,
                locationId: parseInt(emp.locationId)
            }

            AnimalRepository.addAnimal(animal)
                .then((data) => {
                    const anmEmp = eId
                    const anmId = data.id
                    const newAnmCare = {
                        animalId: anmId,
                        userId: anmEmp
                    }
                    AnimalOwnerRepository.assignCaretaker(newAnmCare)
                }
                )
                .then(() => setEnabled(true))
                .then(() => history.push("/animals"));
            
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div>
                <label htmlFor="location">Location</label>
                    <select
                        defaultValue=""
                        name="location"
                        id="locationId"
                        className="form-control"
                        onChange={x => setLocationId(x.target.value)}
                    >
                        <option value="">Select a Location</option>
                        {locations.map((x) => (
                            <option key={x.id} id={x.id} value={x.name}>
                                {x.name}
                            </option>
                        ))}
                    </select>
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        <option key={e.id} id={e.id} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
