import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom"
import { OxfordList } from "../../hooks/string/OxfordList.tsx"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth.js";
import EmployeeRepository from "../../repositories/EmployeeRepository.js";
import LocationRepository from "../../repositories/LocationRepository"
import "./Location.css"


export default () => {
    const [animals, setAnimals] = useState([])
    const [nonLocationEmployees, updateEmployees] = useState([])
    const [location, set] = useState({animals:[], employeeLocations: []})
    const {getCurrentUser} = useSimpleAuth();

    const { locationId } = useParams()

    const constructNewEmployeeLocation = (e) => {
        const obj = {
            locationId: parseInt(locationId),
            userId: parseInt(e.target.value)
        }
        EmployeeRepository.assignEmployee(obj)
        .then(LocationRepository.get(locationId).then(set))
    }

    useEffect(() => {
        EmployeeRepository.getAll().then((allEmployees) => {
            const filtered = allEmployees.filter((e) => {
                const arr = e.employeeLocations.map((emploc) => emploc.locationId)
                return !arr.includes(parseInt(locationId))
            })
            return updateEmployees(filtered)
        })
    }, [location])


    useEffect(() => {
       LocationRepository.get(locationId).then(set)
    }, [locationId])

    return (
        <>
            <div className="jumbotron detailCard">
                <h1 className="display-4">{location.name}</h1>
                <p className="lead detailCard__lead">
                We currently have {location.animals.length} animals in our care.
                    Currently caring for
                    {
                        location.animals.map((a, idx, arr) =>
                            <span key={idx}>
                                {idx > 0 && ", "}
                                <Link to={`/animals/${a.id}`}> {a.name}</Link>
                            </span>
                        )
                    }       
       
                </p>

                <hr className="my-4" />
                {
                    getCurrentUser().employee
                    ? <div>
                        Add An Employee?{" "}
                        <select
                        onChange={constructNewEmployeeLocation}>
                            <option>Select An Employee</option>
                            {nonLocationEmployees.map((emp) => <option value={emp.id} key={emp.id}>
                                {emp.name}</option>)}
                        </select>
                    </div>
                    : ""
                }
                        <p className="lead detailCard__info">
                    {
                        `We currently have ${location.employeeLocations.length}
                        well-trained animal lovers and trainers:`
                    }

                </p>
                <p className="lead detailCard__info">
                    {OxfordList(location.employeeLocations, "employee.name")}
                </p>
            </div>
        </>
    )
}
